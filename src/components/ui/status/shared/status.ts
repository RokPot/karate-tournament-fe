import { cva } from "class-variance-authority";

export const statusIcon = cva("h-6 w-6 shrink-0", {
  variants: {
    variant: {
      neutral: "text-secondary-200",
      success: "stroke-success text-success",
      warning: "stroke-warning text-warning",
      error: "stroke-danger text-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export const statusSeparator = cva("t:h-auto t:w-px h-px shrink-0 self-stretch", {
  variants: {
    variant: {
      neutral: "bg-primary-400",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export type StatusAction = {
  text: string;
  onPress: () => void;
  className?: string;
};

export type StatusParams = {
  text: string;
  isLoading?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  actions?: StatusAction[];
};
