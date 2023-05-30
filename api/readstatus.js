import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';

class ReadStatusApi {
  static async createReadStatus(readStatus) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/read-status`,
      {
        method: 'POST',
        body: JSON.stringify(readStatus),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getReadStatusById(readStatusId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/read-status/${readStatusId}`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async updateReadStatusById(readStatusId, updatedReadStatus) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/read-status/${readStatusId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedReadStatus),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async deleteReadStatusById(readStatusId, user) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/read-status/${readStatusId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ user }),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }
}

export default ReadStatusApi;
