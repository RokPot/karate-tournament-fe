import { useMediaQuery } from "react-responsive";
import { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import config from "@/../tailwind.config";

const fullConfig = resolveConfig(config as unknown as Config);

type Breakpoint = "sm" | "dm" | "t" | "dd" | "dl" | "m";

const breakpoints = fullConfig.theme?.screens as Record<Breakpoint, string>;

export function useBreakpoint(breakpointKey: Breakpoint) {
  if (!breakpoints) {
    throw new Error("Tailwind config is missing theme.screens");
  }

  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });

  return bool;
}
