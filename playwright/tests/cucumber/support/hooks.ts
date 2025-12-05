/* eslint-disable no-console, n/no-process-env, func-names */
import { BeforeAll, Before, After } from "@cucumber/cucumber";
import dotenv from "dotenv";

BeforeAll(async () => {
  // set the environment file
  if (process.env.NODE_ENV) {
    dotenv.config({ path: `playwright/config/.env.${process.env.NODE_ENV}` });
    console.log(`Using '${process.env.NODE_ENV}' environment`);
  } else {
    dotenv.config({ path: "playwright/config/.env.development" });
    console.log("Using default 'development' environment");
  }
});

Before(async function (this: any) {
  await this.initialize();
});

After(async function (this: any) {
  await this.cleanup();
});
