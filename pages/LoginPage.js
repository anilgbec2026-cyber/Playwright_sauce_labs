const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    // Locators are defined once here, so if the UI changes we fix them in ONE place.
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // The error banner has no role or label, so the test id is the best option.
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.open('/');
  }

  async login(username, password) {
    // Skip typing when a value is empty, so we can test the "empty username" case.
    if (username) await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
