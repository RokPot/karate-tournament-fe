import type {
  Bracket,
  BracketMatch,
  BracketRound,
  BracketSlot,
  BracketSlotOutcome,
} from "@/components/brackets";
import { SchedulesModels } from "@/data/schedules/schedules.models";

export type BracketCompetitor = {
  id: string;
  name: string;
};

const GAME_KEY = /^r(\d+)-m(\d+)$/;

type ParsedGameKey = {
  roundIndex: number;
  matchIndex: number;
};

const parseGameKey = (key: string): ParsedGameKey | undefined => {
  const match = GAME_KEY.exec(key);
  if (!match) {
    return undefined;
  }
  return {
    roundIndex: Number(match[1]),
    matchIndex: Number(match[2]),
  };
};

const mapCompetitor = (
  competitor: SchedulesModels.CompetitorRefDto | null | undefined,
  competitorId: string | null | undefined,
): BracketCompetitor | undefined => {
  const id = competitor?.id ?? competitorId ?? undefined;
  if (!id) {
    return undefined;
  }
  return {
    id,
    name: competitor?.displayName?.trim() || "—",
  };
};

const mapSlot = (
  kind: SchedulesModels.GameSlotAKindEnum,
  competitor: SchedulesModels.CompetitorRefDto | null | undefined,
  competitorId: string | null | undefined,
  fromGameId: string | null | undefined,
  outcome: SchedulesModels.GameSlotAOutcomeEnum | null | undefined,
): BracketSlot<BracketCompetitor> => {
  if (kind === "bye") {
    return { kind: "bye" };
  }

  if (kind === "tbd") {
    return {
      kind: "tbd",
      fromMatchId: fromGameId ?? "",
      outcome: (outcome ?? "winner") as BracketSlotOutcome,
    };
  }

  const item = mapCompetitor(competitor, competitorId);
  if (!item) {
    return { kind: "bye" };
  }

  return { kind: "item", item };
};

const mapGameToMatch = (
  game: SchedulesModels.GameResponseDto,
): BracketMatch<BracketCompetitor> => ({
  id: game.id,
  item: mapSlot(
    game.slotAKind,
    game.slotACompetitor,
    game.slotACompetitorId,
    game.slotAFromGameId,
    game.slotAOutcome,
  ),
  item2: mapSlot(
    game.slotBKind,
    game.slotBCompetitor,
    game.slotBCompetitorId,
    game.slotBFromGameId,
    game.slotBOutcome,
  ),
  data: {
    winner: game.winnerSide ?? null,
    isBye: game.isBye,
  },
});

export const mapScheduleToBracket = (
  schedule: SchedulesModels.ScheduleResponseDto,
): Bracket<BracketCompetitor> => {
  const thirdPlaceGame = schedule.games.find((game) => game.isThirdPlace);
  const mainGames = schedule.games.filter((game) => !game.isThirdPlace);

  const roundsByIndex = new Map<
    number,
    Array<{ matchIndex: number; match: BracketMatch<BracketCompetitor> }>
  >();

  mainGames.forEach((game, fallbackIndex) => {
    const parsed = parseGameKey(game.key);
    const roundIndex = parsed?.roundIndex ?? 0;
    const matchIndex = parsed?.matchIndex ?? fallbackIndex;
    const round = roundsByIndex.get(roundIndex) ?? [];
    round.push({ matchIndex, match: mapGameToMatch(game) });
    roundsByIndex.set(roundIndex, round);
  });

  const rounds: BracketRound<BracketCompetitor>[] = [...roundsByIndex.entries()]
    .sort(([left], [right]) => left - right)
    .map(([roundIndex, matches]) => ({
      id: `r${roundIndex}`,
      index: roundIndex,
      matches: matches
        .sort((left, right) => left.matchIndex - right.matchIndex)
        .map((entry) => entry.match),
    }));

  return {
    kind: schedule.kind,
    size: schedule.size,
    rounds,
    thirdPlace: thirdPlaceGame
      ? mapGameToMatch(thirdPlaceGame)
      : undefined,
  };
};
