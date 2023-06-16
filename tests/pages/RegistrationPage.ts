import BasePage from './BasePage';

const headerText = '//h1[contains(text(), "Register")]';
const emailTextBox = '//input[@id = "email"]';
const userNameTextBox = '#username';
const passwordTextBox = '#password';
const repeatPasswordTextBox = '#passwordConfirm';
const registerNowButton = '//button[contains(text(), "Register Now")]';
const forgotPasswordButton = '//button[contains(text(), "Forgot Password?")]';
const emailErrorMessage = '//p[@id = "email-helper-text"]';
const userNameErrorMessage = '//p[@id = "username-helper-text"]';
const passwordErrorMessage = '//p[@id = "password-helper-text"]';
const repeatPasswordErrorMessage = '//p[@id = "passwordConfirm-helper-text"]';
const existingUserValidation = '//div[@id = "error-message"]';

class RegistrationPage extends BasePage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fillRegistrationForm(registrationData: any) {
    await this.page.locator(emailTextBox).last().fill(registrationData.email);
    await this.page
      .locator(userNameTextBox)
      .first()
      .fill(registrationData.userName);
    await this.page
      .locator(passwordTextBox)
      .last()
      .fill(registrationData.password);
    await this.page
      .locator(repeatPasswordTextBox)
      .last()
      .fill(registrationData.repeatPassword);
  }

  async clickOnRegisterButton() {
    await this.page.locator(registerNowButton).first().click();
  }

  async isHeaderTextPresent() {
    await this.page.locator(headerText).first().waitFor();
    const headerTextPresnt = await this.page
      .locator(headerText)
      .first()
      .isVisible();
    return headerTextPresnt;
  }

  async clickOnForgotPasswordButton() {
    await this.page.locator(forgotPasswordButton).first().click();
  }
  async isRegisterButtonDisabled() {
    const registerButtonDisabled = await this.page
      .locator(registerNowButton)
      .first()
      .isDisabled();
    return registerButtonDisabled;
  }

  async getEmailErrorMessage() {
    const emailValidation = await this.page
      .locator(emailErrorMessage)
      .first()
      .textContent();
    return emailValidation;
  }

  async getUserNameErrorMessage() {
    const userNameValidation = await this.page
      .locator(userNameErrorMessage)
      .first()
      .textContent();
    return userNameValidation;
  }

  async getPasswordErrorMessage() {
    const passwordValidation = await this.page
      .locator(passwordErrorMessage)
      .first()
      .textContent();
    return passwordValidation;
  }

  async getRepeatPasswordErrorMessage() {
    const repeatPasswordValidation = await this.page
      .locator(repeatPasswordErrorMessage)
      .first()
      .textContent();
    return repeatPasswordValidation;
  }

  async getExistingUserErrorMessage() {
    const existingUserValidationMessage = await this.page
      .locator(existingUserValidation)
      .first()
      .textContent();
    return existingUserValidationMessage;
  }
}

export default RegistrationPage;
