import { test, expect } from '@playwright/test';

test('Launch the app', async ({ page }) => {
  //Navigate to the URL
  await page.goto(RouteConst.HOME);

  //Verify the title of the page
  await expect(page).toHaveTitle('crowd.Bible');
});
