import { CommonModels } from "@/data/common/common.models";

import type { DraftParticipant, DraftTeam } from "../types";
import { calculateDraftFees } from "./calculateDraftFees";
import type { TeamNameFormatter } from "./generateTeamNames";

const teamNameFormatter: TeamNameFormatter = {
  formatName: ({ club, discipline, index }) =>
    ["Team", club, discipline, String(index)].filter(Boolean).join(" "),
  disciplineLabel: (key) => (key === "kata" ? "Kata" : key),
};

const fees: CommonModels.TournamentFeeScheduleDto = {
  oneCategory: 10,
  twoCategories: 20,
  threeOrMoreCategories: 30,
  team: 40,
};

const category = (
  overrides: Partial<CommonModels.CategoryResponseDto>,
): CommonModels.CategoryResponseDto =>
  ({
    id: "cat-1",
    name: "Kata",
    discipline: "kata",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  }) as CommonModels.CategoryResponseDto;

const participant = (
  overrides: Partial<DraftParticipant>,
): DraftParticipant => ({
  clientId: "p-1",
  firstName: "Ada",
  lastName: "Lovelace",
  gender: "female",
  dateOfBirth: "2012-05-01T00:00:00.000Z",
  beltLevel: "10-kyu",
  categoryIds: [],
  ...overrides,
});

describe("calculateDraftFees", () => {
  const kata = category({ id: "kata", name: "Kata" });
  const kumite = category({
    id: "kumite",
    name: "Kumite",
    discipline: "yako-soku-kumite",
  });
  const kata2 = category({ id: "kata-2", name: "Kata open" });
  const teamCat = category({
    id: "team",
    name: "Kata team",
    discipline: "kata-team",
    teamSize: 3,
  });

  it("charges one, two, and three-or-more individual category rates", () => {
    const result = calculateDraftFees(
      [
        participant({ clientId: "a", categoryIds: ["kata"] }),
        participant({
          clientId: "b",
          firstName: "Tok",
          lastName: "Pok",
          categoryIds: ["kata", "kumite"],
        }),
        participant({
          clientId: "c",
          firstName: "Ann",
          lastName: "Lee",
          categoryIds: ["kata", "kumite", "kata-2"],
        }),
      ],
      [],
      [kata, kumite, kata2],
      fees,
      "SKIF Ljubljana",
      teamNameFormatter,
    );

    expect(result.participants.map((line) => line.amount)).toEqual([10, 20, 30]);
    expect(result.total).toBe(60);
  });

  it("excludes team categories from the individual count and charges each team once", () => {
    const teams: DraftTeam[] = [
      {
        clientId: "t-1",
        categoryId: "team",
        starterIds: ["p-1"],
        reserveIds: [],
      },
    ];
    const result = calculateDraftFees(
      [
        participant({
          categoryIds: ["kata", "team"],
        }),
      ],
      teams,
      [kata, teamCat],
      fees,
      "SKIF Ljubljana",
      teamNameFormatter,
    );

    expect(result.participants).toEqual([
      expect.objectContaining({
        categoryCount: 1,
        amount: 10,
      }),
    ]);
    expect(result.teams).toEqual([
      expect.objectContaining({
        categoryName: "Kata team",
        name: "Team SL Kata 1",
        amount: 40,
      }),
    ]);
    expect(result.total).toBe(50);
  });

  it("does not charge an individual fee for team-only athletes", () => {
    const result = calculateDraftFees(
      [participant({ categoryIds: ["team"] })],
      [
        {
          clientId: "t-1",
          categoryId: "team",
          starterIds: ["p-1"],
          reserveIds: [],
        },
      ],
      [teamCat],
      fees,
      "SKIF Ljubljana",
      teamNameFormatter,
    );

    expect(result.participants).toEqual([]);
    expect(result.teams).toHaveLength(1);
    expect(result.total).toBe(40);
  });
});
