const config = {
  paths: ["playwright/tests/cucumber/features/**/*.feature"],
  require: ["playwright/tests/cucumber/support/**/*.ts", "playwright/tests/cucumber/stepDefinitions/**/*.ts"],
  format: ["@cucumber/pretty-formatter"],
  requireModule: ["ts-node/register"],
  formatOptions: { snippetInterface: "async-await" },
  publishQuiet: true,
  worldParameters: { browserName: "chrome", headless: false },
};

module.exports = {
  default: config,
};
