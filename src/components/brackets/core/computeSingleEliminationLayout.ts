import type { Bracket, BracketMatch } from "./types";

export const BRACKET_LAYOUT = {
  slotWidth: 196,
  slotHeight: 40,
  slotGap: 20,
  roundGap: 72,
  padding: 16,
  roundTitleHeight: 32,
} as const;

export type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutNode = {
  id: string;
  matchId: string;
  roundIndex: number;
  matchIndex: number;
  kind: "slot-item" | "slot-item2" | "outcome";
  rect: LayoutRect;
  visible: boolean;
};

export type LayoutConnector = {
  id: string;
  d: string;
};

export type LayoutHeader = {
  id: string;
  columnIndex: number;
  rect: LayoutRect;
};

export type SingleEliminationLayout = {
  width: number;
  height: number;
  nodes: LayoutNode[];
  connectors: LayoutConnector[];
  headers: LayoutHeader[];
};

const slotY = (slotIndex: number) =>
  BRACKET_LAYOUT.padding +
  BRACKET_LAYOUT.roundTitleHeight +
  slotIndex * (BRACKET_LAYOUT.slotHeight + BRACKET_LAYOUT.slotGap);

const columnX = (columnIndex: number) =>
  BRACKET_LAYOUT.padding +
  columnIndex * (BRACKET_LAYOUT.slotWidth + BRACKET_LAYOUT.roundGap);

const matchSlotSpan = (roundIndex: number, matchIndex: number) => {
  const span = 2 ** (roundIndex + 1);
  const start = matchIndex * span;
  return { start, span };
};

const outcomeY = (roundIndex: number, matchIndex: number) => {
  const { start, span } = matchSlotSpan(roundIndex, matchIndex);
  const top = slotY(start);
  const bottom = slotY(start + span - 1) + BRACKET_LAYOUT.slotHeight;
  return (top + bottom) / 2 - BRACKET_LAYOUT.slotHeight / 2;
};

const rectAt = (x: number, y: number): LayoutRect => ({
  x,
  y,
  width: BRACKET_LAYOUT.slotWidth,
  height: BRACKET_LAYOUT.slotHeight,
});

const centerY = (rect: LayoutRect) => rect.y + rect.height / 2;
const rightX = (rect: LayoutRect) => rect.x + rect.width;

const forkPath = (fromA: LayoutRect, fromB: LayoutRect, to: LayoutRect) => {
  const midX = (rightX(fromA) + to.x) / 2;
  const aY = centerY(fromA);
  const bY = centerY(fromB);
  const tY = centerY(to);
  return [
    `M ${rightX(fromA)} ${aY} H ${midX}`,
    `M ${rightX(fromB)} ${bY} H ${midX}`,
    `M ${midX} ${aY} V ${bY}`,
    `M ${midX} ${tY} H ${to.x}`,
  ].join(" ");
};

const stemPath = (from: LayoutRect, to: LayoutRect) => {
  const midX = (rightX(from) + to.x) / 2;
  return `M ${rightX(from)} ${centerY(from)} H ${midX} V ${centerY(to)} H ${to.x}`;
};

const slotNodeId = (matchId: string, side: "item" | "item2") =>
  `${matchId}-${side}`;
const outcomeNodeId = (matchId: string) => `${matchId}-out`;

