import { test, expect } from '@playwright/test';
import AddUserPage from '../../../pages/ui/addUserPage';
import HomePage from '../../../pages/ui/homePage';
import { faker } from '@faker-js/faker';
import { Gender } from '../../../enums/gender.enum';
import { UserApi } from '../../../services/api/user.api';
import { UserDTO } from '../../../dto/userDTO';

let addUserPage: AddUserPage;
const userApi = new UserApi();
let createdUsernames: string[] = [];

const validUser: UserDTO = {
  gender: Gender.Male,
  name: faker.person.firstName('male'),
  yearOfBirth: 1990
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
      const match = users.find((user: UserDTO) => user.name === name);
      if (match) await userApi.deleteUser(request, match.id);
    }
  }
  createdUsernames = [];
});

test('@desktop @mobile Create new user with valid "User Name" and "Year of Birth"', async ({
  page,
  baseURL
}) => {
  const homePage = new HomePage(page);

  await addUserPage.fillUserForm(validUser);

  await addUserPage.submitAddUserForm();
  createdUsernames.push(validUser.name);

  await expect(
    homePage.mainHeading,
    'Expect main heading "Users and Addresses" to be visible on the home page'
  ).toBeVisible();
  await expect(page, 'Expect redirect to home page with correct URL').toHaveURL(baseURL!);

  await expect(
    homePage.userNameCells.filter({ hasText: validUser.name }).last(),
    `Expect user "${validUser.name}" to be visible in the users table`
  ).toBeVisible();
});
