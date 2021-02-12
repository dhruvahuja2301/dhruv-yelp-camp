const express = require('express');
const router =  express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controller/reviews')

// review add
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// review delete
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router