export const computeSingleEliminationLayout = <T,>(
  bracket: Bracket<T>,
): SingleEliminationLayout => {
  const firstRound = bracket.rounds[0];
  const paddedSize = firstRound.matches.length * 2;
  const nodes: LayoutNode[] = [];

  firstRound.matches.forEach((match, matchIndex) => {
    const topSlot = matchIndex * 2;
    nodes.push({
      id: slotNodeId(match.id, "item"),
      matchId: match.id,
      roundIndex: 0,
      matchIndex,
      kind: "slot-item",
      rect: rectAt(columnX(0), slotY(topSlot)),
      visible: !match.data.isBye && match.item.kind === "item",
    });
    nodes.push({
      id: slotNodeId(match.id, "item2"),
      matchId: match.id,
      roundIndex: 0,
      matchIndex,
      kind: "slot-item2",
      rect: rectAt(columnX(0), slotY(topSlot + 1)),
      visible: !match.data.isBye && match.item2.kind === "item",
    });
  });

  bracket.rounds.forEach((round, roundIndex) => {
    round.matches.forEach((match, matchIndex) => {
      nodes.push({
        id: outcomeNodeId(match.id),
        matchId: match.id,
        roundIndex,
        matchIndex,
        kind: "outcome",
        rect: rectAt(columnX(roundIndex + 1), outcomeY(roundIndex, matchIndex)),
        visible: true,
      });
    });
  });

  const finalMatch = bracket.rounds.at(-1)?.matches[0];
  const finalOutcome = finalMatch
    ? nodes.find((node) => node.id === outcomeNodeId(finalMatch.id))
    : undefined;

  if (bracket.thirdPlace && finalOutcome) {
    const bronzeMatch = bracket.thirdPlace;
    const mainBottom = nodes
      .filter((node) => node.visible)
      .reduce(
        (bottom, node) => Math.max(bottom, node.rect.y + node.rect.height),
        0,
      );
    const bronzeSlotY = mainBottom + BRACKET_LAYOUT.slotGap;
    const bronzeOutcomeY =
      bronzeSlotY + (BRACKET_LAYOUT.slotHeight + BRACKET_LAYOUT.slotGap) / 2;
    const slotColumn = columnX(bracket.rounds.length - 1);
    const outcomeColumn = columnX(bracket.rounds.length);

    nodes.push({
      id: slotNodeId(bronzeMatch.id, "item"),
      matchId: bronzeMatch.id,
      roundIndex: bracket.rounds.length,
      matchIndex: 0,
      kind: "slot-item",
      rect: rectAt(slotColumn, bronzeSlotY),
      visible: true,
    });
    nodes.push({
      id: slotNodeId(bronzeMatch.id, "item2"),
      matchId: bronzeMatch.id,
      roundIndex: bracket.rounds.length,
      matchIndex: 1,
      kind: "slot-item2",
      rect: rectAt(
        slotColumn,
        bronzeSlotY + BRACKET_LAYOUT.slotHeight + BRACKET_LAYOUT.slotGap,
      ),
      visible: true,
    });
    nodes.push({
      id: outcomeNodeId(bronzeMatch.id),
      matchId: bronzeMatch.id,
      roundIndex: bracket.rounds.length,
      matchIndex: 0,
      kind: "outcome",
      rect: rectAt(outcomeColumn, bronzeOutcomeY),
      visible: true,
    });
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const connectors: LayoutConnector[] = [];

  const addForkOrStem = (
    connectorId: string,
    fromNodes: LayoutNode[],
    to: LayoutNode,
  ) => {
    const visibleFrom = fromNodes.filter((node) => node.visible);
    if (visibleFrom.length === 0 || !to.visible) {
      return;
    }
    if (visibleFrom.length === 1) {
      connectors.push({
        id: connectorId,
        d: stemPath(visibleFrom[0].rect, to.rect),
      });
      return;
    }
    connectors.push({
      id: connectorId,
      d: forkPath(visibleFrom[0].rect, visibleFrom[1].rect, to.rect),
    });
  };

  firstRound.matches.forEach((match) => {
    if (match.data.isBye) {
      return;
    }
    const from = [
      nodeById.get(slotNodeId(match.id, "item")),
      nodeById.get(slotNodeId(match.id, "item2")),
    ].filter((node): node is LayoutNode => Boolean(node));
    const to = nodeById.get(outcomeNodeId(match.id));
    if (to) {
      addForkOrStem(`${match.id}-in`, from, to);
    }
  });

  bracket.rounds.slice(1).forEach((round) => {
    round.matches.forEach((match, matchIndex) => {
      const previousRound = bracket.rounds[round.index - 1];
      const childA: BracketMatch<T> | undefined =
        previousRound.matches[matchIndex * 2];
      const childB: BracketMatch<T> | undefined =
        previousRound.matches[matchIndex * 2 + 1];
      const from = [childA, childB]
        .filter((child): child is BracketMatch<T> => Boolean(child))
        .map((child) => nodeById.get(outcomeNodeId(child.id)))
        .filter((node): node is LayoutNode => Boolean(node));
      const to = nodeById.get(outcomeNodeId(match.id));
      if (to) {
        addForkOrStem(`${match.id}-in`, from, to);
      }
    });
  });

  if (bracket.thirdPlace) {
    const from = [
      nodeById.get(slotNodeId(bracket.thirdPlace.id, "item")),
      nodeById.get(slotNodeId(bracket.thirdPlace.id, "item2")),
    ].filter((node): node is LayoutNode => Boolean(node));
    const to = nodeById.get(outcomeNodeId(bracket.thirdPlace.id));
    if (to) {
      addForkOrStem(`${bracket.thirdPlace.id}-in`, from, to);
    }
  }

  const paddedHeight =
    BRACKET_LAYOUT.padding * 2 +
    BRACKET_LAYOUT.roundTitleHeight +
    paddedSize * BRACKET_LAYOUT.slotHeight +
    (paddedSize - 1) * BRACKET_LAYOUT.slotGap;
  const bronzeBottom = bracket.thirdPlace
    ? (nodeById.get(slotNodeId(bracket.thirdPlace.id, "item2"))?.rect.y ?? 0) +
      BRACKET_LAYOUT.slotHeight +
      BRACKET_LAYOUT.padding
    : 0;
  const columnCount = bracket.rounds.length + 1;
  const headers: LayoutHeader[] = Array.from(
    { length: columnCount },
    (_, columnIndex) => ({
      id: `round-${columnIndex}`,
      columnIndex,
      rect: {
        x: columnX(columnIndex),
        y: BRACKET_LAYOUT.padding,
        width: BRACKET_LAYOUT.slotWidth,
        height: BRACKET_LAYOUT.roundTitleHeight,
      },
    }),
  );

  return {
    width:
      BRACKET_LAYOUT.padding * 2 +
      columnCount * BRACKET_LAYOUT.slotWidth +
      (columnCount - 1) * BRACKET_LAYOUT.roundGap,
    height: Math.max(paddedHeight, bronzeBottom),
    nodes,
    connectors,
    headers,
  };
};
