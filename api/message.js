import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';

class MessageApi {
  static async createMessageForChapter(chapterId, message) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getMessageById(chapterId, messageId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}/messages/${messageId}`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async updateMessage(chapterId, messageId, updatedMessage) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}/messages/${messageId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedMessage),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async deleteMessage(chapterId, messageId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}/messages/${messageId}`,
      {
        method: 'DELETE',
      }
    );
    return response;
  }
}

export default MessageApi;
