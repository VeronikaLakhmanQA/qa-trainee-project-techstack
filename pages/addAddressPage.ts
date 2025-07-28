import { expect, Locator, Page } from '@playwright/test';
import { AddressDTO } from '../dto/addressDTO';
import { fillInput } from '../steps/genericSteps';
import { Buttons } from '../identifiers/buttons';

export default class AddAddressPage {
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly createButton: Locator;

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
    this.createButton = page.getByTestId(Buttons.Create);

    this.streetAddressError = page.getByTestId('inputError-StreetAddress');
    this.cityError = page.getByTestId('inputError-City');
    this.stateError = page.getByTestId('inputError-State');
    this.zipCodeError = page.getByTestId('inputError-ZipCode');
  }

  async fillAddressForm(address: AddressDTO) {
    await fillInput(this.streetAddressInput, address.streetAddress, 'Street Address');
    await fillInput(this.cityInput, address.city, 'City');
    await fillInput(this.stateInput, address.state, 'State');
    await fillInput(this.zipCodeInput, address.zipCode, 'ZipCode');
  }

  async submitAddAddressForm() {
    await expect(this.createButton).toBeVisible();
    await expect(this.createButton).toBeEnabled();
    await this.createButton.click();
  }

  async createAddress(address: AddressDTO) {
    await this.fillAddressForm(address);
    await this.submitAddAddressForm();
  }
}
