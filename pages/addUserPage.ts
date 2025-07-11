import { expect, Locator, Page } from '@playwright/test';

export default class AddUserPage {
  readonly userNameInput: Locator;
  readonly yearOfBirthInput: Locator;
  readonly createBtn: Locator;

  readonly genderDropdown: Locator;
  readonly inputUserNameError: Locator;
  readonly inputYearOfBirthError: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.userNameInput = page.getByTestId('input-UserName');
    this.yearOfBirthInput = page.getByTestId('input-YearOfBirth');
    this.createBtn = page.getByTestId('button-Create');
    this.genderDropdown = page.getByTestId('select-Gender');
    this.inputUserNameError = page.getByTestId('inputError-UserName');
    this.inputYearOfBirthError = page.getByTestId('inputError-YearOfBirth');
  }

  async selectGender(gender: string) {
    await expect(this.genderDropdown).toBeVisible();
    await expect(this.genderDropdown).toBeEnabled();
    await this.genderDropdown.selectOption(gender);
  }

  async enterUsername(username: string) {
    await this.userNameInput.waitFor({ state: 'visible' });
    await expect(this.userNameInput, 'Username input should be enabled').toBeEnabled();
    await this.userNameInput.clear();
    await this.userNameInput.fill(username);
  }

  async enterYearOfBirth(yearOfBirth: string) {
    await this.yearOfBirthInput.waitFor({ state: 'visible' });
    await expect(this.yearOfBirthInput, 'YearOfBirth input should be enabled').toBeEnabled();
    await this.yearOfBirthInput.clear();
    await this.yearOfBirthInput.fill(yearOfBirth);
    await expect(this.yearOfBirthInput, 'YearOfBirth input should have value').toHaveValue(
      yearOfBirth
    );
  }

  async submitAddUserForm() {
    await expect(this.createBtn).toBeVisible();
    await expect(this.createBtn).toBeEnabled();
    await this.createBtn.click();
  }

  async getErrorText(errorLocator: Locator) {
    return await errorLocator.textContent();
  }
}
