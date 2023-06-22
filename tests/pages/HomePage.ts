import BasePage from './BasePage';

const headerText = '//h3[contains(text(), "crowd.Bible")]';
const expandIcon = '//button[@id = "app-menu-toggle-button"]';

class HomePage extends BasePage {
  async isheaderTextPresent() {
    await this.page.locator(headerText).last().waitFor();
    const headerTextPresent = await this.page
      .locator(headerText)
      .last()
      .isVisible();
    return headerTextPresent;
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).last().waitFor();
    await this.page.locator(expandIcon).last().click();
  }
}

export default HomePage;
