import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import HomePage from '../../../pages/homePage';
import { AddressDTO } from '../../../dto/addressDTO';
import { BASE_URL, ROUTES } from '../../../utils/constants';
import { generateValidAddress } from '../../../utils/dataGenerator';
import { AddressSteps } from '../../../steps/addressSteps';

let addressSteps: AddressSteps;
let createdStreetAddresses: string[] = [];

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addressSteps = new AddressSteps(page);
});

test.afterEach(async ({ page }) => {
  const addressSteps = new AddressSteps(page);
  if (!createdStreetAddresses.length) return;

  for (const street of createdStreetAddresses) {
    await addressSteps.deleteAddressByStreet(street);
  }
  createdStreetAddresses = [];
});

const positiveAddresses: { data: AddressDTO; description: string }[] = [
  {
    description: 'valid random data',
    data: generateValidAddress()
  },
  {
    description: 'minimum allowed field lengths',
    data: {
      streetAddress: faker.string.alpha({ length: 5 }),
      city: faker.string.alpha({ length: 3 }),
      state: faker.string.alpha({ length: 2 }),
      zipCode: faker.number.int({ min: 10000, max: 99999 }).toString()
    }
  },
  {
    description: 'maximum allowed field lengths',
    data: {
      streetAddress: faker.string.alpha({ length: 30 }),
      city: faker.string.alpha({ length: 15 }),
      state: faker.string.alpha({ length: 15 }),
      zipCode: faker.number.int({ min: 10000, max: 99999 }).toString()
    }
  }
];

positiveAddresses.forEach(({ data, description }) => {
  test(`should create a new address with ${description} @desktop`, async ({ page }) => {
    const homePage = new HomePage(page);

    await addressSteps.createAddress(data);
    createdStreetAddresses.push(data.streetAddress);

    await expect(
      homePage.mainHeading,
      'Expect main heading "Users and Addresses" to be visible on the home page'
    ).toBeVisible();

    await expect(page, 'Expect redirect to home page with correct URL').toHaveURL(BASE_URL!);
  });
});
