/* eslint-disable react/no-unknown-property */
import { fontPrimary } from "./primary";
import { fontSecondary } from "./secondary";

export const globalFontClass = "font-primary";

export const Fonts = () => (
  <style jsx global>{`
    :root {
      --font-primary: ${fontPrimary.style.fontFamily};
      --font-secondary: ${fontSecondary.style.fontFamily};
    }
  `}</style>
);
