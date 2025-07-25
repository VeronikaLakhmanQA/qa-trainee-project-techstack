import { expect, Locator, Page } from '@playwright/test';
import { UserDTO } from '../dto/userDTO';
import { Gender } from '../enums/gender.enum';
import { fillInput } from '../steps/genericSteps';

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

  async selectGender(genderValue: Gender) {
    await expect(this.genderDropdown).toBeVisible();
    await expect(this.genderDropdown).toBeEnabled();

    await this.genderDropdown.selectOption({ value: genderValue.toString() });
  }

  async enterUsername(name: string) {
    await fillInput(this.userNameInput, name, 'Username');
  }

  async enterYearOfBirth(yearOfBirth: number) {
    await fillInput(this.yearOfBirthInput, yearOfBirth, 'YearOfBirth');
  }

  async fillUserForm(user: UserDTO) {
    await this.selectGender(user.gender);
    await fillInput(this.userNameInput, user.name, 'Username');
    await fillInput(this.yearOfBirthInput, user.yearOfBirth, 'YearOfBirth');
  }

  async submitAddUserForm() {
    await expect(this.createBtn).toBeVisible();
    await expect(this.createBtn).toBeEnabled();

    await this.createBtn.click();
  }

  async createUser(user: UserDTO) {
    await this.fillUserForm(user);
    await this.submitAddUserForm();
  }
}
