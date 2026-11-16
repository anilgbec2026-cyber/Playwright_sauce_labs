const { test, expect } = require('../fixtures/pageFixtures');
const data = require('../test-data/users.json');

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(data.users.standard.username, data.users.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('user completes checkout end to end and sees the confirmation message', async ({
    
    cartPage,
    inventoryPage,
    checkoutPage,
    page,
  }) => {
    // Arrange
    await inventoryPage.addToCart(data.products.backpack);
    await inventoryPage.openCart();
    // Act
    await cartPage.checkout();
    await checkoutPage.fillCustomerInfo(data.customer);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await checkoutPage.finish();
    // Assert
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.confirmationHeader).toBeVisible();
  });
});
