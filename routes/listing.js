const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isloggedIn, isOwner } = require("../middleware.js");
const Book = require("../models/book.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.route("/new").get(isloggedIn, listingController.newListing);

router
  .route("/:id")
  .get(wrapAsync(listingController.showRouteListing))
  .put(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateRoute)
  )
  .delete(isloggedIn, isOwner, wrapAsync(listingController.deleteRoute));

// book route
// router
//   .route("/:id/book")
//   .get(isloggedIn, listingController.renderBookForm)
//   .post(listingController.saveBookData);

router
  .route("/:id/edit")
  .get(isloggedIn, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;
