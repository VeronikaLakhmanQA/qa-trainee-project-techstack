import { expect, Page } from '@playwright/test';
import HomePage from '../pages/homePage';
import { Buttons } from '../identifiers/buttons';
import AddAddressPage from '../pages/addAddressPage';
import { GenericSteps } from '../steps/genericSteps';
import { AddressDTO } from '../dto/addressDTO';

export class AddressSteps {
  readonly homePage: HomePage;
  private readonly addAddressPage: AddAddressPage;

  constructor(public page: Page) {
    this.page = page;
    this.homePage = new HomePage(this.page);
    this.addAddressPage = new AddAddressPage(page);
  }

  async fillAddressForm(address: AddressDTO) {
    await GenericSteps.fillInput(
      this.addAddressPage.streetAddressInput,
      address.streetAddress,
      'Street Address'
    );
    await GenericSteps.fillInput(this.addAddressPage.cityInput, address.city, 'City');
    await GenericSteps.fillInput(this.addAddressPage.stateInput, address.state, 'State');
    await GenericSteps.fillInput(this.addAddressPage.zipCodeInput, address.zipCode, 'ZipCode');
  }

  async submitAddAddressForm() {
    await expect(this.page.getByTestId(Buttons.Create)).toBeVisible();
    await expect(this.page.getByTestId(Buttons.Create)).toBeEnabled();
    await this.page.getByTestId(Buttons.Create).click();
  }

  async createAddress(address: AddressDTO) {
    await this.fillAddressForm(address);
    await this.submitAddAddressForm();
  }

  async clickDeleteAddressBtnByStreet(streetAddress: string) {
    const row = this.homePage.page
      .locator('tr', {
        has: this.homePage.addressStreetCells.filter({ hasText: streetAddress })
      })
      .last();

    await expect(row, `Address with street "${streetAddress}" should exist`).toBeVisible();

    const deleteButton = row.getByTestId(Buttons.Delete);
    await expect(deleteButton, 'Delete button should be visible').toBeVisible();
    await deleteButton.click();
  }

  async deleteAddressByStreet(streetAddress: string) {
    await this.clickDeleteAddressBtnByStreet(streetAddress);

    expect(this.page.getByTestId(Buttons.ConfirmButton)).toBeVisible();
    expect(this.page.getByTestId(Buttons.ConfirmButton)).toBeEnabled();
    await this.page.getByTestId(Buttons.ConfirmButton).click();

    await expect(
      this.homePage.addressStreetCells.filter({ hasText: streetAddress }),
      `Address with street "${streetAddress}" should be deleted`
    ).toHaveCount(0);
  }
}
