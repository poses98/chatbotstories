const express = require('express');
const ReadStatusController = require('../controllers/readstatus');
const router = express.Router();

router.post('/read-status/', ReadStatusController.createReadStatus);
router.get('/read-status/:id', ReadStatusController.getReadStatusById);
router.put('/read-status/:id', ReadStatusController.updateReadStatusById);
router.delete('/read-status/:id', ReadStatusController.deleteReadStatusById);

module.exports = router;
