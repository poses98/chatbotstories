const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Like schema
const likeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  },
});

likeSchema.virtual('userObj', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
});

likeSchema.virtual('storyObj', {
  ref: 'Story',
  localField: 'story',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Like', likeSchema);
