const express = require('express');
const ReviewController = require('../controllers/review');
const router = express.Router();

router.post('/reviews', ReviewController.createReview);
router.get('/reviews/:id', ReviewController.getReviewById);
router.delete('/reviews/:id', ReviewController.deleteReview);
router.put('/reviews/:id', ReviewController.updateReview);

module.exports = router;
