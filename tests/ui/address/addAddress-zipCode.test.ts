import { test, expect } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { GenericSteps } from '../../../steps/genericSteps';
import { generateValidAddress } from '../../../utils/dataGenerator';
import { AddressSteps } from '../../../steps/addressSteps';
import { faker } from '@faker-js/faker';

let addAddressPage: AddAddressPage;
let addressSteps: AddressSteps;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
  addressSteps = new AddressSteps(page);
});

const validZipCodes = [
  { zip: faker.string.numeric(5), description: '5 digit format' },
  { zip: faker.string.numeric(9), description: '9 digit format' },
  { zip: `${faker.string.numeric(5)}-${faker.string.numeric(4)}`, description: 'ZIP + 4 format' }
];

validZipCodes.forEach(({ zip, description }) => {
  test(`should accept valid zip code (${description}) @desktop`, async () => {
    await GenericSteps.fillInput(addAddressPage.zipCodeInput, zip, 'ZipCode');
    await addressSteps.submitAddAddressForm();

    const errorText = await GenericSteps.getErrorText(addAddressPage.zipCodeError);
    expect(errorText).toBe('');
  });
});

const invalidZipCodes = [
  { zip: '1234', description: 'too short: 4 digits' },
  { zip: '12345678', description: '8 digits instead of 9' },
  { zip: '1234-678', description: 'incorrect ZIP+4' },
  { zip: 'abcde', description: 'non - number input' },
  { zip: '12345_6789', description: 'invalid separator' },
  { zip: ' ', description: 'empty space' }
];

invalidZipCodes.forEach(({ zip, description }) => {
  test(`should show error for invalid zip code (${description}) @desktop`, async () => {
    const address = generateValidAddress({ zipCode: zip });

    await addressSteps.createAddress(address);
    const errorText = await GenericSteps.getErrorText(addAddressPage.zipCodeError);

    const expectedError = 'Zip Code is incorrect';

    expect(errorText).toBe(expectedError);
  });
});

test('should show error when zip code is empty @desktop', async () => {
  const address = generateValidAddress({ zipCode: '' });

  await addressSteps.createAddress(address);

  const errorText = await GenericSteps.getErrorText(addAddressPage.zipCodeError);
  expect(errorText).toBe('Zip Code is required');
});

test.skip('skipped test @desktop', async () => {});

test('failed test @desktop', async () => {
  const address = generateValidAddress({ zipCode: '' });

  await addressSteps.createAddress(address);

  const errorText = await GenericSteps.getErrorText(addAddressPage.zipCodeError);
  expect(errorText).toBe('Zip Code is incorrect');
});
