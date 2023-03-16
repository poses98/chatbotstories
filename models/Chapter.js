const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alternativePathSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
});

const messageSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  index: { type: Number },
});

if (!mongoose.models.Chapter) {
  const chapterSchema = new Schema({
    title: { type: String },
    description: { type: String },
    index: { type: Number },
    lastUpdate: { type: Date },
    alternativePaths: [alternativePathSchema],
    lastUpdated: { type: Date },
    status: { type: Number },
    story: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
    },
    messages: [messageSchema],
  });

  module.exports = mongoose.model('Chapter', chapterSchema);
}
