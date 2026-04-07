const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.clipboard = '';
  }

  async setDriver() {
    const options = new firefox.Options();
    options.addArguments('-headless'); // Ensure headless mode for CI

    this.driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options) // Apply the headless option here
      .build();

    await this.driver.manage().setTimeouts({
      implicit: this.parameters.waitTimeout,
    });
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  await this.setDriver();
});

After(async function () {
  if (this.driver) {
    await this.driver.quit();
  }
});
