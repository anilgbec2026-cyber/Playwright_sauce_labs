const { test, expect } = require('../fixtures/pageFixtures');
const data = require('../test-data/users.json');

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(data.users.standard.username, data.users.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('adding one item shows it in the cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    const { backpack } = data.products;
    // Act
    await inventoryPage.addToCart(backpack);
    await inventoryPage.openCart();
    // Assert
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(cartPage.itemNames).toHaveText([backpack]);
  });

  test('adding two items shows both in the cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    const { backpack, bikeLight } = data.products;
    // Act
    await inventoryPage.addToCart(backpack);
    await inventoryPage.addToCart(bikeLight);
    await inventoryPage.openCart();
    // Assert
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await expect(cartPage.itemNames).toHaveText([backpack, bikeLight]);
  });

  test('removing an item takes it out of the cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    const { backpack, bikeLight } = data.products;
    await inventoryPage.addToCart(backpack);
    await inventoryPage.addToCart(bikeLight);
    await inventoryPage.openCart();
    // Act
    await cartPage.removeItem(backpack);
    // Assert
    await expect(cartPage.itemNames).toHaveText([bikeLight]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
