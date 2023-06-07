import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';

class ReviewApi {
  static async createReview(payload) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getReview(storyId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/reviews/${storyId}`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async updateReview(storyId, updatedReview) {
    console.log(updatedReview);
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/reviews/${storyId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedStory),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }
}

export default ReviewApi;
