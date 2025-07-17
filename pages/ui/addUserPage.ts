import { expect, Locator, Page } from '@playwright/test';
import { UserDTO } from '../../dto/userDTO';

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

  async selectGender(genderValue: number) {
    await expect(this.genderDropdown).toBeVisible();
    await expect(this.genderDropdown).toBeEnabled();
    await this.genderDropdown.selectOption({ value: genderValue.toString() });
  }

  async enterUsername(username: string) {
    await this.userNameInput.waitFor({ state: 'visible' });
    await expect(this.userNameInput, 'Username input should be enabled').toBeEnabled();
    await this.userNameInput.clear();
    await this.userNameInput.fill(username);
  }

  async enterYearOfBirth(yearOfBirth: number) {
    await this.yearOfBirthInput.waitFor({ state: 'visible' });
    await expect(this.yearOfBirthInput, 'YearOfBirth input should be enabled').toBeEnabled();
    await this.yearOfBirthInput.clear();
    await this.yearOfBirthInput.fill(yearOfBirth.toString());
    await expect(this.yearOfBirthInput, 'YearOfBirth input should have value').toHaveValue(
      yearOfBirth.toString()
    );
  }

  async submitAddUserForm() {
    await expect(this.createBtn).toBeVisible();
    await expect(this.createBtn).toBeEnabled();
    await this.createBtn.click();
  }

  async fillUserForm(user: UserDTO) {
    await this.selectGender(user.gender);
    await this.enterUsername(user.name);
    await this.enterYearOfBirth(user.yearOfBirth);
  }

  async getErrorText(errorLocator: Locator) {
    return await errorLocator.textContent();
  }
}
