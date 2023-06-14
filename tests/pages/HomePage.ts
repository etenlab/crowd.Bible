import BasePage from './BasePage';

const headerText = '//h3[contains(text(), "crowd.Bible")]';
const expandIcon =
  '//button[@class = "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1s9j4fq-MuiButtonBase-root-MuiIconButton-root"]';

class HomePage extends BasePage {
  async isheaderTextPresent() {
    await this.page.waitForSelector(headerText);
    const headerTextPresnt = await this.page.locator(headerText).isVisible();
    return headerTextPresnt;
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).first().click();
  }
}

export default HomePage;
