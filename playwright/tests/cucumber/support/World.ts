/* eslint-disable no-console */
import { setWorldConstructor, World, setDefaultTimeout, IWorldOptions } from "@cucumber/cucumber";
import { firefox, webkit, chromium, Page, Browser } from "@playwright/test";

class ContextWorld extends World {
  page!: Page;

  browser!: Browser;

  browserName: string;

  headless: boolean;

  timeout: number;

  slowMo: number;

  constructor(options: IWorldOptions) {
    super(options);
    this.browserName = options.parameters.browserName || "chromium";
    this.headless = options.parameters.headless || false;
    this.timeout = options.parameters.timeout || 20000;
    this.slowMo = options.parameters.slowMo || 300;
  }

  async initialize() {
    const output = `Using '${this.browserName}' browser.`;

    console.log(this.headless ? "Running in headless mode." : "Running in headed mode.");
    console.log(`Timeout is set to ${this.timeout}ms and slowMo is set to ${this.slowMo}ms.`);
    // open the browser
    switch (this.browserName) {
      case "chrome": {
        console.log(output);
        this.browser = await chromium.launch({
          headless: this.headless,
          slowMo: this.slowMo,
          timeout: this.timeout,
        });
        break;
      }
      case "firefox": {
        console.log(output);
        this.browser = await firefox.launch({
          headless: this.headless,
          slowMo: this.slowMo,
          timeout: this.timeout,
        });
        break;
      }
      case "webkit": {
        console.log(output);
        this.browser = await webkit.launch({
          headless: this.headless,
          slowMo: this.slowMo,
          timeout: this.timeout,
        });
        break;
      }
      default: {
        console.log(`Using default 'chrome' browser`);
        this.browser = await chromium.launch({
          headless: this.headless,
          slowMo: this.slowMo,
          timeout: this.timeout,
        });
        break;
      }
    }

    // create page object
    this.page = await this.browser.newPage();
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    if (this.page) {
      await this.page.close();
    }
  }
}

// Global timeout
setDefaultTimeout(30 * 1000);
setWorldConstructor(ContextWorld);
