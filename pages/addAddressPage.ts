import { expect, Locator, Page } from '@playwright/test';
import { AddressDTO } from '../dto/addressDTO';

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

  async fillInput(input: Locator, value: string | number, label: string) {
    await input.waitFor({ state: 'visible' });
    await expect(input, `${label} input should be enabled`).toBeEnabled();
    await input.clear();
    await input.fill(value.toString());
  }

  async enterStreetAddress(streetAddress: string) {
    await this.fillInput(this.streetAddressInput, streetAddress, 'Street Address');
  }

  async enterCity(city: string) {
    await this.fillInput(this.cityInput, city, 'City');
  }

  async enterState(state: string) {
    await this.fillInput(this.stateInput, state, 'State');
  }

  async enterZipCode(zipCode: number) {
    await this.fillInput(this.zipCodeInput, zipCode, 'ZipCode');
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
