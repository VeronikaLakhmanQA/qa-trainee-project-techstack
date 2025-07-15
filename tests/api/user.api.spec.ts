import { test, expect, request } from '@playwright/test';
import { base, faker } from '@faker-js/faker';
import { UserDTO } from '../../dto/userDto';

export const testApiUsers: Record<string, UserDTO> = {
  newApiUser: {
    gender: 1,
    name: faker.person.firstName('male'),
    yearOfBirth: '1990'
  },
  updatedApiUser: {
    gender: 2,
    name: faker.person.firstName('female'),
    yearOfBirth: '2001'
  }
};

test.describe('User API - CRUD', () => {
  let userId: number;


  test('POST /api/User should create a new user and return 200', async ({ request, baseURL }) => {
    const postApiResponse = await request.post(`${baseURL}api/User`, {
      data: testApiUsers.newApiUser
    });

    expect(postApiResponse.status(), 'Status code should be 200 when creating new user').toBe(200);

    const body = await postApiResponse.json();
    expect(body.name, 'Created user should have the expected name').toBe(
      testApiUsers.newApiUser.name
    );
    expect(body.yearOfBirth, 'Created user should have the expected year of birth').toBe(
      Number(testApiUsers.newApiUser.yearOfBirth)
    );
    expect(body.gender, 'Created user should have the expected gender').toBe(
      testApiUsers.newApiUser.gender
    );
    userId = body.id;
  });

  test('Get /api/User - should return list of users', async ({ request, baseURL }) => {
    const getUsersResponse = await request.get(`${baseURL}api/User`);

    expect(getUsersResponse.ok, 'Expected successful response').toBeTruthy();
    expect(getUsersResponse.status(), 'Status code should be 200').toBe(200);

    const body = await getUsersResponse.json();
    expect(Array.isArray(body), 'Expected response body to be an array of users').toBe(true);
    expect(body.length, 'Expected users array to contain at least one user').toBeGreaterThan(0);
  });

  test('GET /api/User/:id - should return a specific user', async ({ request, baseURL }) => {
    const getSpecificUserResponse = await request.get(`${baseURL}api/User/${userId}`);

    expect(getSpecificUserResponse.ok, 'Expected successful response').toBeTruthy();
    expect(getSpecificUserResponse.status(), 'Status code should be 200').toBe(200);

    const body = await getSpecificUserResponse.json();
    expect(body.id, 'Expected user ID in response to match the requested userId').toBe(userId);
  });

  test('PUT /api/User/:id - should update the user', async ({ request, baseURL }) => {
    const putApiResponse = await request.put(`${baseURL}api/User/${userId}`, {
      data: testApiUsers.updatedApiUser
    });

    expect(putApiResponse.status(), 'Expected status code 200 after updating the user').toBe(200);

    const body = await putApiResponse.json();
    expect(body.name).toBe(testApiUsers.updatedApiUser.name);
  });

  test('DELETE /api/User/:id - should delete the user', async ({ request, baseURL }) => {
    const deleteUserResponse = await request.delete(`${baseURL}api/User/${userId}`);
    expect(deleteUserResponse.status(), 'Expected status code 200 after deleting the user').toBe(
      200
    );
  });

  test('GET /api/User/:id - should return 404 after deletion', async ({ request, baseURL }) => {
    const getDeletedUserResponse = await request.get(`${baseURL}api/User/${userId}`);
    expect(getDeletedUserResponse.status(), "Expected status code 404 for deleted user").toBe(404);
  });
});
