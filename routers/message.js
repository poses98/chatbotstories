const express = require('express');
const messageController = require('../controllers/message');

const router = express.Router();

router.post('/chapters/:chapterId/messages', messageController.createMessage);
router.get(
  '/chapters/:chapterId/messages/:messageId',
  messageController.getMessageById
);
router.put(
  '/chapters/:chapterId/messages/:messageId',
  messageController.updateMessage
);
router.delete(
  '/chapters/:chapterId/messages/:messageId',
  messageController.deleteMessage
);

module.exports = router;
