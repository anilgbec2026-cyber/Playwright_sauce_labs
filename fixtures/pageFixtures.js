// Custom fixtures: Playwright creates the page objects for us and hands them to each test.
// Tests then simply write:  test('...', async ({ loginPage, inventoryPage }) => { ... })
const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { MenuComponent } = require('../pages/MenuComponent');
const { DynamicCatalogPage } = require('../pages/DynamicCatalogPage');

const test = base.test.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  menu: async ({ page }, use) => use(new MenuComponent(page)),
  dynamicCatalogPage: async ({ page }, use) => use(new DynamicCatalogPage(page)),
});

module.exports = { test, expect: base.expect };
