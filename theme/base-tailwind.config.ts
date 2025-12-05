import type { Config } from "tailwindcss";

const pxToRem = (px: number) => `${px / 16}rem`;

const withMT = require("@material-tailwind/react/utils/withMT");

const baseTailwindConfig: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/font/index.ts",
  ],
  theme: {
    colors: {
      inherit: "inherit",
      transparent: "transparent",
      current: "currentColor",
    },
    borderRadius: {
      none: "0rem",
    },
    maxWidth: {
      none: "none",
      modal: pxToRem(720),
      toast: pxToRem(720),
    },
    spacing: {
      "0": "0rem",
    },
    backdropBlur: {},
    blur: {},
    boxShadow: {},
    rotate: {
      "0": "0deg",
      "45": "45deg",
      "90": "90deg",
      "180": "180deg",
      "270": "270deg",
      "360": "360deg",
    },
    screens: {
      // why are breakpoints in rems? read this: https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/
      dm: pxToRem(360),
      t: pxToRem(600),
      m: pxToRem(900),
      dd: pxToRem(1280),
      dl: pxToRem(1680),
    },
    keyframes: {
      "drawer-slide-right": {
        from: {
          transform: "translateX(100%)",
        },
        to: {
          transform: "translateX(0)",
        },
      },
      "drawer-slide-left": {
        from: {
          transform: "translateX(-100%)",
        },
        to: {
          transform: "translateX(0)",
        },
      },
      "loader-spin": {
        to: {
          transform: "rotate(360deg)",
        },
      },
      pulsate: {
        "0%": { opacity: "0.5" },
        "50%": { opacity: "1" },
        "100%": { opacity: "0.5" },
      },
      "modal-bounce-in": {
        "0%": { transform: "scale(0.95)", opacity: "0" },
        "50%": { transform: "scale(1.02)" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      "modal-bounce-out": {
        "0%": { transform: "scale(1)", opacity: "1" },
        "100%": { transform: "scale(0.95)", opacity: "0" },
      },
      "ring-fill": {
        "0%": { "stroke-dasharray": "0, 100" },
        "100%": { "stroke-dasharray": "var(--ring-progress), 100" },
      },

      "zoom-in": {
        "0%": { transform: "scale(0)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      "score-bar-appear": {
        "0%": {
          opacity: "0",
          transform: "scaleY(0)",
        },
        "100%": {
          opacity: "1",
          transform: "scaleY(1)",
        },
      },
      "score-level-animate": {
        "0%": {
          transform: "scale(1)",
          color: "#ffffff",
        },
        "50%": {
          transform: "scale(1.2)",
          color: "#facc15",
        },
        "100%": {
          transform: "scale(1)",
          color: "#ffffff",
        },
      },
      "score-level-animate-active": {
        "0%": {
          transform: "scale(1)",
          color: "#ffffff",
        },
        "50%": {
          transform: "scale(1.2)",
          color: "#facc15",
        },
        "100%": {
          transform: "scale(1)",
          color: "rgb(var(--elevation-surface-4))",
        },
      },
      "score-bar-rise": {
        "0%": {
          opacity: "0",
          top: "100%",
        },
        "1%": {
          opacity: "1",
          top: "100%",
        },
        "100%": {
          opacity: "1",
          top: "var(--target-position)",
        },
      },
      "radar-chart-appear": {
        "0%": {
          opacity: "0",
          transform: "scale(0.8)",
        },
        "100%": {
          opacity: "1",
          transform: "scale(1)",
        },
      },
      "radar-fill-animate": {
        "0%": {
          opacity: "0",
        },
        "50%": {
          opacity: "0.4",
        },
        "100%": {
          opacity: "0.8",
        },
      },
      "salary-flash-up": {
        "0%": { color: "theme(colors.secondary-50)" },
        "50%": { color: "oklch(from theme(colors.success-200) 0.83 0.18 h)" },
        "100%": { color: "theme(colors.success-200)" },
      },
      "salary-flash-down": {
        "0%": { color: "theme(colors.secondary-50)" },
        "50%": { color: "oklch(from theme(colors.danger-200) 0.98 0.3 h)" },
        "100%": { color: "theme(colors.danger-200)" },
      },
    },
    animation: {
      "drawer-enter-right": "drawer-slide-right 0.3s",
      "drawer-exit-right": "drawer-slide-right 0.3s reverse",
      "drawer-enter-left": "drawer-slide-left 0.3s",
      "drawer-exit-left": "drawer-slide-left 0.3s reverse",
      "loader-spin": "loader-spin 1s linear infinite",
      pulsate: "pulsate 1s ease-in-out infinite",
      "overlay-bounce-in": "modal-bounce-in 0.3s ease-out",
      "overlay-bounce-out": "modal-bounce-out 0.2s ease-in",

      "ring-fill-1": "ring-fill 1.5s ease-out 0.7s forwards",
      "ring-fill-2": "ring-fill 1.5s ease-out 1.1s forwards",
      "ring-fill-3": "ring-fill 1.5s ease-out 1.5s forwards",
      "ring-fill-4": "ring-fill 1.5s ease-out 1.9s forwards",
      "center-zoom": "zoom-in 1s ease-out forwards",
      "labels-zoom": "zoom-in 1s ease-out 0.2s forwards",
      "score-bar-appear": "score-bar-appear 500ms ease-in-out forwards",
      "score-level-animate": "score-level-animate 450ms ease-in-out forwards",
      "score-level-animate-active": "score-level-animate-active 450ms ease-in-out forwards",
      "score-bar-rise": "score-bar-rise 1000ms ease-out forwards",
      "radar-chart-appear": "radar-chart-appear 800ms ease-out forwards",
      "radar-fill-animate": "radar-fill-animate 1200ms ease-in-out 400ms forwards",
      "salary-flash-up": "salary-flash-up 1s ease-in-out",
      "salary-flash-down": "salary-flash-down 1s ease-in-out",
    },
    fontSize: {
      inherit: "inherit",
    },
    fontFamily: {},
    fontWeight: {},
    extend: {
      flex: {
        fill: "1 0 0",
      },
    },
  },
  plugins: [],
});

export default baseTailwindConfig;
