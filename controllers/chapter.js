const Chapter = require('../models/chapter');
const Story = require('../models/Story');

async function createChapter(req, res) {
  try {
    const story = await Story.findById(req.body.story);
    const chapter = new Chapter(req.body);
    chapter.lastUpdate = new Date().toUTCString();
    chapter.status = 0;
    const savedChapter = await chapter.save();

    if (savedChapter) {
      story.chapters.push(savedChapter._id);
      await story.save();
      res.status(201).json(savedChapter);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

async function getAllChapters(req, res) {
  try {
    const chapters = await Chapter.find();
    res.status(200).json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

async function getChapterById(req, res) {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    res.status(200).json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

async function updateChapter(req, res) {
  try {
    const updates = { ...req.body, lastUpdate: new Date().toUTCString() };
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    res.status(200).json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

async function deleteChapter(req, res) {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) {
      return res.status(404).send('Chapter not found');
    }
    // Remove the chapter from the story's chapters array and save the story
    const story = await Story.findById(chapter.story);
    const chapterIndex = story.chapters.indexOf(chapter._id);
    if (chapterIndex !== -1) {
      story.chapters.splice(chapterIndex, 1);
      await story.save();
    }
    res.status(200).send('Chapter deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

async function getChaptersForStory(req, res) {
  try {
    const { storyId } = req.params;

    const chapters = await Chapter.find({ story: storyId });

    return res.status(200).json(chapters);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}

module.exports = {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
  getChaptersForStory,
};
