import type { Preview } from "@storybook/react";
import React, { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import i18n from "../src/config/i18n";
import { Fonts, globalFontClass } from "../src/styles/font";
import "../src/styles/globals.css";

// Wrap your stories in the I18nextProvider component
const withI18next = (Story: any) => {
  return (
    // This catches the suspense from components not yet ready (still loading translations)
    // Alternative: set useSuspense to false on i18next.options.react when initializing i18next
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Fonts />
        <div className={globalFontClass}>
          <Story />
        </div>
      </I18nextProvider>
    </Suspense>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  tags: ["autodocs"],
};

export const decorators = [withI18next];

export default preview;
