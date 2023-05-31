import BasePage from './Base';

const headerText = '//h1[contains(text(), "Register")]';
const emailTextBox = '#email';
const userNameTextBox = '#username';
const passwordTextBox = '#password';
const repeatPasswordTextBox = '#passwordConfirm';
const registerNowButton = '//button[contains(text(), "Register Now")]';
const forgotPasswordButton = '//button[contains(text(), "Forgot Password?")]';
const emailErrorMessage = '//p[@id = "email-helper-text"]';
const userNameErrorMessage = '//p[@id = "username-helper-text"]';
const passwordErrorMessage = '//p[@id = "password-helper-text"]';
const repeatPasswordErrorMessage = '//p[@id = "passwordConfirm-helper-text"]';
const existingUserValidation =
  '//div[@class = "MuiAlert-message css-1pxa9xg-MuiAlert-message"]';

class Registration extends BasePage {
  async fillRegistrationForm(registrationData: any) {
    await this.page.locator(emailTextBox).fill(registrationData.email);
    await this.page.locator(userNameTextBox).fill(registrationData.userName);
    await this.page.locator(passwordTextBox).fill(registrationData.password);
    await this.page
      .locator(repeatPasswordTextBox)
      .fill(registrationData.repeatPassword);
  }

  async clickOnRegisterButton() {
    await this.page.locator(registerNowButton).click();
  }

  async isHeaderTextPresent() {
    await this.page.locator(headerText).waitFor();
    const headerTextPresnt = await this.page.locator(headerText).isVisible();
    return headerTextPresnt;
  }

  async clickOnForgotPasswordButton() {
    await this.page.locator(forgotPasswordButton).click();
  }
  async isRegisterButtonDisabled() {
    const registerButtonDisabled = await this.page
      .locator(registerNowButton)
      .isDisabled();
    return registerButtonDisabled;
  }

  async getEmailErrorMessage() {
    const emailValidation = await this.page
      .locator(emailErrorMessage)
      .textContent();
    return emailValidation;
  }

  async getUserNameErrorMessage() {
    const userNameValidation = await this.page
      .locator(userNameErrorMessage)
      .textContent();
    return userNameValidation;
  }

  async getPasswordErrorMessage() {
    const passwordValidation = await this.page
      .locator(passwordErrorMessage)
      .textContent();
    return passwordValidation;
  }

  async getRepeatPasswordErrorMessage() {
    const repeatPasswordValidation = await this.page
      .locator(repeatPasswordErrorMessage)
      .textContent();
    return repeatPasswordValidation;
  }

  async getExistingUserErrorMessage() {
    const existingUserValidationMessage = await this.page
      .locator(existingUserValidation)
      .textContent();
    return existingUserValidationMessage;
  }
}

export default Registration;
