import BasePage from './Base';

const headerText = '//h2[contains(text(), "Home Screen")]';
const expandIcon =
  '//button[@class = "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1s9j4fq-MuiButtonBase-root-MuiIconButton-root"]';

class Home extends BasePage {
  async isheaderTextPresent() {
    await this.page.locator(headerText).waitFor();
    const headerTextPresnt = await this.page.locator(headerText).isVisible();
    return headerTextPresnt;
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).click();
  }
}

export default Home;
