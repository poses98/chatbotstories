const express = require('express');
const StoryController = require('../controllers/story');
const api = express.Router();

api.post('/stories', StoryController.createStory);
api.get('/stories', StoryController.getAllStories);
api.get('/stories/:id', StoryController.getStoryById);
api.put('/stories/:id', StoryController.updateStory);
api.delete('/stories/:id', StoryController.deleteStory);
api.post('/stories/:storyId/like', StoryController.likeStory);
api.get('/stories/:id/with-chapters', StoryController.getStoryAndChaptersById);

module.exports = api;
