import { VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";

type TypographyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

const typography = cva("", {
  variants: {
    size: {
      "special-label-1": [],
      "special-label-2": [],
      "special-label-3": ["t:text-speciallabel-3"],
      "special-label-5": ["t:text-speciallabel-5"],
      h1: ["t:text-h1"],
      h2: ["t:text-h2"],
      h3: ["t:text-h3"],
      h4: ["t:text-h4"],
      h5: ["t:text-h5"],
      h6: ["t:text-h6"],
      h7: ["t:text-h7"],
      "body-paragraph-lg": ["t:text-body-paragraph-lg"],
      "body-paragraph-m": ["t:text-body-paragraph-m"],
      "body-paragraph-s": ["t:text-body-paragraph-s"],
      "body-paragraph-xs": ["t:text-body-paragraph-xs"],
      "labels-input-m": ["t:text-labels-input-m"],
      "labels-lgx2": ["t:text-labels-xl"],
      "labels-lg": ["t:text-labels-lg"],
      "labels-m": ["t:text-labels-m"],
      "labels-s": ["t:text-labels-s"],
      "labels-xs": ["t:text-labels-xs"],
      "display-d1": ["t:text-display-d1"],
      "display-d2": ["t:text-display-d2"],
      "display-d3": ["t:text-display-d3"],
      "display-d4": ["t:text-display-d4"],
      "display-d5": ["t:text-display-d5"],
      "display-d6": ["t:text-display-d6"],
    },
    sizeMobile: {
      "special-label-1": ["text-speciallabel-1"],
      "special-label-2": ["text-speciallabel-2"],
      "special-label-3": ["text-speciallabel-3"],
      "special-label-5": ["text-speciallabel-5"],
      h1: ["text-h1"],
      h2: ["text-h2"],
      h3: ["text-h3"],
      h4: ["text-h4"],
      h5: ["text-h5"],
      h6: ["text-h6"],
      h7: ["text-h7"],
      "body-paragraph-lg": ["text-body-paragraph-lg"],
      "body-paragraph-m": ["text-body-paragraph-m"],
      "body-paragraph-s": ["text-body-paragraph-s"],
      "body-paragraph-xs": ["text-body-paragraph-xs"],
      "labels-input-m": ["text-labels-input-m"],
      "labels-lgx2": ["text-labels-xl"],
      "labels-lg": ["text-labels-lg"],
      "labels-m": ["text-labels-m"],
      "labels-s": ["text-labels-s"],
      "labels-xs": ["text-labels-xs"],
      "display-d1": ["text-display-d1"],
      "display-d2": ["text-display-d2"],
      "display-d3": ["text-display-d3"],
      "display-d4": ["text-display-d4"],
      "display-d5": ["text-display-d5"],
      "display-d6": ["t:text-display-d6"],
    },
    variant: {
      default: [],
      "default-italic": ["italic"],
      "prominent-1": [],
      "prominent-1-italic": ["italic"],
      "prominent-2": [],
      "prominent-2-italic": ["italic"],
    },
  },
  defaultVariants: {
    variant: "default",
  },
  compoundVariants: [
    {
      size: ["special-label-1", "special-label-2", "special-label-3"],
      className: "font-secondary",
    },
    {
      size: ["labels-xs", "labels-s", "labels-m", "labels-lg", "labels-input-m"],
      className: "font-secondary",
    },
    {
      size: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
      className: "font-secondary",
    },
    {
      size: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
      variant: "prominent-1",
      className: "font-weight-500",
    },
    {
      size: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
      variant: "prominent-2",
      className: "font-weight-600",
    },
    {
      size: ["labels-input-m", "labels-lg", "labels-m", "labels-s", "labels-xs"],
      variant: "prominent-1",
      className: "font-weight-500",
    },
    {
      size: ["labels-input-m", "labels-lg", "labels-m", "labels-s", "labels-xs"],
      variant: "prominent-2",
      className: "font-weight-600",
    },
  ],
});

type TypographyVariantProps = VariantProps<typeof typography>;

interface TypographyPropsCva
  extends Omit<TypographyVariantProps, "size">,
    Required<Pick<TypographyVariantProps, "size">> {}

export type TypographyProps = {
  as?: TypographyTag;
} & TypographyPropsCva &
  React.HTMLAttributes<HTMLElement>;

export const Typography = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as = "p", size, sizeMobile, variant, className, ...props }: TypographyProps, ref) => {
    const Tag = as;

    return (
      <Tag
        ref={ref}
        className={typography({
          size,
          sizeMobile: sizeMobile ?? size,
          variant,
          className,
        })}
        {...props}
      />
    );
  },
);
