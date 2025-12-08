import { useMediaQuery } from "react-responsive";

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import baseConfig from "@/../theme/base-tailwind.config";

type Breakpoint = "dm" | "t" | "m" | "dd" | "dl";

// In Tailwind v4, screens are defined in the base config
const breakpoints = baseConfig.theme?.screens as Record<Breakpoint, string>;

export function useBreakpoint(breakpointKey: Breakpoint) {
  if (!breakpoints) {
    throw new Error("Tailwind config is missing theme.screens");
  }

  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });

  return bool;
}
