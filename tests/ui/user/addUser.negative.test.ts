import { test, expect } from '@playwright/test';
import AddUserPage from '../../../pages/addUserPage';
import { faker } from '@faker-js/faker';
import { Gender } from '../../../enums/gender.enum';
import { UserDTO } from '../../../dto/userDTO';
import { ROUTES } from '../../../utils/constants';
import { getErrorText } from '../../../steps/genericSteps';

let addUserPage: AddUserPage;

const shortName: UserDTO = {
  gender: Gender.Female,
  name: faker.string.alpha({ length: 2 }),
  yearOfBirth: 2001
};

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_USER);
  addUserPage = new AddUserPage(page);
});

test('Should show browser error with empty "User Name" and "Year of Birth" @desktop', async () => {
  await addUserPage.submitAddUserForm();

  await expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await getErrorText(addUserPage.inputUserNameError)).toEqual('Name is requried');

  await expect(
    addUserPage.inputYearOfBirthError,
    "Invalid 'Year Of Birth' error should be visible"
  ).toBeVisible();
  expect(await getErrorText(addUserPage.inputYearOfBirthError)).toEqual(
    'Year of Birth is requried'
  );
});

test('User is not created when "User Name" is too short @mobile', async () => {
  await addUserPage.fillUserForm(shortName);
  await addUserPage.submitAddUserForm();

  await expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await getErrorText(addUserPage.inputUserNameError)).toEqual('Name is too short');
});

test('"User Name" field should not allow more than 14 characters @desktop @mobile', async () => {
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

const invalidYears = [
  { year: 1899, description: 'less than allowed minimum 1900' },
  { year: 2006, description: 'greater than allowed maximum 2005' }
];

invalidYears.forEach(({ year, description }) => {
  test(`Validation error is shown when "Year of Birth" is: ${description} @desktop @mobile`, async () => {
    await addUserPage.enterYearOfBirth(year);
    await addUserPage.submitAddUserForm();

    await expect(
      addUserPage.inputYearOfBirthError,
      `Validation error should be shown when year is ${year} (${description})`
    ).toBeVisible();
    expect(await getErrorText(addUserPage.inputYearOfBirthError)).toEqual(
      'Not valid Year of Birth is set'
    );
  });
});
