import { useEffect, useState } from "react";

/**
 * Custom hook to manage animations that should only run once per browser session
 * @param animationKey - Unique key to identify the animation
 * @returns boolean indicating if animation should run
 */
export const useSessionAnimation = (animationKey: string): boolean => {
  const sessionKey = `animation_shown_${animationKey}`;

  // Check immediately on first render if animation has been shown
  const [shouldAnimate] = useState(() => {
    const hasBeenShown = sessionStorage.getItem(sessionKey);
    return !hasBeenShown;
  });

  useEffect(() => {
    // Only mark as shown if we determined animation should run
    if (shouldAnimate) {
      sessionStorage.setItem(sessionKey, "true");
    }
  }, [sessionKey, shouldAnimate]);

  return shouldAnimate;
};
