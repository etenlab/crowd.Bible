import BasePage from './BasePage';

const headerText = '//span[contains(text(), "Menu")]';
const logoutOption = '//p[contains(text(), "Logout")]';

class LeftMenuPage extends BasePage {
  async isheaderTextPresent() {
    await this.page.locator(headerText).first().waitFor();
    const headerTextPresnt = await this.page
      .locator(headerText)
      .first()
      .isVisible();
    return headerTextPresnt;
  }

  async clickOnLogout() {
    await this.page.locator(logoutOption).first().click();
  }
}

export default LeftMenuPage;
