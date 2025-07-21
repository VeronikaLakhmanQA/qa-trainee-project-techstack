import { APIResponse, expect } from '@playwright/test';

export async function expectSuccessfulResponse(response: APIResponse, expectedStatus = 200) {
  expect(response.ok, 'Expected successful response').toBeTruthy();
  expect(response.status(), `Status code should be ${expectedStatus}`).toBe(expectedStatus);
}
