const { test, expect } = require('../fixtures/pageFixtures');
const data = require('../test-data/users.json');

test.describe('Login', () => {
  // Every test starts on the login page (independent tests, shared setup).
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user logs in and lands on the inventory page', async ({ loginPage, inventoryPage, page }) => {
    // Arrange
    const { username, password } = data.users.standard;
    // Act
    await loginPage.login(username, password);
    // Assert
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('invalid credentials show an error message', async ({ loginPage }) => {
    // Arrange
    const { username, password } = data.users.invalid;
    // Act
    await loginPage.login(username, password);
    // Assert
    await expect(loginPage.errorMessage).toHaveText(data.errors.invalidCredentials);
  });

  test('locked out user sees a locked out error', async ({ loginPage, page }) => {
    // Arrange
    const { username, password } = data.users.lockedOut;
    // Act
    await loginPage.login(username, password);
    // Assert
    await expect(loginPage.errorMessage).toHaveText(data.errors.lockedOut);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('empty username shows a "Username is required" error', async ({ loginPage }) => {
    // Arrange
    const { password } = data.users.standard;
    // Act
    await loginPage.login('', password);
    // Assert
    await expect(loginPage.errorMessage).toHaveText(data.errors.usernameRequired);
  });
});
