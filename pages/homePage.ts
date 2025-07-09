import { Locator, Page } from '@playwright/test';

export default class HomePage {
  readonly userNameCells: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.userNameCells = page.locator('[data-testid="td-UserName"]');
  }
}
