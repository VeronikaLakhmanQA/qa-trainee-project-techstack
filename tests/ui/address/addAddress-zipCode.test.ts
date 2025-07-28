import { test, expect } from '@playwright/test';
import AddAddressPage from '../../../pages/addAddressPage';
import { ROUTES } from '../../../utils/constants';
import { getErrorText } from '../../../steps/genericSteps';
import { generateValidAddress } from '../../../utils/dataGenerator';

let addAddressPage: AddAddressPage;

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.ADD_ADDRESS);
  addAddressPage = new AddAddressPage(page);
});

test.describe('Zip Code - valid formats @desktop', () => {
  const validZipCodes = ['12345', '123456789', '12345-6789'];

  validZipCodes.forEach((zip) => {
    test(`should accept valid zip code: "${zip}"`, async () => {
      await addAddressPage.fillZipCode(zip);
      await addAddressPage.submitAddAddressForm();

      const errorText = await getErrorText(addAddressPage.zipCodeError);
      expect(errorText).toBe('');
    });
  });
});

test.describe('Zip Code - invalid formats @desktop', () => {
  const invalidZipCodes = ['1234', '12345678', '1234-678', 'abcde', '12345_6789', '12-345', ''];

  invalidZipCodes.forEach((zip) => {
    test(`should show error for invalid zip code: "${zip}"`, async () => {
      const address = generateValidAddress({ zipCode: zip });

      await addAddressPage.createAddress(address);
      const errorText = await getErrorText(addAddressPage.zipCodeError);

      const expectedError = zip === '' ? 'Zip Code is required' : 'Zip Code is incorrect';

      expect(errorText).toBe(expectedError);
    });
  });
});
