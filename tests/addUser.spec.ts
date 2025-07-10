import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import AddUserPage from '../pages/addUserPage';
import HomePage from '../pages/homePage';

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${baseURL}Forms/AddUser`);
});

test('Create new user with valid "User Name" and "Year of Birth"', async ({ page, baseURL }) => {
  const addUserPage = new AddUserPage(page);
  const homePage = new HomePage(page);
  const fakeUsername = faker.person.firstName('male');

  await addUserPage.selectGender('Male');
  await addUserPage.enterUsername(fakeUsername);
  await addUserPage.enterYearOfBirth('1990');
  await addUserPage.submitAddUserForm();

  await page.waitForURL('**/');
  await expect(page).toHaveURL(baseURL!);

  await expect(homePage.userNameCells.filter({ hasText: fakeUsername }).last()).toBeVisible();
});

test('Should show browser error with empty "User Name" and "Year of Birth"', async ({ page }) => {
  const addUserPage = new AddUserPage(page);

  await addUserPage.submitAddUserForm();

  expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toContain(
    'Name is requried'
  );

  expect(
    addUserPage.inputYearOfBirthError,
    "Invalid 'Year Of Birth' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
    'Year of Birth is requried'
  );
});

test('Validation error is shown when "User Name" field has less than minimum valid length', async ({
  page
}) => {
  const addUserPage = new AddUserPage(page);
  const fakeUsername = faker.person.firstName().slice(0, 2);

  await addUserPage.enterUsername(fakeUsername);
  await addUserPage.submitAddUserForm();

  expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toContain(
    'Name is too short'
  );
});

test('"User Name" field should not allow more than 14 characters', async ({ page }) => {
  const addUserPage = new AddUserPage(page);
  const longUsername = faker.string.alpha({ length: 15 });

  await addUserPage.enterUsername(longUsername);
  await addUserPage.submitAddUserForm();

  const actualUsernameValue = await addUserPage.userNameInput.inputValue();
  expect(
    actualUsernameValue.length,
    '"User Name" field should limit input to 14 characters'
  ).toBeLessThanOrEqual(14);
});

test('Validation error is shown when "Year of Birth" is less than allowed minimum 1900', async ({
  page
}) => {
  const addUserPage = new AddUserPage(page);

  await addUserPage.enterYearOfBirth('1899');
  await addUserPage.submitAddUserForm();

  expect(
    addUserPage.inputYearOfBirthError,
    "Invalid 'Year Of Birth' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
    'Not valid Year of Birth is set'
  );
});

test('Validation error is shown when "Year of Birth" is greater than allowed maximum 2005', async ({
  page
}) => {
  const addUserPage = new AddUserPage(page);

  await addUserPage.enterYearOfBirth('2006');
  await addUserPage.submitAddUserForm();

  expect(
    addUserPage.inputYearOfBirthError,
    "Invalid 'Year Of Birth' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
    'Not valid Year of Birth is set'
  );
});
