import type { ReactNode } from "react";

import { Typography } from "@/components/ui/text/Typography/Typography";

import {
  computeSingleEliminationLayout,
  getMatchLoserItem,
  getMatchWinnerItem,
  resolveSum,
  type Bracket,
  type BracketMatch,
  type BracketSlot,
  type SingleEliminationLayoutOptions,
} from "@/components/brackets/core";
import type { BracketColors } from "./bracketColors";
import { BracketConnectors } from "./BracketConnectors";
import { MatchCard } from "./MatchCard";
import { ScoreCell } from "./ScoreCell";

export type SingleEliminationBracketProps<T> = {
  bracket: Bracket<T>;
  getLabel?: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
  colors: BracketColors;
  getRoundLabel?: (columnIndex: number) => string;
  /**
   * Score row next to each match result: `scoreCount` cells plus a Sum cell.
   * `0` (default) keeps the single score well on the card. Cell sizes come from
   * `BRACKET_SCORE_LAYOUT` unless overridden here.
   */
  scoreCount?: SingleEliminationLayoutOptions["scoreCount"];
  /** Rounds that get the score row. Defaults to `"last"` (final and third place). */
  scoreOn?: SingleEliminationLayoutOptions["scoreOn"];
  scoreCellWidth?: SingleEliminationLayoutOptions["scoreCellWidth"];
  scoreCellGap?: SingleEliminationLayoutOptions["scoreCellGap"];
  sumCellWidth?: SingleEliminationLayoutOptions["sumCellWidth"];
  scoreStripGap?: SingleEliminationLayoutOptions["scoreStripGap"];
  /** Text in an empty Sum cell. Defaults to "Sum". */
  sumLabel?: string;
};

const DEFAULT_SUM_LABEL = "Sum";

const defaultRoundLabel = (columnIndex: number) => `Round ${columnIndex + 1}`;

const scoreForNode = <T,>(
  kind: "slot-item" | "slot-item2" | "outcome",
  match: BracketMatch<T>,
) => {
  if (kind === "slot-item") {
    return match.data.score;
  }
  if (kind === "slot-item2") {
    return match.data.score2;
  }
  if (match.data.winner === "item") {
    return match.data.score;
  }
  if (match.data.winner === "item2") {
    return match.data.score2;
  }
  return undefined;
};

const defaultLabel = <T,>(item: T, getLabel?: (item: T) => string) => {
  if (getLabel) {
    return getLabel(item);
  }
  if (item && typeof item === "object" && "name" in item) {
    const { name } = (item as { name?: unknown });
    if (typeof name === "string") {
      return name;
    }
  }
  return String(item);
};

const Placeholder = ({ color }: { color: string }) => (
  <Typography size="body-paragraph-s" style={{ color, opacity: 0.55 }}>
    —
  </Typography>
);

const matchById = <T,>(bracket: Bracket<T>, matchId: string) => {
  if (bracket.thirdPlace?.id === matchId) {
    return bracket.thirdPlace;
  }
  for (const round of bracket.rounds) {
    const match = round.matches.find((entry) => entry.id === matchId);
    if (match) {
      return match;
    }
  }
  return undefined;
};

const resolveSlotItem = <T,>(
  slot: BracketSlot<T>,
  bracket: Bracket<T>,
): T | undefined => {
  if (slot.kind === "item") {
    return slot.item;
  }
  if (slot.kind !== "tbd") {
    return undefined;
  }
  const source = matchById(bracket, slot.fromMatchId);
  if (!source) {
    return undefined;
  }
  return slot.outcome === "loser"
    ? getMatchLoserItem(source)
    : getMatchWinnerItem(source);
};

const SlotContent = <T,>({
  slot,
  bracket,
  getLabel,
  renderItem,
  textColor,
}: {
  slot: BracketSlot<T>;
  bracket: Bracket<T>;
  getLabel?: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
  textColor: string;
}) => {
  const item = resolveSlotItem(slot, bracket);
  if (!item) {
    return <Placeholder color={textColor} />;
  }
  if (renderItem) {
    return renderItem(item);
  }
  return (
    <Typography
      size="body-paragraph-s"
      className="truncate"
      style={{ color: textColor }}
    >
      {defaultLabel(item, getLabel)}
    </Typography>
  );
};

