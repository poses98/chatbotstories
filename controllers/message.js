const Chapter = require('../models/chapter');

async function createMessage(req, res) {
  try {
    const { chapterId } = req.params;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    chapter.messages.push(req.body);
    const savedChapter = await chapter.save();
    const newMessage = savedChapter.messages[savedChapter.messages.length - 1];
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

async function getMessageById(req, res) {
  try {
    const { chapterId, messageId } = req.params;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    const message = chapter.messages.id(messageId);
    if (!message) {
      return res.status(404).send('Message not found');
    }
    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

async function updateMessage(req, res) {
  try {
    const { chapterId, messageId } = req.params;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    const message = chapter.messages.id(messageId);
    if (!message) {
      return res.status(404).send('Message not found');
    }
    Object.assign(message, req.body);
    const savedChapter = await chapter.save();
    const updatedMessage = savedChapter.messages.id(messageId);
    return res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

async function deleteMessage(req, res) {
  try {
    const { chapterId, messageId } = req.params;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    const messageIndex = chapter.messages.findIndex(
      (message) => message._id.toString() === messageId
    );
    if (messageIndex !== -1) {
      chapter.messages.splice(messageIndex, 1);
      const storedChapter = await chapter.save();
      if (!storedChapter) {
        res.status(400).send();
      } else {
        res.status(201).json(storedChapter);
      }
    } else {
      return res.status(404).send('Message not found');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

module.exports = {
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessage,
};
