const express = require('express');
const CharacterController = require('../controllers/character');
const router = express.Router();

router.post(
  '/stories/:storyId/character',
  CharacterController.createCharacterForStory
);
router.put(
  '/stories/:storyId/character/:characterId',
  CharacterController.updateCharacterForStory
);
router.delete(
  '/stories/:storyId/character/:characterId',
  CharacterController.deleteCharacterForStory
);

module.exports = router;
