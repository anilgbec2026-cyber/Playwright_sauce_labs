const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  /** Locator for one product card, found by its name. */
  itemByName(name) {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name) {
    await this.itemByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name) {
    await this.itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  /** @param {'az'|'za'|'lohi'|'hilo'} value */
  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }

  /** Read all prices as numbers, e.g. "$29.99" becomes 29.99 */
  async getPrices() {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
