import { test, expect } from '@playwright/test';
import RegisterData from '../data-factory/RegisterData';
import RegisterPO from '../pages/RegistrationPage';
import LoginPO from '../pages/LoginPage';
import HomePO from '../pages/HomePage';
import LeftMenuPO from '../pages/LeftMenuPage';
import LoginDTO from '../data-objects/LoginDto';

test('1: Verify that user is register/logout and login again successfully', async ({
  page,
}) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const home = new HomePO(page);
  const leftMenu = new LeftMenuPO(page);
  const registerData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  expect(await login.isHeaderTextPresent()).toBeTruthy();

  //Click on the 'Don't have an account' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  expect(await register.isHeaderTextPresent()).toBeTruthy();

  //Fill and submit the register form
  await register.fillRegistrationForm(registerData);
  await register.clickOnRegisterButton();

  //Verify the header of the home page
  expect(await home.isheaderTextPresent()).toBeTruthy();

  //logout to the app
  await home.clickOnExpandMenu();
  expect(await leftMenu.isheaderTextPresent()).toBeTruthy();
  await leftMenu.clickOnLogout();

  //Verify the user is redirected to the login page
  expect(await login.isHeaderTextPresent()).toBeTruthy();

  //Login to the app with registered data
  const loginData = LoginDTO;
  loginData.email = registerData.email;
  loginData.password = registerData.password;

  await login.loginToApp(loginData);

  //Verify user is logged in
  expect(await home.isheaderTextPresent()).toBeTruthy();

  //logout to the app
  await home.clickOnExpandMenu();
  expect(await leftMenu.isheaderTextPresent()).toBeTruthy();
  await leftMenu.clickOnLogout();

  //Verify the user is redirected to the login page
  expect(await login.isHeaderTextPresent()).toBeTruthy();
});

test('2: Verify that email field is mandatory', async ({ page }) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const registerData = RegisterData.registerDataWithoutEmail();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill the register form without email
  await register.fillRegistrationForm(registerData);

  //Verify validation message is displayed for email
  const errorMessage = await register.getEmailErrorMessage();
  expect(errorMessage).toEqual('Email is required');

  const buttonDisabled = await register.isRegisterButtonDisabled();
  expect(buttonDisabled).toBeTruthy();
});

test('3: Verify that username field is mandatory', async ({ page }) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const registerData = RegisterData.registerDataWithoutUserName();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill the register form withoutusername
  await register.fillRegistrationForm(registerData);

  //Verify validation message is displayed for username
  const errorMessage = await register.getUserNameErrorMessage();
  expect(errorMessage).toEqual('First name is required');

  const buttonDisabled = await register.isRegisterButtonDisabled();
  expect(buttonDisabled).toBeTruthy();
});

test('4: Verify that password field is mandatory', async ({ page }) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const registerData = RegisterData.registerDataWithoutPassword();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill the register form without password
  await register.fillRegistrationForm(registerData);

  //Verify validation message is displayed for password
  const errorMessage = await register.getPasswordErrorMessage();
  expect(errorMessage).toEqual('Password is required');

  const buttonDisabled = await register.isRegisterButtonDisabled();
  expect(buttonDisabled).toBeTruthy();
});

test('5: Verify that repeat password field is mandatory', async ({ page }) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const registerData = RegisterData.registrationDataWithoutRepeatPassword();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill the registration form without password
  await register.fillRegistrationForm(registerData);

  //Verify validation message is displayed for password
  const errorMessage = await register.getRepeatPasswordErrorMessage();
  expect(errorMessage).toEqual('Password confirmation is required');

  const buttonDisabled = await register.isRegisterButtonDisabled();
  expect(buttonDisabled).toBeTruthy();
});

test('6: Verify that validation shown for invalid email format', async ({
  page,
}) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const registerData = RegisterData.registerDataWithInvalidEmailFormat();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill and submit the register form with invalid email format
  await register.fillRegistrationForm(registerData);

  //Verify validation message is displayed for invalid email
  const errorMessage = await register.getEmailErrorMessage();
  expect(errorMessage).toEqual('Invalid email address');

  const buttonDisabled = await register.isRegisterButtonDisabled();
  expect(buttonDisabled).toBeTruthy();
});

test('7 & 8: Verify that validation shown for diff data in password & repeat password', async ({
  page,
}) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const registerData = RegisterData.registerDataWithDiffPassAndRepeatPass();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill and submit the register form with diff password & repeat Pass
  await register.fillRegistrationForm(registerData);

  //Verify validation message is displayed in Password for incomplete data
  const errorMessageForPassword = await register.getPasswordErrorMessage();
  expect(errorMessageForPassword).toEqual(
    'Password must be at least 8 characters',
  );

  //Validation message is displayed in repeat password for diff from the password
  const errorMessage = await register.getRepeatPasswordErrorMessage();
  expect(errorMessage).toEqual('Passwords must match');

  const buttonDisabled = await register.isRegisterButtonDisabled();
  expect(buttonDisabled).toBeTruthy();
});

test('9: Verify that validation message shown while trying to registration with existing user', async ({
  page,
}) => {
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const home = new HomePO(page);
  const registerData = RegisterData.registerDataWithExistingUser();

  //Navigate to the URL
  await page.goto('/login');

  //Verify the login header text
  const headerTextPresentLoginPage = await login.isHeaderTextPresent();
  expect(headerTextPresentLoginPage).toBeTruthy();

  //Click on the 'Don't have an count' button
  await login.clickOnDontHaveAccountButton();

  //Verify the title of the page
  const headerTextPresentRegisterPage = await register.isHeaderTextPresent();
  expect(headerTextPresentRegisterPage).toBeTruthy();

  //Fill and submit the register form with existing user
  await register.fillRegistrationForm(registerData);
  await register.clickOnRegisterButton();

  //Verify the header of the home page
  const headerTextPresentHomePage = await home.isheaderTextPresent();
  expect(headerTextPresentHomePage).toBeTruthy();

  //Verify validation message is displayed for user
  const errorMessageForExistingUser =
    await register.getExistingUserErrorMessage();
  expect(errorMessageForExistingUser).toEqual('User exists with same username');
});
