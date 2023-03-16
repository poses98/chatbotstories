const Review = require('../models/Review');
const Story = require('../models/Story');

// GET /reviews/:id - get review by ID
async function getReviewById(req, res) {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

// POST /reviews - create new review
async function createReview(req, res) {
  try {
    const { body, haveUserLikedStory, user, story } = req.body;
    const review = await Review.create({
      body,
      haveUserLikedStory,
      user,
      story,
    });
    if (review) {
      const storyRef = await Story.findById(story);
      storyRef.reviews.push(review._id);
      const storedStory = await storyRef.save();
      if (storedStory)
        res.status(201).json({
          status: 'success',
          data: {
            review,
          },
        });
      else return res.status(400).send();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

// PATCH /reviews/:id - update review by ID
async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { body, haveUserLikedStory, user, story } = req.body;
    const review = await Review.findByIdAndUpdate(
      id,
      { body, haveUserLikedStory, user, story },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

// DELETE /reviews/:id - delete review by ID
async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    console.log(review);
    if (review) {
      const storyRef = await Story.findById(review.story);
      const reviewIndex = storyRef.reviews.findIndex(
        (reviewRef) => reviewRef.toString() === id
      );
      console.log(reviewIndex);
      if (reviewIndex !== -1) {
        storyRef.reviews.splice(reviewIndex, 1);
        const storedStory = await storyRef.save();
        if (storedStory)
          res.status(201).json({
            status: 'success',
            data: {
              review,
            },
          });
      } else return res.status(400).send();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
}

module.exports = {
  createReview,
  deleteReview,
  updateReview,
  getReviewById,
};
