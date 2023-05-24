import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';

class StoryApi {
  static async createStory(story) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories`,
      {
        method: 'POST',
        body: JSON.stringify(story),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getStoryById(storyId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async updateStory(storyId, updatedStory) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedStory),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async deleteStory(storyId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}`,
      {
        method: 'DELETE',
      }
    );
    return response;
  }

  static async getAllStories() {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async likeStory(storyId, userId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/like`,
      {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getStoryAndChaptersById(storyId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/chapters`,
      {
        method: 'GET',
      }
    );
    return response;
  }
}

export default StoryApi;
