# Saucedemo Playwright Framework

End-to-end tests for https://www.saucedemo.com using Playwright, JavaScript and the Page Object Model.

## 1. Setup (one time)
1. Install [Node.js](https://nodejs.org) (LTS version).
2. Open a terminal in this folder and run:
   ```
   npm install
   npx playwright install
   ```
3. Copy `.env.example` to `.env` (Windows: `copy .env.example .env`). The defaults work as they are.
   Only add `ANTHROPIC_API_KEY` if you want the AI test (`checkout-ai.spec.js`) to run. Without it, that test is skipped.

## 2. Run the tests
| Command | What it does |
|---|---|
| `npm test` | All tests in Chromium, Firefox and WebKit |
| `npm run test:chrome` | Chromium only (fastest) |
| `npm run test:headed` | Shows the browser window |
| `npm run test:ui` | Playwright UI mode (great for learning) |
| `npm run test:debug` | Step-by-step debugger |
| `npm run report` | Opens the HTML report of the last run |
| `npm run codegen` | Records clicks and writes code for you |

Run one file: `npx playwright test tests/login.spec.js --project=chromium`

## 3. Project layout
```
pages/        Page Objects: locators + user actions for each page
fixtures/     pageFixtures.js gives tests ready-made page objects
tests/        The test files (*.spec.js)
test-data/    users.json: users, errors, customer and product data
utils/        aiHelper.js: Claude API helper (optional)
```

## 4. Writing a new test
```js
const { test, expect } = require('../fixtures/pageFixtures');

test('what should happen', async ({ loginPage }) => {
  // Arrange
  await loginPage.goto();
  // Act
  await loginPage.login('standard_user', 'secret_sauce');
  // Assert
  await expect(loginPage.page).toHaveURL(/inventory/);
});
```
Rules are in `CLAUDE.md` (no sleeps, no XPath, web-first assertions).

## 5. CI
GitHub Actions (`.github/workflows/playwright.yml`) runs the tests on every push. To enable the AI test there, add a repository secret named `ANTHROPIC_API_KEY`.
