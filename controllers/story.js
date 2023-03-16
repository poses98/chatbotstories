const Story = require('../models/Story');
const User = require('../models/User');
const Like = require('../models/Like');

async function createStory(req, res) {
  const { userId, genre, language, title, interactive, description } = req.body;

  if (
    !req.body.userId ||
    req.body.genre === undefined ||
    !req.body.title ||
    req.body.language === undefined
  ) {
    return res.status(400).send();
  }

  const story = new Story();

  story.author = userId;
  story.description = description || '';
  story.genre = genre;
  story.interactive = interactive;
  story.language = language;
  story.status = 0;
  story.title = title;

  try {
    const storedStory = await story.save();
    if (!storedStory) {
      return res.status(400).send();
    } else {
      return res.status(200).send(storedStory);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

async function getStoryById(req, res) {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).send('Story not found');
    }

    return res.status(200).send(story);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}

async function updateStory(req, res) {
  const { id } = req.params;
  const { description, genre, interactive, language, status, title } = req.body;

  const updateFields = {
    ...(description && { description }),
    ...(genre && { genre }),
    ...(interactive && { interactive }),
    ...(language && { language }),
    ...(status && { status }),
    ...(title && { title }),
  };

  try {
    const updatedStory = await Story.findOneAndUpdate(
      { _id: id },
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedStory) {
      return res.status(400).send();
    } else {
      return res.status(200).send(updatedStory);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

async function deleteStory(req, res) {
  const { id } = req.params;

  try {
    const deletedStory = await Story.findOneAndDelete({ _id: id });

    if (!deletedStory) {
      return res.status(400).send();
    } else {
      return res.status(200).send(deletedStory);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

async function getAllStories(req, res) {
  try {
    const stories = await Story.find();

    return res.status(200).send(stories);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}

async function likeStory(req, res) {
  try {
    const userId = req.body.userId;
    const storyId = req.params.storyId;

    const user = await User.findById(userId);
    const story = await Story.findById(storyId);

    if (!user || !story) {
      res.status(400).send();
    }

    // Check if the user has already liked the story
    const existingLike = await Like.findOne({
      user: user._id,
      story: story._id,
    });

    if (existingLike) {
      // Remove the like from the user's likes array and save the user
      const userLikeIndex = user.likes.findIndex(
        (like) => like._id.toString() === existingLike._id.toString()
      );
      if (userLikeIndex !== -1) {
        user.likes.splice(userLikeIndex, 1);
        await user.save();
      }

      const storyLikeIndex = story.likes.users.findIndex(
        (userId) => userId.toString() === user._id.toString()
      );
      if (storyLikeIndex !== -1) {
        story.likes.users.splice(storyLikeIndex, 1);
        story.likes.count--;
        await story.save();
      }
      // Remove the like from the Likes collection
      const deletedLike = await Like.findByIdAndDelete(existingLike._id);

      if (!deletedLike) {
        res.status(404).send({ message: 'Not like found' });
      } else {
        res.status(200).json({
          message: 'Like removed successfully',
        });
      }
    } else {
      // Create a new like object
      const like = new Like({
        user: user._id,
        story: story._id,
      });

      // Save the like to the database
      const storedLike = await like.save();

      // Add the like to the user's likes array
      user.likes.push(storedLike._id);
      await user.save();

      // Add the user ID to the story's likes array
      story.likes.users.push(userId);
      story.likes.count++;
      await story.save();

      res.status(200).json({
        message: 'Like added successfully',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

async function getStoryAndChaptersById(req, res) {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId).populate('chapters');

    if (!story) {
      return res.status(404).send('Story not found');
    }

    return res.status(200).send(story);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}

module.exports = {
  createStory,
  getStoryById,
  updateStory,
  deleteStory,
  getAllStories,
  likeStory,
  getStoryAndChaptersById,
};
