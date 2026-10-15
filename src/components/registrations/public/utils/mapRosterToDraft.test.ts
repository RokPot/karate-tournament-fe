import { RegistrationsModels } from "@/data/registrations/registrations.models";

import { mapRosterToDraft } from "./mapRosterToDraft";

const roster = (
  overrides: Partial<RegistrationsModels.RosterResponseDto> = {},
): RegistrationsModels.RosterResponseDto => ({
  email: "coach@club.com",
  firstName: "Jane",
  lastName: "Coach",
  clubName: "SKIF Ljubljana",
  clubId: null,
  tournamentId: "tournament-1",
  updatedAt: "2026-04-15T10:00:00.000Z",
  participants: [
    {
      userId: "user-1",
      firstName: "Ada",
      lastName: "Lovelace",
      weight: null,
      dateOfBirth: "2012-05-01T00:00:00.000Z",
      gender: "female",
      beltLevel: "10-kyu",
      registrations: [{ id: "reg-1", categoryId: "kata" }],
    },
    {
      userId: "user-2",
      firstName: "Tok",
      lastName: "Pok",
      weight: 40,
      dateOfBirth: "2011-01-01T00:00:00.000Z",
      gender: null,
      beltLevel: null,
      registrations: [],
    },
  ],
  teams: [
    {
      id: "team-1",
      name: "Team SL Kata 1",
      categoryId: "kata-team",
      starters: [0, 1],
      reserves: [1],
    },
  ],
  ...overrides,
});

describe("mapRosterToDraft", () => {
  it("maps coach, participants, and team indexes into the wizard draft", () => {
    const draft = mapRosterToDraft(roster());

    expect(draft.coach).toEqual({
      email: "coach@club.com",
      firstName: "Jane",
      lastName: "Coach",
      clubName: "SKIF Ljubljana",
    });
    expect(draft.participants[0]).toMatchObject({
      clientId: "user-1",
      userId: "user-1",
      categoryIds: ["kata"],
      weight: undefined,
    });
    expect(draft.participants[1]).toMatchObject({
      clientId: "user-2",
      userId: "user-2",
      gender: "",
      beltLevel: "",
      weight: 40,
      categoryIds: [],
    });
    expect(draft.teams[0]).toEqual({
      clientId: "team-1",
      id: "team-1",
      name: "Team SL Kata 1",
      categoryId: "kata-team",
      starterIds: ["user-1", "user-2"],
      reserveIds: ["user-2"],
    });
  });

  it("omits a blank club name", () => {
    const draft = mapRosterToDraft(roster({ clubName: "  " }));
    expect(draft.coach.clubName).toBeUndefined();
  });
});
