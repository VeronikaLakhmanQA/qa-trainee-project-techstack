import { test, expect } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { getErrorText } from '../../../utils/form.utils';
import { generateValidAddress } from '../../../utils/dataGenerators';
import { faker } from '@faker-js/faker';

let addAddressPage: AddAddressPage;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
});

const tooShortFields = [
  {
    name: 'Street Address',
    override: { streetAddress: faker.string.alpha({ length: 4 }) },
    error: (page: AddAddressPage) => page.streetAddressError,
    expectedError: 'Street Address is too short'
  },
  {
    name: 'City',
    override: { city: faker.string.alpha({ length: 2 }) },
    error: (page: AddAddressPage) => page.cityError,
    expectedError: 'City is too short'
  },
  {
    name: 'State',
    override: { state: faker.string.alpha({ length: 1 }) },
    error: (page: AddAddressPage) => page.stateError,
    expectedError: 'State is too short'
  },
  {
    name: 'Zip Code',
    override: { zipCode: faker.number.int({ min: 1000, max: 9999 }) },
    error: (page: AddAddressPage) => page.zipCodeError,
    expectedError: 'Zip Code is incorrect'
  }
];

tooShortFields.forEach(({ name, override, error, expectedError }) => {
  test(`Should show error when ${name} is too short @desktop`, async () => {
    const address = { ...generateValidAddress(), ...override };
    await addAddressPage.createAddress(address);

    const errorText = await getErrorText(error(addAddressPage));
    expect(errorText).toBe(expectedError);
  });
});
