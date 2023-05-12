import { test, expect } from '@playwright/test';

test('Launch the app', async ({ page }) => {
  //Navigate to the URL
  await page.goto('/home');

  //Verify the title of the page
  await expect(page).toHaveTitle('crowd.Bible');
});
