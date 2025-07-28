import { test, expect } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { GenericSteps } from '../../../steps/genericSteps';
import { generateValidAddress } from '../../../utils/dataGenerator';
import { AddressSteps } from '../../../steps/addressSteps';

let addAddressPage: AddAddressPage;
let addressSteps: AddressSteps;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
  addressSteps = new AddressSteps(page);
});

const validZipCodes = ['12345', '123456789', '12345-6789'];

validZipCodes.forEach((zip) => {
  test(`should accept valid zip code: "${zip}" @desktop`, async () => {
    await GenericSteps.fillInput(addAddressPage.zipCodeInput, zip, 'ZipCode');
    await addressSteps.submitAddAddressForm();

    const errorText = await GenericSteps.getErrorText(addAddressPage.zipCodeError);
    expect(errorText).toBe('');
  });
});

const invalidZipCodes = ['1234', '12345678', '1234-678', 'abcde', '12345_6789', '12-345', ' '];

invalidZipCodes.forEach((zip) => {
  test(`should show error for invalid zip code: "${zip}" @desktop`, async () => {
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
