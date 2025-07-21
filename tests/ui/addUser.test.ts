import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import AddUserPage from '../../pages/ui/addUserPage';
import HomePage from '../../pages/ui/homePage';
import { UserApi } from '../../services/api/user.api';
import { UserDTO } from '../../dto/userDTO';
import { Gender } from '../../enums/gender.enum';

let addUserPage: AddUserPage;
const userApi = new UserApi();
let createdUsernames: string[] = [];

//ToDo: Let's devide this file into 2 ones be logic (it's great practice to store per 4 tests into one file (guess why?))

export const testUsers: Record<string, UserDTO> = {
  validData: {
    gender: Gender.Male,
    name: faker.person.firstName('male'),
    yearOfBirth: 1990
  },
  shortName: {
    gender: Gender.Female,
    name: faker.string.alpha({ length: 2 }),
    yearOfBirth: 2001
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto(`Forms/AddUser`);
  addUserPage = new AddUserPage(page);
});

test.afterEach(async ({ request }) => {
  if (!createdUsernames.length) return;

  const response = await userApi.getUsers(request);
  if (response.ok()) {
    const users = await response.json();

    for (const name of createdUsernames) {
      const match = users.find((users: UserDTO) => users.name === name);
      if (match) {
        await userApi.deleteUser(request, match.id);
      }
    }
  }

  createdUsernames = [];
});

test('@desktop Create new user with valid "User Name" and "Year of Birth"', async ({
  page,
  baseURL
}) => {
  const homePage = new HomePage(page);

  await addUserPage.fillUserForm(testUsers.validData);

  await addUserPage.submitAddUserForm();
  createdUsernames.push(testUsers.validData.name);

  await expect(
    homePage.mainHeading,
    'Expect main heading "Users and Addresses" to be visible on the home page'
  ).toBeVisible();
  await expect(page, 'Expect redirect to home page with correct URL').toHaveURL(baseURL!);

  await expect(
    homePage.userNameCells.filter({ hasText: testUsers.validData.name }).last(),
    `Expect user "${testUsers.validData.name}" to be visible in the users table`
  ).toBeVisible();
});

test('@mobile User is not created when "User Name" is too short', async () => {
  await addUserPage.fillUserForm(testUsers.shortName);

  await addUserPage.submitAddUserForm();

  await expect(
    addUserPage.inputUserNameError,
    "Invalid 'User Name' error should be visible"
  ).toBeVisible();
  expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toEqual(
    'Name is too short'
  );
});

test('@desktop @mobile Should show browser error with empty "User Name" and "Year of Birth"', async () => {
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
