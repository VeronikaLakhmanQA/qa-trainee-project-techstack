import { expect, Locator, Page } from '@playwright/test';

export default class AddUserPage {
  readonly genderDropdown: Locator;
  readonly userNameInput: Locator;
  readonly yearOfBirthInput: Locator;
  readonly createBtn: Locator;
  readonly inputUserNameError: Locator;
  readonly inputYearOfBirthError: Locator;

  constructor(public page: Page) {
    this.page = page;
    this.genderDropdown = page.locator('#selectGender');
    this.userNameInput = page.getByPlaceholder('User Name');
    this.yearOfBirthInput = page.getByPlaceholder('Year of Birth');
    this.createBtn = page.getByRole('button', { name: 'Create' });
    this.inputUserNameError = page.locator('span#inputUserName-error');
    this.inputYearOfBirthError = page.locator('span#inputYearOfBirth-error');
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
    await expect(this.userNameInput, 'Username input should have value').toHaveValue(username);
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
