import BasePage from './BasePage';
import LoginDTO from '../data-objects/LoginDto';

const headerText = '//h1[contains(text(), "Login")]';
const emailTextBox = '#email';
const passwordTextBox = '#password';
const loginNowButton = '//button[contains(text(), "Login Now")]';
const dontHaveAccountButton =
  '//button[contains(text(), "you have an account?")]';

class LoginPage extends BasePage {
  async isheaderTextPresent() {
    await this.page.waitForSelector(headerText);
    const headerTextPresnt = await this.page.locator(headerText).isVisible();
    return headerTextPresnt;
  }

  async loginToApp(loginData: any) {
    await this.page.locator(emailTextBox).first().fill(loginData.email);
    await this.page.locator(passwordTextBox).first().fill(loginData.password);
    await this.page.locator(loginNowButton).first().click();
  }

  async clickOnDontHaveAccountButton() {
    await this.page.waitForSelector(dontHaveAccountButton);
    await this.page.locator(dontHaveAccountButton).click();
  }

  async getLoginDetails() {
    const loginData = LoginDTO;
    loginData.email = await this.page
      .locator(emailTextBox)
      .first()
      .getAttribute('value');
    loginData.password = await this.page
      .locator(passwordTextBox)
      .first()
      .getAttribute('value');
    return loginData;
  }
}

export default LoginPage;
