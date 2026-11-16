const { test, expect } = require('../fixtures/pageFixtures');
const data = require('../test-data/users.json');

// Scenarios 1-11: login and the hamburger menu.
test.describe('Hamburger menu', () => {
  // Scenario 1 is the shared setup: log in as a standard user and land on the inventory page.
  test.beforeEach(async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(data.users.standard.username, data.users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('scenario 2: opening the menu shows all menu options', async ({ menu }) => {
    // Arrange
    // Act
    await menu.open();
    // Assert
    await expect(menu.options).toHaveText(data.menuItems);
    await expect(menu.closeButton).toBeVisible();
  });

  test('scenario 3: All Items opens the inventory page with all products', async ({ menu, inventoryPage, cartPage, page }) => {
    // Arrange: move away from the inventory page first, so the click has a visible effect
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await menu.open();
    // Act
    await menu.allItemsLink.click();
    // Assert
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('scenario 4: Dynamic Catalog > Lazy Load shows all products after scrolling', async ({ menu, dynamicCatalogPage, page }) => {
    // Arrange
    await menu.open();
    await menu.openDynamicCatalogSubmenu();
    // Act
    await menu.lazyLoadLink.click();
    await dynamicCatalogPage.scrollToLoadAll();
    // Assert
    await expect(page).toHaveURL(/dynamic-catalog-lazy-load\.html/);
    await expect(dynamicCatalogPage.title).toHaveText('Dynamic Catalog - Lazy Load');
    // Lazy load is infinite scroll: each scroll adds more real products, so we check that the list GROWS.
    await expect(dynamicCatalogPage.lazyLoadNames.first()).toBeVisible();
    const loadedAfterFirstScroll = await dynamicCatalogPage.lazyLoadNames.count();
    await dynamicCatalogPage.scrollToLoadAll();
    await expect.poll(() => dynamicCatalogPage.lazyLoadNames.count()).toBeGreaterThan(loadedAfterFirstScroll);
    await expect(dynamicCatalogPage.lazyLoadNames.last()).not.toBeEmpty();
  });

  test('scenario 5: Dynamic Catalog > Spinner shows all products once loading finishes', async ({ menu, dynamicCatalogPage, page }) => {
    // Arrange
    await menu.open();
    await menu.openDynamicCatalogSubmenu();
    // Act
    await menu.spinnerLink.click();
    // Assert
    await expect(page).toHaveURL(/dynamic-catalog-spinner\.html/);
    await expect(dynamicCatalogPage.title).toHaveText('Dynamic Catalog - Spinner');
    await expect(dynamicCatalogPage.spinnerGrid).toBeVisible();
    await expect(dynamicCatalogPage.spinner).toBeHidden();
    await expect(dynamicCatalogPage.spinnerNames).toHaveCount(6);
  });

  test('scenario 6: Dynamic Catalog > Slider lets the user view every product', async ({ menu, dynamicCatalogPage, page }) => {
    // Arrange
    await menu.open();
    await menu.openDynamicCatalogSubmenu();
    // Act
    await menu.sliderLink.click();
    // Assert
    await expect(page).toHaveURL(/dynamic-catalog-slider\.html/);
    await expect(dynamicCatalogPage.title).toHaveText('Dynamic Catalog - Slider');
    await expect(dynamicCatalogPage.sliderDots).toHaveCount(6);
    // The slider auto-advances, so (instead of clicking dots, which autoplay can override)
    // we keep watching until every product named by the dots has been shown at least once.
    const expectedNames = (await dynamicCatalogPage.sliderDots.evaluateAll((dots) =>
      dots.map((d) => d.getAttribute('aria-label').replace('Show ', ''))));
    const seen = new Set();
    await expect
      .poll(async () => {
        seen.add(await dynamicCatalogPage.sliderItemName.innerText());
        return [...seen].sort();
      }, { timeout: 50 * 1000, intervals: [250] })
      .toEqual([...expectedNames].sort());
  });

  test('scenario 7: About opens the Sauce Labs website', async ({ menu, page }) => {
    // Arrange
    await menu.open();
    // Act
    await menu.aboutLink.click();
    // Assert
    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('scenario 8: Logout returns to the login screen', async ({ menu, loginPage, page }) => {
    // Arrange
    await menu.open();
    // Act
    await menu.logoutLink.click();
    // Assert
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('scenario 9: Reset App State clears the cart', async ({ menu, inventoryPage }) => {
    // Arrange: put something in the cart so there is state to reset
    await inventoryPage.addToCart(data.products.backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await menu.open();
    // Act
    await menu.resetLink.click();
    // Assert
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('scenario 10: Close button hides the menu and keeps the page state', async ({ menu, inventoryPage, page }) => {
    // Arrange
    await inventoryPage.addToCart(data.products.backpack);
    await menu.open();
    await expect(menu.allItemsLink).toBeVisible();
    // Act
    await menu.close();
    // Assert
    await expect(menu.allItemsLink).toBeHidden();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('scenario 11: menu options are all visible and do not overlap', async ({ menu }) => {
    // Arrange
    await menu.open();
    await menu.openDynamicCatalogSubmenu(); // expanded menu is the most crowded state
    await expect(menu.lazyLoadLink).toBeVisible();
    // Act: measure the on-screen box of every option, top to bottom
    const boxes = [];
    for (const link of await menu.allLinks.all()) {
      await expect(link).toBeVisible();
      boxes.push(await link.boundingBox());
    }
    // Assert: no two options share any screen area, and all sit inside the menu panel
    const panelBox = await menu.panel.boundingBox();
    expect(boxes.length).toBe(8);
    for (let i = 0; i < boxes.length; i++) {
      expect(boxes[i].x).toBeGreaterThanOrEqual(panelBox.x);
      expect(boxes[i].x + boxes[i].width).toBeLessThanOrEqual(panelBox.x + panelBox.width + 1);
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        const overlaps = a.x < b.x + b.width - 1 && b.x < a.x + a.width - 1 && a.y < b.y + b.height - 1 && b.y < a.y + a.height - 1;
        expect(overlaps, 'options ' + i + ' and ' + j + ' overlap').toBe(false);
      }
    }
  });
});
