const Story = require('../models/Story');

// Create a new character for a story
exports.createCharacterForStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { color, isMain, name } = req.body;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).send('Story not found');
    }

    const newCharacter = {
      color,
      isMain,
      name,
    };

    story.characters.push(newCharacter);
    const storedStory = await story.save();
    if (storedStory) return res.status(201).json(storedStory);
    else return res.status(500).send('Error while saving character');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

// Update an existing character for a story
exports.updateCharacterForStory = async (req, res) => {
  try {
    const { storyId, characterId } = req.params;
    const { color, isMain, name } = req.body;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).send('Story not found');
    }

    const character = story.characters.id(characterId);

    if (!character) {
      return res.status(404).send('Character not found');
    }

    character.color = color;
    character.isMain = isMain;
    character.name = name;

    await story.save();

    return res.status(200).json(character);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

// Delete an existing character for a story
exports.deleteCharacterForStory = async (req, res) => {
  try {
    const { storyId, characterId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).send('Story not found');
    }

    const characterIndex = story.characters.findIndex(
      (character) => character._id.toString() === characterId
    );

    if (characterIndex !== -1) {
      story.characters.splice(characterIndex, 1);
      await story.save();
      return res.status(200).send('Character deleted successfully');
    } else {
      return res.status(404).send('Character not found');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};
