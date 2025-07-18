import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserDTO } from '../../dto/userDTO';
import { UserApi } from '../../pages/api/user.api';

// ToDo: let's change tests' files fromat from spec.ts to test.ts (for all test files)
test.describe('User API - CRUD', () => {
  let userApi: UserApi;
  let userId: number;

  test.beforeEach(async ({ request, baseURL }) => {
    userApi = new UserApi(request, baseURL!);

    const newApiUser: UserDTO = {
      // ToDo: Use here certain Gender fron enum instead of the numbers
      gender: 1,
      name: faker.person.firstName('male'),
      yearOfBirth: 1993
    };

    const result = await userApi.createUser(newApiUser);

    expect(result.status(), 'Status code should be 200 when creating new user').toBe(200);
    const body = await result.json();

    userId = body.id;
  });

  test.afterEach(async () => {
    const deleteUserResponse = await userApi.deleteUser(userId);
    expect(
      deleteUserResponse.ok(),
      'Expected status code should be 200 after deleting the user'
    ).toBeTruthy();
  });

  // ToDo: write in one format: "Get" and "GET" shouldn't be (uppercase I liked more))
  test('Get /api/User - should return list of users', async () => {
    const getUsersResponse = await userApi.getUsers();

    // ToDo: you can see that you use these two line of the code not one time. 
    // It will be great to create some kind of helper or utils folder/file to move it in the separate method there
    expect(getUsersResponse.ok, 'Expected successful response').toBeTruthy();
    expect(getUsersResponse.status(), 'Status code should be 200').toBe(200);

    const body = await getUsersResponse.json();
    expect(Array.isArray(body), 'Response body should be an array of users').toBe(true);
    expect(body.length, 'Users array should contain at least one user').toBeGreaterThan(0);
  });

  test('GET /api/User/{id} - should return a specific user', async () => {
    const getSpecificUserResponse = await userApi.getUserById(userId);

    expect(getSpecificUserResponse.ok, 'Expected successful response').toBeTruthy();
    expect(getSpecificUserResponse.status(), 'Status code should be 200').toBe(200);

    const body = await getSpecificUserResponse.json();
    expect(body.id, 'User ID in response should match the requested userId').toBe(userId);
  });

  test('PUT /api/User/{id} - should update the user', async () => {
    const updatedApiUser: UserDTO = {
      // ToDo: Use here certain Gender fron enum instead of the numbers
      gender: 2,
      name: faker.person.firstName('female'),
      yearOfBirth: 2002
    };

    const putApiResponse = await userApi.updateUser(userId, updatedApiUser);

    expect(putApiResponse.status(), 'Status code should be 200 after updating the user').toBe(200);

    const body = await putApiResponse.json();
    expect(body.name, 'Updated name should match the value sent in PUT request').toBe(
      updatedApiUser.name
    );
    expect(body.gender, 'Updated gender should match the value sent in PUT request').toBe(
      updatedApiUser.gender
    );
    expect(
      body.yearOfBirth,
      'Updated year of birth should match the value sent in PUT request'
    ).toBe(Number(updatedApiUser.yearOfBirth));
  });
});

export { UserApi };
