import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';
class ChapterApi {
  static async createChapter(chapter) {
    console.log('Sending chapter to db');
    console.log(chapter);
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters`,
      {
        method: 'POST',
        body: JSON.stringify(chapter),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async getChapterById(chapterId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}`,
      {
        method: 'GET',
      }
    );
    return response;
  }

  static async updateChapter(chapterId, updatedChapter) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedChapter),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async deleteChapter(chapterId) {
    console.log(chapterId);
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/chapters/${chapterId}`,
      {
        method: 'DELETE',
      }
    );
    return response;
  }

  static async getChaptersForStory(storyId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/story/${storyId}/chapters`,
      {
        method: 'GET',
      }
    );
    return response;
  }
}

export default ChapterApi;
