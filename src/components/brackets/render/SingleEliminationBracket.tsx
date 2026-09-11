import type { ReactNode } from "react";

import { Typography } from "@/components/ui/text/Typography/Typography";

import { computeSingleEliminationLayout } from "src/components/brackets/layout/computeSingleEliminationLayout";
import {
  getMatchLoserItem,
  getMatchWinnerItem,
  type Bracket,
  type BracketMatch,
  type BracketSlot,
} from "src/components/brackets/types";
import { BracketConnectors } from "./BracketConnectors";
import { MatchCard } from "./MatchCard";

export type SingleEliminationBracketProps<T> = {
  bracket: Bracket<T>;
  getId: (item: T) => string;
  getLabel?: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
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

const Placeholder = () => (
  <Typography size="body-paragraph-s" className="text-neutral-200">
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
}: {
  slot: BracketSlot<T>;
  bracket: Bracket<T>;
  getLabel?: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
}) => {
  const item = resolveSlotItem(slot, bracket);
  if (!item) {
    return <Placeholder />;
  }
  if (renderItem) {
    return renderItem(item);
  }
  return (
    <Typography size="body-paragraph-s" className="truncate">
      {defaultLabel(item, getLabel)}
    </Typography>
  );
};

const outcomeContent = <T,>(
  match: BracketMatch<T>,
  getLabel?: (item: T) => string,
  renderItem?: (item: T) => ReactNode,
) => {
  const winner = getMatchWinnerItem(match);
  if (winner) {
    if (renderItem) {
      return renderItem(winner);
    }
    return (
      <Typography size="body-paragraph-s" className="truncate">
        {defaultLabel(winner, getLabel)}
      </Typography>
    );
  }
  return <Placeholder />;
};

export const SingleEliminationBracket = <T,>({
  bracket,
  getLabel,
  renderItem,
}: SingleEliminationBracketProps<T>) => {
  const layout = computeSingleEliminationLayout(bracket);

  return (
    <div
      className="relative"
      style={{ width: layout.width, height: layout.height }}
    >
        <div className="absolute inset-0 text-white">
          <BracketConnectors
            width={layout.width}
            height={layout.height}
            connectors={layout.connectors}
          />
        </div>
        {layout.nodes.map((node) => {
          if (!node.visible) {
            return null;
          }
          const match = matchById(bracket, node.matchId);
          if (!match) {
            return null;
          }

          const highlighted = Boolean(getMatchWinnerItem(match));
          let content: ReactNode = <Placeholder />;
          if (node.kind === "slot-item") {
            content = (
              <SlotContent
                slot={match.item}
                bracket={bracket}
                getLabel={getLabel}
                renderItem={renderItem}
              />
            );
          } else if (node.kind === "slot-item2") {
            content = (
              <SlotContent
                slot={match.item2}
                bracket={bracket}
                getLabel={getLabel}
                renderItem={renderItem}
              />
            );
          } else {
            content = outcomeContent(match, getLabel, renderItem);
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
              <MatchCard highlighted={node.kind !== "slot-item" && node.kind !== "slot-item2" && highlighted}>
                {content}
              </MatchCard>
            </div>
          );
        })}
    </div>
  );
};
