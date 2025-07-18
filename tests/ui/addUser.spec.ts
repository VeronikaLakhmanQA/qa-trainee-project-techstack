import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import AddUserPage from '../../pages/ui/addUserPage';
import HomePage from '../../pages/ui/homePage';
import { UserApi } from '../../pages/api/user.api';
import { UserDTO } from '../../dto/userDTO';
import { Gender } from '../../enums/gender.enum';

let addUserPage: AddUserPage;
let userApi: UserApi;
let createdUsernames: string[] = [];

//ToDo: Let's devide this file into 2 ones be logic (it's great practice to store per 4 tests into one file (guess why?))

// ToDo: how does your linter work? 
// I made formatting mistakes on purpose. 
// Linter should define them and resolve(you should have possibility to do it with the certain npm script)
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

test.beforeEach(async ({ page, baseURL, request }) => {
  // ToDo: it's better to move page url to the separate file wth url constants(for using it in different files in the future)
  await page.goto(`${baseURL}Forms/AddUser`);
  addUserPage = new AddUserPage(page);
  userApi = new UserApi(request, baseURL!);
});

test.afterEach(async () => {
  if (!createdUsernames.length) return;

  const response = await userApi.getUsers();
  if (response.ok()) {
    const users = await response.json();

    for (const name of createdUsernames) {
      const match = users.find((users: any) => users.name === name);
      if (match) {
        await userApi.deleteUser(match.id);
      }
    }
  }

  createdUsernames = [];
});

test('Create new user with valid "User Name" and "Year of Birth"', async ({ page, baseURL }) => {
  const homePage = new HomePage(page);

  // ToDo: remove these test.step in each test (we can discuss it)
  await test.step('Fill in "Add User" form', async () => {
    await addUserPage.fillUserForm(testUsers.validData);
  });

  await test.step('Submit form', async () => {
    await addUserPage.submitAddUserForm();
    createdUsernames.push(testUsers.validData.name);
  });

  await test.step('Verify redirection to home page', async () => {
    // ToDo: it's not clear what we are waiting for. It's better to wait for page loading and afterward check url equalence. 
    // BTW, it's better to verify equality instead of containing(if we can for sure, but here I think we can)
    await page.waitForURL('**/');
    await expect(page).toHaveURL(baseURL!);
  });

  await test.step('Verify that user was added to the table', async () => {
    await expect(
      homePage.userNameCells.filter({ hasText: testUsers.validData.name }).last()
    ).toBeVisible();
  });
});

// ToDo: it can be simplified: User is not created when user data is invalid
// and inside the test you will add appropriate data and it wil be enaugh
test('User is not created when "User Name" is shorter than 3 characters and "Year of Birth" is between 1900 - 2005', async () => {
  await test.step('Fill in "Add User" form with too short username', async () => {
    await addUserPage.fillUserForm(testUsers.shortName);
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify validation error for short username', async () => {
    await expect(
      addUserPage.inputUserNameError,
      "Invalid 'User Name' error should be visible"
    ).toBeVisible();

    // ToDo: Is it possible to use toEqual method instead?
    expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toContain(
      'Name is too short'
    );
  });
});

test('Should show browser error with empty "User Name" and "Year of Birth"', async () => {
  await test.step('Submit empty "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Validate "User Name" error message', async () => {
    await expect(
      addUserPage.inputUserNameError,
      "Invalid 'User Name' error should be visible"
    ).toBeVisible();
    // ToDo: same as above
    expect(await addUserPage.getErrorText(addUserPage.inputUserNameError)).toContain(
      'Name is requried'
    );
  });

  await test.step('Validate "Year of Birth" error message', async () => {
    await expect(
      addUserPage.inputYearOfBirthError,
      "Invalid 'Year Of Birth' error should be visible"
    ).toBeVisible();
    // ToDo: same as above
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
      'Year of Birth is requried'
    );
  });
});

test('"User Name" field should not allow more than 14 characters', async () => {
  const longUsername = faker.string.alpha({ length: 15 });

  await test.step('Enter username longer than 14 characters', async () => {
    await addUserPage.enterUsername(longUsername);
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify username is truncated to 14 characters', async () => {
    const actualUsernameValue = await addUserPage.userNameInput.inputValue();
    // ToDo: don't forget about "magic numbers". 
    // It's better to create const with the appropriate name(ex: userNameCharLimit or smth like this) and define here needed number and wirk with this. 
    // It also related to 'longUsername' const data
    expect(
      actualUsernameValue.length,
      '"User Name" field should limit input to 14 characters'
    ).toBeLessThanOrEqual(14);
  });
});

// ToDo: Validation error is shown when "Year of Birth" is less than allowed minimum
test('Validation error is shown when "Year of Birth" is less than allowed minimum 1900', async () => {
  await test.step('Enter year of birth less then allowed minimum 1900', async () => {
    await addUserPage.enterYearOfBirth(1899);
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify validation error for incorrect year of birth', async () => {
    await expect(
      addUserPage.inputYearOfBirthError,
      "Invalid 'Year Of Birth' error should be visible"
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
      'Not valid Year of Birth is set'
    );
  });
});

// ToDo: combine this and above one tests into test.each structure
test('Validation error is shown when "Year of Birth" is greater than allowed maximum 2005', async () => {
  await test.step('Enter year of birth more than allowed maximum 2005', async () => {
    await addUserPage.enterYearOfBirth(2006);
  });

  await test.step('Submit the "Add User" form', async () => {
    await addUserPage.submitAddUserForm();
  });

  await test.step('Verify validation error for incorrect year of birth', async () => {
    await expect(
      addUserPage.inputYearOfBirthError,
      "Invalid 'Year Of Birth' error should be visible"
    ).toBeVisible();
    expect(await addUserPage.getErrorText(addUserPage.inputYearOfBirthError)).toContain(
      'Not valid Year of Birth is set'
    );
  });
});
