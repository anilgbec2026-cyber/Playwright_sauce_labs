const { BasePage } = require('./BasePage');

// The hamburger (side) menu. It is shared by all logged-in pages, so it gets its own class.
class MenuComponent extends BasePage {
  constructor(page) {
    super(page);
    this.openButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
    this.panel = page.locator('.bm-menu-wrap'); // the sliding panel (no role or test id on it)
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.dynamicCatalogLink = page.getByTestId('dynamic-catalog-sidebar-link');
    this.lazyLoadLink = page.getByTestId('dynamic-catalog-lazy-load-link');
    this.spinnerLink = page.getByTestId('dynamic-catalog-spinner-link');
    this.sliderLink = page.getByTestId('dynamic-catalog-slider-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetLink = page.getByTestId('reset-sidebar-link');
    // Every top-level option, in on-screen order.
    this.options = page.locator('nav.bm-item-list > a');
    // Top-level options plus any expanded sub-options.
    this.allLinks = page.locator('.bm-menu-wrap a.menu-item');
  }

  async open() {
    await this.openButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async openDynamicCatalogSubmenu() {
    await this.dynamicCatalogLink.click();
  }
}

module.exports = { MenuComponent };
