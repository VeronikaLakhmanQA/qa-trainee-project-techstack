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

  await test.step('Fill in "Add User" form', async () => {
    await addUserPage.selectGender('Male');
    await addUserPage.enterUsername(fakeUsername);
    await addUserPage.enterYearOfBirth('1990');
  });

  await test.step('Submit form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify redirection to home page', async () => {
    await page.waitForURL('**/');
    await expect(page).toHaveURL(baseURL!);
  });

  await test.step('Verify that user was added to the table', async () => {
    await expect(homePage.userNameCells.filter({ hasText: fakeUsername }).last()).toBeVisible();
  });
});

test('Should show browser error with empty "User Name" and "Year of Birth"', async ({ page }) => {
  const addUserPage = new AddUserPage(page);

  await test.step('Submit empty "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Validate "User Name" error message', async () => {
    expect(
      addUserPage.inputUserNameError,
      "Invalid 'User Name' error should be visible"
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toContain(
      'Name is requried'
    );
  });

  await test.step('Validate "Year of Birth" error message', async () => {
    expect(
      addUserPage.inputYearOfBirthError,
      "Invalid 'Year Of Birth' error should be visible"
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
      'Year of Birth is requried'
    );
  });
});

test('Validation error is shown when "User Name" field has less than minimum valid length', async ({
  page
}) => {
  const addUserPage = new AddUserPage(page);
  const fakeUsername = faker.person.firstName().slice(0, 2);

  await test.step('Enter too short username', async () => {
    await addUserPage.enterUsername(fakeUsername);
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify validation error for short username', async () => {
    expect(
      addUserPage.inputUserNameError,
      "Invalid 'User Name' error should be visible"
    ).toBeVisible();

    expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toContain(
      'Name is too short'
    );
  });
});

test('"User Name" field should not allow more than 14 characters', async ({ page }) => {
  const addUserPage = new AddUserPage(page);
  const longUsername = faker.string.alpha({ length: 15 });

  await test.step('Enter username longer than 14 characters', async () => {
    await addUserPage.enterUsername(longUsername);
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify username is truncated to 14 characters', async () => {
    const actualUsernameValue = await addUserPage.userNameInput.inputValue();
    expect(
      actualUsernameValue.length,
      '"User Name" field should limit input to 14 characters'
    ).toBeLessThanOrEqual(14);
  });
});

test('Validation error is shown when "Year of Birth" is less than allowed minimum 1900', async ({
  page
}) => {
  const addUserPage = new AddUserPage(page);

  await test.step('Enter year of birth less then allowed minimum 1900', async () => {
    await addUserPage.enterYearOfBirth('1899');
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify validation error for incorrect year of birth', async () => {
    expect(
      addUserPage.inputYearOfBirthError,
      "Invalid 'Year Of Birth' error should be visible"
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
      'Not valid Year of Birth is set'
    );
  });
});

test('Validation error is shown when "Year of Birth" is greater than allowed maximum 2005', async ({
  page
}) => {
  const addUserPage = new AddUserPage(page);

  await test.step('Enter year of birth more than allowed maximum 2005', async () => {
    await addUserPage.enterYearOfBirth('2006');
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify validation error for incorrect year of birth', async () => {
    expect(
      addUserPage.inputYearOfBirthError,
      "Invalid 'Year Of Birth' error should be visible"
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
      'Not valid Year of Birth is set'
    );
  });
});
