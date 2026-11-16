const { test, expect } = require('../fixtures/pageFixtures');
const data = require('../test-data/users.json');

test.describe('Inventory', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(data.users.standard.username, data.users.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('inventory page shows six products', async ({ inventoryPage }) => {
    // Arrange: logged in by beforeEach
    // Act: nothing, we only look at the page
    // Assert
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(inventoryPage.itemNames.first()).toBeVisible();
  });

  test('sorting by price low to high orders products from cheapest to most expensive', async ({ inventoryPage }) => {
    // Arrange
    // Act
    await inventoryPage.sortBy('lohi');
    // Assert: web-first assertion retries until the sort has been applied
    await expect(inventoryPage.itemPrices.first()).toHaveText('$7.99');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
