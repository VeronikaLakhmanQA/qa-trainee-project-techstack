import { test, expect } from '@playwright/test';
import AddUserPage from '../../../pages/ui/addUserPage';
import { faker } from '@faker-js/faker';
import { Gender } from '../../../enums/gender.enum';
import { UserDTO } from '../../../dto/userDTO';

let addUserPage: AddUserPage;

const shortName: UserDTO = {
  gender: Gender.Female,
  name: faker.string.alpha({ length: 2 }),
  yearOfBirth: 2001
};

test.beforeEach(async ({ page }) => {
  await page.goto('Forms/AddUser');
  addUserPage = new AddUserPage(page);
});

test('@desktop Should show browser error with empty "User Name" and "Year of Birth"', async () => {
  await addUserPage.submitAddUserForm();

  await expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toEqual(
    'Name is requried'
  );

  await expect(
    addUserPage.inputYearOfBirthError,
    "Invalid 'Year Of Birth' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toEqual(
    'Year of Birth is requried'
  );
});

test('@mobile User is not created when "User Name" is too short', async () => {
  await addUserPage.fillUserForm(shortName);

  await addUserPage.submitAddUserForm();

  await expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toEqual(
    'Name is too short'
  );
});

test('@desktop @mobile "User Name" field should not allow more than 14 characters', async () => {
  const userNameCharLimit = 14;
  const longUsername = faker.string.alpha({ length: userNameCharLimit + 1 });

  await addUserPage.enterUsername(longUsername);

  await addUserPage.submitAddUserForm();

  const actualUsernameValue = await addUserPage.userNameInput.inputValue();

  expect(
    actualUsernameValue.length,
    '"User Name" field should limit input to 14 characters'
  ).toBeLessThanOrEqual(userNameCharLimit);
});

[
  { year: 1899, description: 'less than allowed minimum 1900' },
  { year: 2006, description: 'greater than allowed maximum 2005' }
].forEach(({ year, description }) => {
  test(`@desktop @mobile Validation error is shown when "Year of Birth" is: ${description}`, async () => {
    await addUserPage.enterYearOfBirth(year);

    await addUserPage.submitAddUserForm();

    await expect(
      addUserPage.inputYearOfBirthError,
      `Validation error should be shown when year is ${year} (${description})`
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toEqual(
      'Not valid Year of Birth is set'
    );
  });
});
