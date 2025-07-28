import { test, expect, Locator } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { GenericSteps } from '../../../steps/genericSteps';
import { generateValidAddress } from '../../../utils/dataGenerator';
import { faker } from '@faker-js/faker';
import { AddressDTO } from '../../../dto/addressDTO';
import { AddressSteps } from '../../../steps/addressSteps';

let addAddressPage: AddAddressPage;
let addressSteps: AddressSteps;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
  addressSteps = new AddressSteps(page);
});

type FieldValidationCase = {
  fieldName: string;
  override: Partial<AddressDTO>;
  error: (page: AddAddressPage) => Locator;
};

function runFieldValidationTests(groupName: string, testCases: FieldValidationCase[]) {
  test.describe(groupName, () => {
    testCases.forEach(({ fieldName, override, error }) => {
      test(`Should show error when ${fieldName} is invalid @desktop`, async () => {
        let expectedError: string;

        const address = generateValidAddress(override);
        await addressSteps.createAddress(address);

        if (groupName.toLowerCase().includes('empty required fields')) {
          expectedError = `${fieldName} is required`;
        } else {
          expectedError = `${fieldName} is too short`;
        }

        const errorText = await GenericSteps.getErrorText(error(addAddressPage));
        expect(errorText).toBe(expectedError);
      });
    });
  });
}

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

runFieldValidationTests('Empty required fields', emptyRequiredFields);
runFieldValidationTests('Too short values', tooShortFields);
