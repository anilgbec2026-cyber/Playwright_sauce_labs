# Project rules for AI assistants

Playwright Test (`@playwright/test`) framework for https://www.saucedemo.com.
Language: **JavaScript, CommonJS** (`require` / `module.exports`). **No TypeScript.**

## Structure
- `pages/` Page Objects (one class per page, all extend `BasePage`). Locators are defined in the constructor; methods are user actions.
- `fixtures/pageFixtures.js` extends `test` so tests receive page objects (`loginPage`, `inventoryPage`, `cartPage`, `checkoutPage`, `menu`, `dynamicCatalogPage`). Always import `test` and `expect` from here, not from `@playwright/test`.
- `tests/*.spec.js` the tests. `test-data/users.json` all credentials and test data. `utils/aiHelper.js` Claude API helper.

## Coding standards
- Locator priority: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId` > CSS. **Never XPath.** (`testIdAttribute` is `data-test`.)
- Web-first assertions only: `await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()` ...
- **NEVER** use `page.waitForTimeout()` or any fixed sleep.
- Every test is independent. Use `beforeEach` for shared setup such as login.
- Put `// Arrange`, `// Act`, `// Assert` comments in every test.
- Test names describe the expected behaviour.
- Beginner-friendly comments that explain WHY, not just WHAT.
- No credentials or test data hardcoded in tests; read them from `test-data/`.
- Before writing a Page Object, inspect the real page (Playwright MCP browser if available) so locators are correct, not guessed.
- Secrets live in `.env` (git-ignored). The Anthropic client is created lazily so the framework works without an API key; AI tests must `test.skip()` when `ANTHROPIC_API_KEY` is missing.

## Commands
`npm test`, `npm run test:chrome`, `npm run test:headed`, `npm run test:ui`, `npm run test:debug`, `npm run report`, `npm run codegen`.
