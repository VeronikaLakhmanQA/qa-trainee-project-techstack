import { test, expect } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { getErrorText } from '../../../steps/genericSteps';
import { generateValidAddress } from '../../../utils/dataGenerators';

let addAddressPage: AddAddressPage;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
});

const requiredFields = [
  {
    name: 'Street Address',
    override: { streetAddress: '' },
    error: (page: AddAddressPage) => page.streetAddressError,
    expectedError: 'Street Address is required'
  },
  {
    name: 'City',
    override: { city: '' },
    error: (page: AddAddressPage) => page.cityError,
    expectedError: 'City is required'
  },
  {
    name: 'State',
    override: { state: '' },
    error: (page: AddAddressPage) => page.stateError,
    expectedError: 'State is required'
  },
  {
    name: 'Zip Code',
    override: { zipCode: '' },
    error: (page: AddAddressPage) => page.zipCodeError,
    expectedError: 'Zip Code is required'
  }
];

requiredFields.forEach(({ name, override, error, expectedError }) => {
  test(`Should show error when ${name} is empty @desktop`, async () => {
    const address = { ...generateValidAddress(), ...override };
    await addAddressPage.createAddress(address);

    const errorText = await getErrorText(error(addAddressPage));
    expect(errorText).toEqual(expectedError);
  });
});
