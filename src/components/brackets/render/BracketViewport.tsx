import { cx } from "class-variance-authority";
import type { PropsWithChildren } from "react";

import { useBracketPan } from "./useBracketPan";

export type BracketWindow = {
  width: number;
  height: number;
};

type BracketViewportProps = PropsWithChildren<{
  window?: BracketWindow;
  className?: string;
}>;

export const BracketViewport = ({
  window: viewportWindow,
  className,
  children,
}: BracketViewportProps) => {
  const isWindowed = Boolean(viewportWindow);
  const {
    viewportRef,
    isGrabbing,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useBracketPan(isWindowed);

  if (!viewportWindow) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={viewportRef}
      className={cx(
        "overflow-auto select-none",
        isGrabbing ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{ width: viewportWindow.width, height: viewportWindow.height }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {children}
    </div>
  );
};
