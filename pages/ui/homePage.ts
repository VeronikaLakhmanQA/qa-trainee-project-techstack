import { Locator, Page } from '@playwright/test';

export default class HomePage {
  readonly userNameCells: Locator;
  readonly mainHeading: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.userNameCells = page.getByTestId('td-UserName');
    this.mainHeading = page.getByRole('heading', { name: 'Users and Addresses' });
  }
}
