import { expect, Page } from '@playwright/test';
import DeleteAddressPage from '../pages/deleteAddressPage';
import HomePage from '../pages/homePage';

export class AddressSteps {
  readonly homePage: HomePage;
  readonly deleteAddressPage: DeleteAddressPage;

  constructor(public page: Page) {
    this.page = page;
    this.homePage = new HomePage(this.page);
    this.deleteAddressPage = new DeleteAddressPage(this.page);
  }

  async clickDeleteAddressBtnByStreet(streetAddress: string) {
    const row = this.homePage.page
      .locator('tr', {
        has: this.homePage.addressStreetCells.filter({ hasText: streetAddress })
      })
      .last();

    await expect(row, `Address with street "${streetAddress}" should exist`).toBeVisible();

    const deleteButton = row.getByTestId('button-Delete');
    await expect(deleteButton, 'Delete button should be visible').toBeVisible();
    await deleteButton.click();
  }

  async deleteAddressByStreet(streetAddress: string) {
    await this.clickDeleteAddressBtnByStreet(streetAddress);

    await expect(this.deleteAddressPage.confirmButton).toBeVisible();
    await expect(this.deleteAddressPage.confirmButton).toBeEnabled();
    await this.deleteAddressPage.confirmButton.click();

    await expect(
      this.homePage.addressStreetCells.filter({ hasText: streetAddress }),
      `Address with street "${streetAddress}" should be deleted`
    ).toHaveCount(0);
  }
}
