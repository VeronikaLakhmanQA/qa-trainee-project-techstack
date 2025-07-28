import { expect, Page } from '@playwright/test';
import HomePage from '../pages/homePage';
import { Buttons } from '../identifiers/buttons';
import AddUserPage from '../pages/addUserPage';
import { GenericSteps } from '../steps/genericSteps';
import { Gender } from '../enums/gender.enum';
import { UserDTO } from '../dto/userDTO';

export class UserSteps {
  readonly homePage: HomePage;
  readonly addUserPage: AddUserPage;

  constructor(public page: Page) {
    this.page = page;
    this.addUserPage = new AddUserPage(page);
  }

  async selectGender(genderValue: Gender) {
    await expect(this.addUserPage.genderDropdown).toBeVisible();
    await expect(this.addUserPage.genderDropdown).toBeEnabled();

    await this.addUserPage.genderDropdown.selectOption({ value: genderValue.toString() });
  }

  async fillUserForm(user: UserDTO) {
    await this.selectGender(user.gender);
    await GenericSteps.fillInput(this.addUserPage.userNameInput, user.name, 'Username');
    await GenericSteps.fillInput(
      this.addUserPage.yearOfBirthInput,
      user.yearOfBirth,
      'YearOfBirth'
    );
  }

  async submitAddUserForm() {
    await expect(this.page.getByTestId(Buttons.Create)).toBeVisible();
    await expect(this.page.getByTestId(Buttons.Create)).toBeEnabled();

    await this.page.getByTestId(Buttons.Create).click();
  }

  async createUser(user: UserDTO) {
    await this.fillUserForm(user);
    await this.submitAddUserForm();
  }
}
