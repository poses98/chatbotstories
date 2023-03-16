const ReadStatus = require('../models/ReadStatus');
const User = require('../models/User');

// Create a new read status
const createReadStatus = async (req, res) => {
  try {
    const { user, story, finished, nextChapter, previousChapter } = req.body;

    const readStatus = new ReadStatus({
      user,
      story,
      finished,
      nextChapter,
      previousChapter,
    });

    readStatus.lastTimeRead = new Date().toUTCString();

    const savedReadStatus = await readStatus.save();
    if (savedReadStatus) {
      const userRef = await User.findById(user);
      if (userRef) {
        userRef.readStatuses.push(savedReadStatus._id);
        const storedUser = await userRef.save();
        if (storedUser) return res.status(201).json(savedReadStatus);
        else return res.status(400).send();
      } else {
        return res.status(400).send();
      }
    } else {
      return res.status(400).send();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

// Get a list of all read statuses
const getAllReadStatuses = async (req, res) => {
  try {
    const readStatuses = await ReadStatus.find().populate('userObj storyObj');
    return res.json(readStatuses);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

// Get a single read status by ID
const getReadStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const readStatus = await ReadStatus.findById(id).populate(
      'userObj storyObj'
    );
    if (!readStatus) {
      return res.status(404).send('Read status not found');
    }
    return res.json(readStatus);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

// Update a read status by ID
const updateReadStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user,
      story,
      finished,
      nextChapter,
      lastTimeRead,
      previousChapter,
    } = req.body;

    const readStatus = await ReadStatus.findById(id);
    if (!readStatus) {
      return res.status(404).send('Read status not found');
    }

    readStatus.user = user || readStatus.user;
    readStatus.story = story || readStatus.story;
    readStatus.finished = finished ?? readStatus.finished;
    readStatus.nextChapter = nextChapter || readStatus.nextChapter;
    readStatus.lastTimeRead = new Date().toUTCString();
    readStatus.previousChapter = previousChapter || readStatus.previousChapter;

    const savedReadStatus = await readStatus.save();

    return res.json(savedReadStatus);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

// Delete a read status by ID
const deleteReadStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const readStatus = await ReadStatus.findByIdAndDelete(id);
    if (!readStatus) {
      return res.status(404).send('Read status not found');
    }

    if (readStatus) {
      const userRef = await User.findById(user);
      const readStatusIndex = userRef.readStatuses.findIndex(
        (reviewRef) => reviewRef.toString() === id
      );
      if (readStatusIndex !== -1) {
        userRef.readStatuses.splice(readStatusIndex, 1);
        const storedUser = userRef.save();
        if (storedUser) {
          return res
            .status(201)
            .json({ message: 'Read status deleted successfully' });
        } else {
          res.status(400).send();
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

module.exports = {
  createReadStatus,
  getAllReadStatuses,
  getReadStatusById,
  updateReadStatusById,
  deleteReadStatusById,
};
