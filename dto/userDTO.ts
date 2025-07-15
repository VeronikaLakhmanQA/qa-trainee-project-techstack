import { Gender } from '../enums/gender.enum';

export interface UserDTO {
  gender: Gender;
  name: string;
  yearOfBirth: string;
}
