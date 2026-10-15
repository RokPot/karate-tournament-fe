import { CommonModels } from "@/data/common/common.models";

import type { DraftParticipant, DraftTeam } from "../types";
import type { TeamNameFormatter } from "./generateTeamNames";
import { mapToBulkDto } from "./mapToBulkDto";

const formatter: TeamNameFormatter = {
  formatName: ({ club, discipline, index }) =>
    ["Team", club, discipline, String(index)].filter(Boolean).join(" "),
  disciplineLabel: (key) => (key === "kata" ? "Kata" : key),
};

const category = (
  overrides: Partial<CommonModels.CategoryResponseDto>,
): CommonModels.CategoryResponseDto =>
  ({
    id: "kata",
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
  categoryIds: ["kata"],
  ...overrides,
});

const team = (overrides: Partial<DraftTeam>): DraftTeam => ({
  clientId: "t-1",
  categoryId: "kata-team",
  starterIds: ["user-1"],
  reserveIds: [],
  ...overrides,
});

describe("mapToBulkDto", () => {
  const categories = [
    category({ id: "kata", discipline: "kata" }),
    category({
      id: "kata-team",
      name: "Kata team",
      discipline: "kata-team",
      teamSize: 3,
    }),
  ];

  it("sends user ids and keeps existing team ids and names", () => {
    const dto = mapToBulkDto(
      "tournament-1",
      {
        email: "coach@club.com",
        firstName: "Jane",
        lastName: "Coach",
        clubName: "SKIF Ljubljana",
      },
      [
        participant({
          clientId: "user-1",
          userId: "user-1",
          categoryIds: ["kata", "kata-team"],
        }),
        participant({
          clientId: "new-1",
          firstName: "New",
          lastName: "Athlete",
          categoryIds: ["kata"],
        }),
      ],
      [
        team({
          clientId: "team-1",
          id: "team-1",
          name: "Team SL Kata 1",
          starterIds: ["user-1"],
        }),
        team({
          clientId: "team-2",
          starterIds: ["new-1"],
        }),
      ],
      categories,
      formatter,
    );

    expect(dto.participants[0]?.userId).toBe("user-1");
    expect(dto.participants[0]?.registrations).toEqual([{ categoryId: "kata" }]);
    expect(dto.participants[1]?.userId).toBeUndefined();
    expect(dto.teams?.[0]).toMatchObject({
      id: "team-1",
      name: "Team SL Kata 1",
      starters: [0],
    });
    expect(dto.teams?.[1]?.id).toBeUndefined();
    expect(dto.teams?.[1]?.name).toBe("Team SL Kata 2");
    expect(dto.teams?.[1]?.starters).toEqual([1]);
  });
});
