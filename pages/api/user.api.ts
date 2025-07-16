import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserDTO } from '../../dto/userDTO';

export class UserApi {
  constructor(
    private request: APIRequestContext,
    private baseURL: string
  ) {}

  async createUser(user: UserDTO): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}api/User`, {
      data: user
    });
  }
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
