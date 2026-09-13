import { SchedulesModels } from "@/data/schedules/schedules.models";

import { mapScheduleToBracket } from "./mapScheduleToBracket";

const iso = "2026-01-01T00:00:00.000Z";

const competitor = (
  id: string,
  displayName: string,
): SchedulesModels.CompetitorRefDto => ({
  id,
  kind: "registration",
  displayName,
});

const baseGame = (
  overrides: Partial<SchedulesModels.GameResponseDto> &
    Pick<SchedulesModels.GameResponseDto, "id" | "key">,
): SchedulesModels.GameResponseDto => ({
  isThirdPlace: false,
  isBye: false,
  winnerSide: null,
  slotAKind: "item",
  slotBKind: "item",
  slotACompetitorId: null,
  slotBCompetitorId: null,
  slotACompetitor: null,
  slotBCompetitor: null,
  slotAFromGameId: null,
  slotBFromGameId: null,
  slotAOutcome: null,
  slotBOutcome: null,
  matches: [],
  ...overrides,
});

const schedule = (
  games: SchedulesModels.GameResponseDto[],
  size = 3,
): SchedulesModels.ScheduleResponseDto => ({
  id: "sched-1",
  tournamentId: "t1",
  categoryId: "c1",
  kind: "single_elimination",
  size,
  games,
  createdAt: iso,
  updatedAt: iso,
});

describe("mapScheduleToBracket", () => {
  it("groups games into rounds, maps byes/TBDs, and attaches third place", () => {
    const alice = competitor("p1", "Alice");
    const bob = competitor("p2", "Bob");
    const carol = competitor("p3", "Carol");

    const bracket = mapScheduleToBracket(
      schedule([
        baseGame({
          id: "g-final",
          key: "r1-m0",
          slotAKind: "tbd",
          slotBKind: "tbd",
          slotAFromGameId: "g-r0-m0",
          slotBFromGameId: "g-r0-m1",
          slotAOutcome: "winner",
          slotBOutcome: "winner",
        }),
        baseGame({
          id: "g-third",
          key: "tp-m0",
          isThirdPlace: true,
          slotAKind: "tbd",
          slotBKind: "tbd",
          slotAFromGameId: "g-r0-m0",
          slotBFromGameId: "g-r0-m1",
          slotAOutcome: "loser",
          slotBOutcome: "loser",
        }),
        baseGame({
          id: "g-r0-m1",
          key: "r0-m1",
          slotACompetitorId: bob.id,
          slotBCompetitorId: carol.id,
          slotACompetitor: bob,
          slotBCompetitor: carol,
        }),
        baseGame({
          id: "g-r0-m0",
          key: "r0-m0",
          isBye: true,
          winnerSide: "item",
          slotBKind: "bye",
          slotACompetitorId: alice.id,
          slotACompetitor: alice,
        }),
      ]),
    );

    expect(bracket.kind).toBe("single_elimination");
    expect(bracket.size).toBe(3);
    expect(bracket.rounds).toHaveLength(2);

    expect(bracket.rounds[0].id).toBe("r0");
    expect(bracket.rounds[0].matches.map((match) => match.id)).toEqual([
      "g-r0-m0",
      "g-r0-m1",
    ]);

    const byeMatch = bracket.rounds[0].matches[0];
    expect(byeMatch.item).toEqual({
      kind: "item",
      item: { id: "p1", name: "Alice" },
    });
    expect(byeMatch.item2).toEqual({ kind: "bye" });
    expect(byeMatch.data).toEqual({ winner: "item", isBye: true });

    const secondSemi = bracket.rounds[0].matches[1];
    expect(secondSemi.item).toEqual({
      kind: "item",
      item: { id: "p2", name: "Bob" },
    });
    expect(secondSemi.item2).toEqual({
      kind: "item",
      item: { id: "p3", name: "Carol" },
    });

    const final = bracket.rounds[1].matches[0];
    expect(final.id).toBe("g-final");
    expect(final.item).toEqual({
      kind: "tbd",
      fromMatchId: "g-r0-m0",
      outcome: "winner",
    });
    expect(final.item2).toEqual({
      kind: "tbd",
      fromMatchId: "g-r0-m1",
      outcome: "winner",
    });

    expect(bracket.thirdPlace?.id).toBe("g-third");
    expect(bracket.thirdPlace?.item).toEqual({
      kind: "tbd",
      fromMatchId: "g-r0-m0",
      outcome: "loser",
    });
    expect(bracket.thirdPlace?.item2).toEqual({
      kind: "tbd",
      fromMatchId: "g-r0-m1",
      outcome: "loser",
    });
  });

  it("falls back to a dash when displayName is missing", () => {
    const bracket = mapScheduleToBracket(
      schedule(
        [
          baseGame({
            id: "g-r0-m0",
            key: "r0-m0",
            slotACompetitorId: "p1",
            slotBKind: "bye",
            isBye: true,
            winnerSide: "item",
            slotACompetitor: {
              id: "p1",
              kind: "registration",
              displayName: null,
            },
          }),
        ],
        2,
      ),
    );

    expect(bracket.rounds[0].matches[0].item).toEqual({
      kind: "item",
      item: { id: "p1", name: "—" },
    });
  });
});
