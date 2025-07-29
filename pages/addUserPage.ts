import { Locator, Page } from '@playwright/test';

export default class AddUserPage {
  readonly userNameInput: Locator;
  readonly yearOfBirthInput: Locator;
  readonly genderDropdown: Locator;
  readonly inputUserNameError: Locator;
  readonly inputYearOfBirthError: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.userNameInput = page.getByTestId('input-UserName');
    this.yearOfBirthInput = page.getByTestId('input-YearOfBirth');
    this.genderDropdown = page.getByTestId('select-Gender');
    this.inputUserNameError = page.getByTestId('inputError-UserName');
    this.inputYearOfBirthError = page.getByTestId('inputError-YearOfBirth');
  }
}
