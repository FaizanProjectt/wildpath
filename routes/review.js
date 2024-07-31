const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isReviewAuthor } = require("../middleware.js");
const { postReview } = require("../controllers/reviews.js");

const listingReview = require("../controllers/reviews.js");

const validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// Post review route
router.post(
  "/",
  isloggedIn,
  validatereview,
  wrapAsync(listingReview.postReview)
);

// Delete review route

router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(listingReview.deleteReview)
);

module.exports = router;
