// Parent class for every page object. Holds helpers that all pages share.
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** Go to a path. Relative paths use baseURL from playwright.config.js. */
  async open(path = '/') {
    // "domcontentloaded" (not the default "load") because the site sometimes stalls on slow
    // images/third-party files in Firefox. Playwright still auto-waits for each element we use.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Return the browser tab title. */
  async getTitle() {
    return this.page.title();
  }
}

module.exports = { BasePage };
