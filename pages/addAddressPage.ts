import { Locator, Page } from '@playwright/test';

export default class AddAddressPage {
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;

  readonly streetAddressError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly zipCodeError: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.streetAddressInput = page.getByTestId('input-StreetAddress');
    this.cityInput = page.getByTestId('input-City');
    this.stateInput = page.getByTestId('input-State');
    this.zipCodeInput = page.getByTestId('input-ZipCode');

    this.streetAddressError = page.getByTestId('inputError-StreetAddress');
    this.cityError = page.getByTestId('inputError-City');
    this.stateError = page.getByTestId('inputError-State');
    this.zipCodeError = page.getByTestId('inputError-ZipCode');
  }
}
