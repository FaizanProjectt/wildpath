const Listing = require("./models/listing");
const Review = require("./models//review");

module.exports.isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "🔐you must be logged in to create operations!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect(`/listings/${id}`);
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "🚫You are not the owner!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    req.flash("error", "❌Something went wrong!");
    res.redirect("back");
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "🚫You are not the author");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "❌Something went wrong");
    res.redirect(`/listings/${id}`);
  }
};
