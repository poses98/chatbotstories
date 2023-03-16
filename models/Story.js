const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  isMain: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
  },
});

const StorySchema = new mongoose.Schema({
  author: mongoose.Schema.Types.ObjectId,
  description: String,
  genre: Number,
  interactive: Boolean,
  language: Number,
  status: Number,
  title: String,
  createdAt: Date,
  updatedAt: Date,
  characters: [characterSchema],
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  ],
  likes: {
    count: {
      type: Number,
      default: 0,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
});

module.exports = mongoose.model('Story', StorySchema);
