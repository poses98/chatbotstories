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

  static async getReviews(storyId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/reviews`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async updateStory(storyId, updatedStory) {
    console.log(updatedStory);
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

  static async saveStory(storyId, userId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/save`,
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

  static async getUserStories(userId) {
    console.log(userId);
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/user/${userId}/`,
      {
        method: 'GET',
      }
    );
    return response;
  }
  static async getSavedStories(userId) {
    try {
      const savedResponse = await fetchWithAuth(
        `${BASE_PATH}/${API_VERSION}/stories/user/${userId}/saved`,
        {
          method: 'GET',
        }
      );

      return savedResponse.savedStories;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch saved stories');
    }
  }
  static async getLikedStories(userId) {
    try {
      const likedResponse = await fetchWithAuth(
        `${BASE_PATH}/${API_VERSION}/stories/user/${userId}/liked`,
        {
          method: 'GET',
        }
      );

      return likedResponse.likedStories;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch liked stories');
    }
  }
  static async getReadStories(userId) {
    try {
      const readResponse = await fetchWithAuth(
        `${BASE_PATH}/${API_VERSION}/stories/user/${userId}/read`,
        {
          method: 'GET',
        }
      );

      return readResponse.readStories;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch read stories');
    }
  }
  static async getPersonalizedFeed(userId) {
    try {
      const response = await fetchWithAuth(
        `${BASE_PATH}/${API_VERSION}/stories/feed/user/${userId}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch read stories');
    }
  }
}

export default StoryApi;
