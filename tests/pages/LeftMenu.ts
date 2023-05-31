import BasePage from './Base';

const headerText = '//span[contains(text(), "Menu")]';
const logoutOption = '//p[contains(text(), "Logout")]';

class LeftMenu extends BasePage {
  async isheaderTextPresent() {
    await this.page.locator(headerText).waitFor();
    const headerTextPresnt = await this.page.locator(headerText).isVisible();
    return headerTextPresnt;
  }

  async clickOnLogout() {
    await this.page.locator(logoutOption).click();
  }
}

export default LeftMenu;
