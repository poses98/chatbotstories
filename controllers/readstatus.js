const ReadStatus = require('../models/ReadStatus');

// Create a new read status
const createReadStatus = async (req, res) => {
  try {
    const {
      user,
      story,
      finished,
      nextChapterId,
      lastTimeRead,
      lastChapterReadId,
    } = req.body;

    const readStatus = new ReadStatus({
      user,
      story,
      finished,
      nextChapterId,
      lastTimeRead,
      lastChapterReadId,
    });

    const savedReadStatus = await readStatus.save();
    return res.status(201).json(savedReadStatus);
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
      nextChapterId,
      lastTimeRead,
      lastChapterReadId,
    } = req.body;

    const readStatus = await ReadStatus.findById(id);
    if (!readStatus) {
      return res.status(404).send('Read status not found');
    }

    readStatus.user = user || readStatus.user;
    readStatus.story = story || readStatus.story;
    readStatus.finished = finished ?? readStatus.finished;
    readStatus.nextChapterId = nextChapterId || readStatus.nextChapterId;
    readStatus.lastTimeRead = lastTimeRead || readStatus.lastTimeRead;
    readStatus.lastChapterReadId =
      lastChapterReadId || readStatus.lastChapterReadId;

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
    const readStatus = await ReadStatus.findByIdAndDelete(id);
    if (!readStatus) {
      return res.status(404).send('Read status not found');
    }
    return res.json({ message: 'Read status deleted successfully' });
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
