import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';

class UserApi {
  static async createUser(user) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/create-user`,
      {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getUserById(userId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/get-user/${userId}`,
      {
        method: 'GET',
      }
    );

    return response;
  }

  static async updateUser(userId, updatedUser) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/api/update-user/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response;
  }

  static async deleteUser(userId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/api/delete-user/${userId}`,
      {
        method: 'DELETE',
      }
    );

    return response;
  }
}

export default UserApi;
