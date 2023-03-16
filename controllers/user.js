const User = require('../models/User');

async function createUser(req, res) {
  const { name, username } = req.body;

  if (!name || !username) {
    res.status(400).send();
  }

  const user = new User({
    name: name,
    username: username,
    accountStatus: 1,
    active: true,
    description: '',
    lastLogin: new Date().toUTCString(),
    lastUpdate: new Date().toUTCString(),
    profilePicture: '',
  });

  try {
    const storedUser = await user.save();
    if (!storedUser) {
      res.status(400).send();
    } else {
      res.status(200).send(storedUser);
    }
  } catch (err) {
    res.status(500).send();
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { name, username, description, profilePicture } = req.body;

  const updateFields = {
    ...(name && { name }),
    ...(username && { username }),
    ...(description && { description }),
    ...(profilePicture && { profilePicture }),
  };

  updateFields.lastUpdate = new Date().toUTCString();

  try {
    const updatedUser = await User.findOneAndUpdate({ _id: id }, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      res.status(400).send();
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    res.status(500).send();
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      res.status(400).send();
    } else {
      res.status(200).send(deletedUser);
    }
  } catch (err) {
    res.status(500).send();
  }
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
