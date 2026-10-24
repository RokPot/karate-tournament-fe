import { Typography } from "@/components/ui/text/Typography/Typography";

import type { BracketColors } from "./bracketColors";

interface ScoreCellProps {
  colors: BracketColors;
  kind: "score" | "sum";
  /** Cell content. Empty / undefined renders a blank score cell. */
  value?: number | string | null;
  /** Shown in an empty Sum cell. */
  sumLabel?: string;
}

const hasValue = (value: ScoreCellProps["value"]) =>
  value !== null && value !== undefined && value !== "";

export const ScoreCell = ({
  colors,
  kind,
  value,
  sumLabel,
}: ScoreCellProps) => {
  const filled = hasValue(value);
  const isSum = kind === "sum";

  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden rounded-m border"
      style={{
        backgroundColor: isSum ? colors.score : colors.card,
        borderColor: isSum ? colors.score : colors.border,
        color: isSum ? colors.scoreText : colors.text,
      }}
    >
      {(filled || isSum) && (
        <Typography
          size="body-paragraph-s"
          variant={isSum ? "prominent-2" : undefined}
          as="span"
          className="truncate px-1"
          style={{
            color: isSum ? colors.scoreText : colors.text,
            opacity: filled ? 1 : 0.7,
          }}
        >
          {filled ? value : sumLabel}
        </Typography>
      )}
    </div>
  );
};
