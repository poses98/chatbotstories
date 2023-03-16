const express = require('express');
const ReadStatusController = require('../controllers/readstatus');
const router = express.Router();

router.post('/read-status/', ReadStatusController.createReadStatus);
router.get('/read-status/:id', ReadStatusController.createReadStatus);
router.put('/read-status/:id', ReadStatusController.createReadStatus);
router.post('/read-status/:id', ReadStatusController.createReadStatus);

module.exports = router;
