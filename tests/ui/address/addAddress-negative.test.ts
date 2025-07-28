import { test, expect } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { GenericSteps } from '../../../steps/genericSteps';
import { generateValidAddress } from '../../../utils/dataGenerator';
import { faker } from '@faker-js/faker';
import { AddressSteps } from '../../../steps/addressSteps';

let addAddressPage: AddAddressPage;
let addressSteps: AddressSteps;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
  addressSteps = new AddressSteps(page);
});

const emptyRequiredFields = [
  {
    fieldName: 'Street Address',
    override: { streetAddress: '' },
    error: (page: AddAddressPage) => page.streetAddressError
  },
  {
    fieldName: 'City',
    override: { city: '' },
    error: (page: AddAddressPage) => page.cityError
  },
  {
    fieldName: 'State',
    override: { state: '' },
    error: (page: AddAddressPage) => page.stateError
  }
];

emptyRequiredFields.forEach(({ fieldName, override, error }) => {
  test(`should show error when ${fieldName} is empty @desktop`, async () => {
    const address = { ...generateValidAddress(), ...override };
    await addressSteps.createAddress(address);

    const errorText = await GenericSteps.getErrorText(error(addAddressPage));
    const expectedError = `${fieldName} is required`;
    expect(errorText).toEqual(expectedError);
  });
});

const tooShortFields = [
  {
    fieldName: 'Street Address',
    override: { streetAddress: faker.string.alpha({ length: 4 }) },
    error: (page: AddAddressPage) => page.streetAddressError
  },
  {
    fieldName: 'City',
    override: { city: faker.string.alpha({ length: 2 }) },
    error: (page: AddAddressPage) => page.cityError
  },
  {
    fieldName: 'State',
    override: { state: faker.string.alpha({ length: 1 }) },
    error: (page: AddAddressPage) => page.stateError
  }
];

tooShortFields.forEach(({ fieldName, override, error }) => {
  test(`should show error when ${fieldName} is too short @desktop`, async () => {
    const address = { ...generateValidAddress(), ...override };
    await addressSteps.createAddress(address);

    const errorText = await GenericSteps.getErrorText(error(addAddressPage));
    const expectedError = `${fieldName} is too short`;
    expect(errorText).toEqual(expectedError);
  });
});
