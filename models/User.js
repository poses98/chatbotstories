const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creamos el modelo del usuario
const UserSchema = Schema({
  name: String,
  username: String,
  accountStatus: Number,
  active: Boolean,
  description: String,
  lastLogin: Date,
  lastUpdate: Date,
  profilePicture: String,
  readStatuses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReadStatus',
    },
  ],
  likes: [
    {
      story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
//y lo exportamos
module.exports = mongoose.model('User', UserSchema);
