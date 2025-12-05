import type { StorybookConfig } from "@storybook/nextjs";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-controls",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {},
  webpackFinal: async (config) => {
    if (!config.resolve) config.resolve = {};

    config.resolve.plugins = [new TsconfigPathsPlugin()];
    return config;
  },
  core: {
    disableTelemetry: true,
  },
  staticDirs: [{ from: "../src/assets/fonts", to: "/src/assets/fonts" }],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
export default config;
