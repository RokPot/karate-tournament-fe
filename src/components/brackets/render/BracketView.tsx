import type { ReactNode } from "react";

import type { Bracket } from "../types";
import { BracketViewport, type BracketWindow } from "./BracketViewport";
import { SingleEliminationBracket } from "./SingleEliminationBracket";

export type BracketViewProps<T> = {
  bracket: Bracket<T>;
  getId: (item: T) => string;
  getLabel?: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
  className?: string;
  window?: BracketWindow;
};

export const BracketView = <T,>({
  window: viewportWindow,
  className,
  ...props
}: BracketViewProps<T>) => {
  let canvas: ReactNode;
  switch (props.bracket.kind) {
    case "single_elimination":
      canvas = <SingleEliminationBracket {...props} />;
      break;
    default: {
      const exhaustive: never = props.bracket.kind;
      return exhaustive;
    }
  }

  return (
    <BracketViewport window={viewportWindow} className={className}>
      {canvas}
    </BracketViewport>
  );
};
