import { faker } from '@faker-js/faker';
import { AddressDTO } from '../dto/addressDTO';

export const generateValidAddress = (data: Partial<AddressDTO> = {}): AddressDTO => ({
  streetAddress: data.streetAddress ?? faker.location.streetAddress(),
  city: data.city ?? faker.location.city(),
  state: data.state ?? faker.location.state(),
  zipCode: data.zipCode ?? faker.number.int({ min: 10000, max: 99999 }).toString()
});