const outcomeContent = <T,>(
  match: BracketMatch<T>,
  textColor: string,
  getLabel?: (item: T) => string,
  renderItem?: (item: T) => ReactNode,
) => {
  const winner = getMatchWinnerItem(match);
  if (winner) {
    if (renderItem) {
      return renderItem(winner);
    }
    return (
      <Typography
        size="body-paragraph-s"
        className="truncate"
        style={{ color: textColor }}
      >
        {defaultLabel(winner, getLabel)}
      </Typography>
    );
  }
  return <Placeholder color={textColor} />;
};

export const SingleEliminationBracket = <T,>({
  bracket,
  getLabel,
  renderItem,
  colors,
  getRoundLabel = defaultRoundLabel,
  scoreCount = 0,
  scoreOn,
  scoreCellWidth,
  scoreCellGap,
  sumCellWidth,
  scoreStripGap,
  sumLabel = DEFAULT_SUM_LABEL,
}: SingleEliminationBracketProps<T>) => {
  const layout = computeSingleEliminationLayout(bracket, {
    scoreCount,
    scoreOn,
    scoreCellWidth,
    scoreCellGap,
    sumCellWidth,
    scoreStripGap,
  });
  const scoredMatchIds = new Set(
    layout.scoreCells.map((cell) => cell.matchId),
  );

  return (
    <div
      className="relative"
      style={{ width: layout.width, height: layout.height, color: colors.text }}
    >
      <div className="absolute inset-0">
        <BracketConnectors
          width={layout.width}
          height={layout.height}
          connectors={layout.connectors}
          color={colors.line}
        />
      </div>
      {layout.headers.map((header) => (
        <div
          key={header.id}
          className="absolute flex items-center"
          style={{
            left: header.rect.x,
            top: header.rect.y,
            width: header.rect.width,
            height: header.rect.height,
          }}
        >
          <Typography
            size="body-paragraph-s"
            variant="prominent-2"
            as="span"
            className="truncate"
            style={{ color: colors.text }}
          >
            {getRoundLabel(header.columnIndex)}
          </Typography>
        </div>
      ))}
      {layout.nodes.map((node) => {
        if (!node.visible) {
          return null;
        }
        const match = matchById(bracket, node.matchId);
        if (!match) {
          return null;
        }

        const highlighted = Boolean(getMatchWinnerItem(match));
        const score = scoreForNode(node.kind, match);
        let content: ReactNode = <Placeholder color={colors.text} />;
        if (node.kind === "slot-item") {
          content = (
            <SlotContent
              slot={match.item}
              bracket={bracket}
              getLabel={getLabel}
              renderItem={renderItem}
              textColor={colors.text}
            />
          );
        } else if (node.kind === "slot-item2") {
          content = (
            <SlotContent
              slot={match.item2}
              bracket={bracket}
              getLabel={getLabel}
              renderItem={renderItem}
              textColor={colors.text}
            />
          );
        } else {
          content = outcomeContent(
            match,
            colors.text,
            getLabel,
            renderItem,
          );
        }

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.rect.x,
              top: node.rect.y,
              width: node.rect.width,
              height: node.rect.height,
            }}
          >
            <MatchCard
              colors={colors}
              score={score}
              hideScore={node.kind === "outcome" && scoredMatchIds.has(node.matchId)}
              highlighted={
                node.kind !== "slot-item" &&
                node.kind !== "slot-item2" &&
                highlighted
              }
            >
              {content}
            </MatchCard>
          </div>
        );
      })}
      {layout.scoreCells.map((cell) => {
        const match = matchById(bracket, cell.matchId);
        if (!match) {
          return null;
        }
        const value =
          cell.kind === "sum"
            ? resolveSum(match.data.scores, match.data.sum, scoreCount)
            : match.data.scores?.[cell.index];
        return (
          <div
            key={cell.id}
            className="absolute"
            style={{
              left: cell.rect.x,
              top: cell.rect.y,
              width: cell.rect.width,
              height: cell.rect.height,
            }}
          >
            <ScoreCell
              colors={colors}
              kind={cell.kind}
              value={value}
              sumLabel={sumLabel}
            />
          </div>
        );
      })}
    </div>
  );
};
