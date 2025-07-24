import { expect, Locator, Page } from '@playwright/test';
export default class DeleteAddressPage {
  readonly confirmButton: Locator;

  constructor(public page: Page) {
    this.confirmButton = page.getByTestId('button-Yes');
  }

  async confirmDeletion() {
    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();
  }
}
