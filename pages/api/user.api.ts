import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserDTO } from '../../dto/userDTO';

// ToDo: it's not a page, it should be a separate folder for API and you should have there certain structure(dto and certain names)
// Try to ask AI or google the structure
export class UserApi {
  constructor(
    private request: APIRequestContext,
    private baseURL: string
  ) {}

  // ToDO: ${this.baseURL}api/User can be move like a separate const and use in each method
  async createUser(user: UserDTO): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}api/User`, {
      data: user
    });
  }

  // ToDO: it's not neccassary in this case, but I prefer more to write awaits
  async getUsers(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}api/User`);
  }

  async getUserById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}api/User/${id}`);
  }

  async updateUser(id: number, user: UserDTO): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}api/User/${id}`, { data: user });
  }

  async deleteUser(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}api/User/${id}`);
  }
}
