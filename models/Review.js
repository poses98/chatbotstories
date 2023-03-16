const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  haveUserLikedStory: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
