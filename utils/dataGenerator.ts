import { faker } from '@faker-js/faker';
import { AddressDTO } from '../dto/addressDTO';

export const generateValidAddress = (): AddressDTO => ({
  streetAddress: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  zipCode: faker.number.int({ min: 10000, max: 99999 })
});
