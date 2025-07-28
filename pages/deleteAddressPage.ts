import { Locator, Page } from '@playwright/test';
export default class DeleteAddressPage {
  readonly confirmButton: Locator;

  constructor(public page: Page) {
    this.confirmButton = page.getByTestId('button-Yes');
  }
}
