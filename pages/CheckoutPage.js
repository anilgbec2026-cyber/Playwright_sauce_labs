const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.getByTestId('title');
    // Step 1: customer information
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.getByTestId('error');
    // Step 2: overview
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    // Final: confirmation
    this.confirmationHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };
