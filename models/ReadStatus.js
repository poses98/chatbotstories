const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readStatusSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  },
  finished: Boolean,
  nextChapter: mongoose.Schema.Types.ObjectId,
  lastTimeRead: Date,
  previousChapter: mongoose.Schema.Types.ObjectId,
});

readStatusSchema.virtual('userObj', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
});

readStatusSchema.virtual('storyObj', {
  ref: 'Story',
  localField: 'story',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('ReadStatus', readStatusSchema);
