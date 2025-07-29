import { test, expect, APIRequestContext, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserDTO } from '../../dto/userDTO';
import { Gender } from '../../enums/gender.enum';
import { UserApi } from '../../api/user.api';
import { expectSuccessfulResponse } from '../../utils/api-utils';

test.describe('User API - CRUD @api', () => {
  const userApi = new UserApi();
  let apiContext: APIRequestContext;
  let userId: number;

  test.beforeEach(async () => {
    apiContext = await request.newContext();

    const newApiUser: UserDTO = {
      gender: Gender.Male,
      name: faker.person.firstName('male'),
      yearOfBirth: 1993
    };

    const result = await userApi.createUser(apiContext, newApiUser);
    await expectSuccessfulResponse(result);

    const body = await result.json();
    userId = body.id;
  });

  test.afterEach(async () => {
    const deleteUserResponse = await userApi.deleteUser(apiContext, userId);
    await expectSuccessfulResponse(deleteUserResponse);

    await apiContext.dispose();
  });

  test('GET /api/User - should return list of users', async () => {
    const getUsersResponse = await userApi.getUsers(apiContext);
    await expectSuccessfulResponse(getUsersResponse);

    const body = await getUsersResponse.json();
    expect(Array.isArray(body), 'Response body should be an array of users').toBe(true);
    expect(body.length, 'Users array should contain at least one user').toBeGreaterThan(0);
  });

  test('GET /api/User/{id} - should return a specific user', async () => {
    const getSpecificUserResponse = await userApi.getUserById(apiContext, userId);
    await expectSuccessfulResponse(getSpecificUserResponse);

    const body = await getSpecificUserResponse.json();
    expect(body.id, 'User ID in response should match the requested userId').toBe(userId);
  });

  test('PUT /api/User/{id} - should update the user', async () => {
    const updatedApiUser: UserDTO = {
      gender: Gender.Female,
      name: faker.person.firstName('female'),
      yearOfBirth: 2002
    };

    const putApiResponse = await userApi.updateUser(apiContext, userId, updatedApiUser);
    await expectSuccessfulResponse(putApiResponse);

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
