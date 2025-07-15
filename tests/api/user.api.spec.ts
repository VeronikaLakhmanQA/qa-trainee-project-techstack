import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UserDTO } from '../../dto/userDto';

test.describe('User API - CRUD', () => {
  let userId: number;

  test.beforeEach(async ({ request, baseURL }) => {
    const newApiUser: UserDTO = {
      gender: 1,
      name: faker.person.firstName('male'),
      yearOfBirth: '1993'
    };

    const postApiResponse = await request.post(`${baseURL}api/User`, {
      data: newApiUser
    });

    expect(postApiResponse.status(), 'Status code should be 200 when creating new user').toBe(200);
    const body = await postApiResponse.json();

    userId = body.id;
  });

  test.afterEach(async ({ request, baseURL }) => {
    const deleteUserResponse = await request.delete(`${baseURL}api/User/${userId}`);
    expect(
      deleteUserResponse.ok(),
      'Expected status code should be 200 after deleting the user'
    ).toBeTruthy();
  });

  test('Get /api/User - should return list of users', async ({ request, baseURL }) => {
    const getUsersResponse = await request.get(`${baseURL}api/User`);

    expect(getUsersResponse.ok, 'Expected successful response').toBeTruthy();
    expect(getUsersResponse.status(), 'Status code should be 200').toBe(200);

    const body = await getUsersResponse.json();
    expect(Array.isArray(body), 'Response body should be an array of users').toBe(true);
    expect(body.length, 'Users array should contain at least one user').toBeGreaterThan(0);
  });

  test('GET /api/User/{id} - should return a specific user', async ({ request, baseURL }) => {
    const getSpecificUserResponse = await request.get(`${baseURL}api/User/${userId}`);

    expect(getSpecificUserResponse.ok, 'Expected successful response').toBeTruthy();
    expect(getSpecificUserResponse.status(), 'Status code should be 200').toBe(200);

    const body = await getSpecificUserResponse.json();
    expect(body.id, 'User ID in response should match the requested userId').toBe(userId);
  });

  test('PUT /api/User/{id} - should update the user', async ({ request, baseURL }) => {
    const updatedApiUser: UserDTO = {
      gender: 2,
      name: faker.person.firstName('female'),
      yearOfBirth: '2002'
    };

    const putApiResponse = await request.put(`${baseURL}api/User/${userId}`, {
      data: updatedApiUser
    });

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
