const { BasePage } = require('./BasePage');

// The three "Dynamic Catalog" pages (Lazy Load / Spinner / Slider) share a title bar,
// but each one shows its products differently.
class DynamicCatalogPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');

    // Lazy Load: products appear as you scroll down to the "sentinel" element at the bottom.
    this.lazyLoadContainer = page.getByTestId('dynamic-catalog-lazy-load-container');
    this.lazyLoadSentinel = page.getByTestId('dynamic-catalog-lazy-load-sentinel');
    this.lazyLoadNames = page.locator('[data-test^="lazy-load-item-"][data-test$="-name"]');

    // Spinner: a loading indicator is shown first, then the product grid replaces it.
    this.spinner = page.getByTestId('dynamic-catalog-spinner');
    this.spinnerGrid = page.getByTestId('dynamic-catalog-spinner-grid');
    this.spinnerNames = page.locator('[data-test^="spinner-item-"][data-test$="-name"]');

    // Slider: shows one product at a time; the dots jump to a specific product.
    this.sliderItemName = page.getByTestId('dynamic-catalog-slider-item-name');
    this.sliderDots = page.locator('[data-test^="dynamic-catalog-slider-dot-"]');
  }

  /** Scroll down so the lazy-loaded products get rendered. */
  async scrollToLoadAll() {
    await this.lazyLoadSentinel.scrollIntoViewIfNeeded();
  }
}

module.exports = { DynamicCatalogPage };
