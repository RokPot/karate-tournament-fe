import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

import { Typography } from "@/components/ui/text/Typography/Typography";

import type { BracketColors } from "./bracketColors";

interface MatchCardProps {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
  colors: BracketColors;
  score?: number | string | null;
}

const hasScoreValue = (score: number | string | null | undefined) =>
  score !== null && score !== undefined && score !== "";

export const MatchCard = ({
  children,
  className,
  highlighted = false,
  colors,
  score,
}: MatchCardProps) => {
  const scored = hasScoreValue(score);

  return (
    <div
      className={cx(
        "flex h-full w-full overflow-hidden rounded-m border",
        className,
      )}
      style={{
        backgroundColor: colors.card,
        borderColor: highlighted ? colors.highlight : colors.border,
        color: colors.text,
        boxShadow: `0px 2px 3px 0px ${colors.shadow}`,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center truncate px-3">
        {children}
      </div>
      <div
        className="flex h-full w-9 shrink-0 items-center justify-center"
        style={{
          backgroundColor: colors.score,
          color: colors.scoreText,
        }}
      >
        <Typography
          size="body-paragraph-s"
          variant="prominent-2"
          as="span"
          style={{ color: colors.scoreText, opacity: scored ? 1 : 0.55 }}
        >
          {scored ? score : "—"}
        </Typography>
      </div>
    </div>
  );
};
