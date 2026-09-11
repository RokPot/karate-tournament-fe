const pxToRem = (px: number) => `${px / 16}rem`;

const baseTailwindConfig = {
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
      "loader-spin": {
        to: {
          transform: "rotate(360deg)",
        },
      },
    },
    animation: {
      "loader-spin": "loader-spin 1s linear infinite",
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
};

export default baseTailwindConfig;
