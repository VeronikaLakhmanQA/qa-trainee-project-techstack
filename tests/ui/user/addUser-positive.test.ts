import { test, expect } from '@playwright/test';
import HomePage from '../../../pages/homePage';
import { faker } from '@faker-js/faker';
import { Gender } from '../../../enums/gender.enum';
import { UserApi } from '../../../api/user.api';
import { UserDTO } from '../../../dto/userDTO';
import { BASE_URL, ROUTES } from '../../../utils/constants';
import { UserSteps } from '../../../steps/userSteps';

let userSteps: UserSteps;

const userApi = new UserApi();
let createdUsernames: string[] = [];

const validUser: UserDTO = {
  gender: Gender.Male,
  name: faker.person.firstName('male'),
  yearOfBirth: 1990
};

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_USER);
  userSteps = new UserSteps(page);
});

test.afterEach(async ({ request }) => {
  if (!createdUsernames.length) return;

  const response = await userApi.getUsers(request);
  if (response.ok()) {
    const users = await response.json();

    for (const name of createdUsernames) {
      const match = users.find((user: UserDTO) => user.name === name);
      if (match) {
        await userApi.deleteUser(request, match.id);
      }
    }
  }
  createdUsernames = [];
});

test('create new user with valid "User Name" and "Year of Birth" @desktop @mobile', async ({
  page
}) => {
  const homePage = new HomePage(page);

  await userSteps.createUser(validUser);
  createdUsernames.push(validUser.name);

  await expect(
    homePage.mainHeading,
    'Expect main heading "Users and Addresses" to be visible on the home page'
  ).toBeVisible();
  await expect(page, 'Expect redirect to home page with correct URL').toHaveURL(BASE_URL!);

  await expect(
    homePage.userNameCells.filter({ hasText: validUser.name }).last(),
    `Expect user "${validUser.name}" to be visible in the users table`
  ).toBeVisible();
});
