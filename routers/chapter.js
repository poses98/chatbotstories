const express = require('express');
const ChapterController = require('../controllers/chapter');
const router = express.Router();

router.post('/chapters', ChapterController.createChapter);
router.get('/chapters', ChapterController.getAllChapters);
router.get('/chapters/:id', ChapterController.getChapterById);
router.put('/chapters/:id', ChapterController.updateChapter);
router.delete('/chapters/:id', ChapterController.deleteChapter);
router.get('/story/:storyId/chapters', ChapterController.getChaptersForStory);

module.exports = router;
