import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserDTO } from '../../dto/userDTO';
import { BASE_URL } from '../../utils/constants';

const USER_API_PATH = `${BASE_URL}api/User`;

export class UserApi {
  async createUser(request: APIRequestContext, user: UserDTO): Promise<APIResponse> {
    const response = await request.post(USER_API_PATH, {
      data: user
    });
    return response;
  }

  async getUsers(request: APIRequestContext): Promise<APIResponse> {
    const response = await request.get(USER_API_PATH);
    return response;
  }

  async getUserById(request: APIRequestContext, id: number): Promise<APIResponse> {
    const response = await request.get(`${USER_API_PATH}/${id}`);
    return response;
  }

  async updateUser(request: APIRequestContext, id: number, user: UserDTO): Promise<APIResponse> {
    const response = await request.put(`${USER_API_PATH}/${id}`, { data: user });
    return response;
  }

  async deleteUser(request: APIRequestContext, id: number): Promise<APIResponse> {
    const response = await request.delete(`${USER_API_PATH}/${id}`);
    return response;
  }
}
