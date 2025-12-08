import { cva } from "class-variance-authority";

export const statusIcon = cva("h-6 w-6 shrink-0", {
  variants: {
    variant: {
      neutral: "text-secondary-50",
      success: "stroke-success text-success",
      warning: "stroke-warning text-warning",
      error: "stroke-danger text-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export const statusSeparator = cva("h-px shrink-0 self-stretch t:h-auto t:w-px", {
  variants: {
    variant: {
      neutral: "bg-secondary-75",
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
