import { fetchWithAuth } from '../services/fetchWithAuth';
import { BASE_PATH, API_VERSION } from './apiconfig';

class CharacterApi {
  static async createCharacterForStory(storyId, character) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/character`,
      {
        method: 'POST',
        body: JSON.stringify(character),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async updateCharacterForStory(storyId, characterId, updatedCharacter) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/character/${characterId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedCharacter),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  static async deleteCharacterForStory(storyId, characterId) {
    const response = await fetchWithAuth(
      `${BASE_PATH}/${API_VERSION}/stories/${storyId}/character/${characterId}`,
      {
        method: 'DELETE',
      }
    );
    return response;
  }
}

export default CharacterApi;
