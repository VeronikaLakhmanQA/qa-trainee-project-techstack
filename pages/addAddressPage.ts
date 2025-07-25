import { expect, Locator, Page } from '@playwright/test';
import { AddressDTO } from '../dto/addressDTO';
import { fillInput } from '../utils/form.utils';

export default class AddAddressPage {
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly createButton: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.streetAddressInput = page.getByTestId('input-StreetAddress');
    this.cityInput = page.getByTestId('input-City');
    this.stateInput = page.getByTestId('input-State');
    this.zipCodeInput = page.getByTestId('input-ZipCode');
    this.createButton = page.getByTestId('button-Create');
  }

  async enterStreetAddress(streetAddress: string) {
    await fillInput(this.streetAddressInput, streetAddress, 'Street Address');
  }

  async enterCity(city: string) {
    await fillInput(this.cityInput, city, 'City');
  }

  async enterState(state: string) {
    await fillInput(this.stateInput, state, 'State');
  }

  async enterZipCode(zipCode: number) {
    await fillInput(this.zipCodeInput, zipCode, 'ZipCode');
  }

  async fillAddressForm(address: AddressDTO) {
    await this.enterStreetAddress(address.streetAddress);
    await this.enterCity(address.city);
    await this.enterState(address.state);
    await this.enterZipCode(address.zipCode);
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
