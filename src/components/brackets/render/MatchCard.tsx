import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

interface MatchCardProps {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
}

export const MatchCard = ({
  children,
  className,
  highlighted = false,
}: MatchCardProps) => {
  return (
    <div
      className={cx(
        "flex h-full w-full items-center truncate rounded-m border border-secondary-300 bg-secondary-200 px-3 text-neutral-500 shadow-1",
        highlighted && "border-primary-300",
        className,
      )}
    >
      {children}
    </div>
  );
};
