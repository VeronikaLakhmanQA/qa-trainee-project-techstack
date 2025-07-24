import DeleteAddressPage from '../pages/deleteAddressPage';
import HomePage from '../pages/homePage';

export class AddressSteps {
  constructor(
    private homePage: HomePage,
    private deleteAddressPage: DeleteAddressPage
  ) {}

  async deleteAddressByStreet(streetAddress: string) {
    await this.homePage.clickDeleteAddressBtnByStreet(streetAddress);
    await this.deleteAddressPage.confirmDeletion();
  }
}
