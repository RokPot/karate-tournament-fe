import { useCallback, useRef, useState, type PointerEvent } from "react";

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  scrollLeft: number;
  scrollTop: number;
};

export const useBracketPan = (enabled: boolean) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enabled || event.button !== 0) {
        return;
      }
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
      };
      viewport.setPointerCapture(event.pointerId);
      setIsGrabbing(true);
      event.preventDefault();
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const viewport = viewportRef.current;
      if (!enabled || !drag || !viewport || event.pointerId !== drag.pointerId) {
        return;
      }
      viewport.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
      viewport.scrollTop = drag.scrollTop - (event.clientY - drag.startY);
    },
    [enabled],
  );

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const viewport = viewportRef.current;
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }
      if (viewport?.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      dragRef.current = null;
      setIsGrabbing(false);
    },
    [],
  );

  return {
    viewportRef,
    isGrabbing,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
};
