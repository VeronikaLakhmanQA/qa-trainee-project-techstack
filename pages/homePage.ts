import { expect, Locator, Page } from '@playwright/test';

export default class HomePage {
  readonly userNameCells: Locator;
  readonly mainHeading: Locator;
  readonly addressStreetCells: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.userNameCells = page.getByTestId('td-UserName');
    this.mainHeading = page.getByRole('heading', { name: 'Users and Addresses' });
    this.addressStreetCells = page.getByTestId('td-StreetAddress');
  }

  async clickDeleteAddressBtnByStreet(streetAddress: string) {
    const row = this.page
      .locator('tr', {
        has: this.page.getByTestId('td-StreetAddress').filter({ hasText: streetAddress })
      })
      .last();

    await expect(row, `Address with street "${streetAddress}" should exist`).toBeVisible();

    const deleteButton = row.getByTestId('button-Delete');
    await expect(deleteButton, 'Delete button should be visible').toBeVisible();
    await deleteButton.click();

    await expect(
      this.addressStreetCells.filter({ hasText: streetAddress }),
      `Address with street "${streetAddress}" should be deleted`
    ).toHaveCount(0);
  }
}
