import clsx from "clsx";

import { Typography } from "@/components/ui/text/Typography/Typography";

interface LandingImagePlaceholderProps {
  label: string;
  aspectRatio?: string;
  className?: string;
}

export const LandingImagePlaceholder = ({
  label,
  aspectRatio = "aspect-[4/5]",
  className,
}: LandingImagePlaceholderProps) => {
  return (
    <div
      className={clsx(
        "flex w-full items-center justify-center rounded-2xl border border-dashed border-secondary-400 bg-secondary-100 text-neutral-200",
        aspectRatio,
        className,
      )}
    >
      <Typography size="labels-s">{label}</Typography>
    </div>
  );
};
