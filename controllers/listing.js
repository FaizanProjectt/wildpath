const Listing = require("../models/listing");
const Book = require("../models/book");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports.index = async (req, res) => {
  const allListing = await Listing.find().populate("owner");
  res.render("listings/index.ejs", { allListing });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRouteListing = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid Listing Id!");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // .populate("bookings");

  if (!listing) {
    req.flash("error", "Listing you requested does not exists!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

// module.exports.renderBookForm = async (req, res) => {
//   const { id } = req.params;
//   console.log("listing id for booking Form", id);
//   if (!isValidObjectId(id)) {
//     req.flash("error", "Invalid Listing Id!");
//     return res.redirect("/listings");
//   }

//   try {
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//     }
//     res.render("listings/book.ejs", { listing });
//   } catch {
//     req.flash("error", "An error occurred while fetching the listing.");
//     return res.redirect("/listings");
//   }
// };

module.exports.createListing = async (req, res, next) => {
  // let listing = req.body.listing
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// module.exports.saveBookData = async (req, res) => {
//   const { id } = req.params;
//   console.log("Listing id for saving booking:", id);
//   console.log("Request Body:", req.body);

//   if (!isValidObjectId(id)) {
//     req.flash("error", "Invalid listing Id");
//     return res.redirect("/listings");
//   }
//   console.log("Listing for saving booking:", id);

//   try {
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       req.flash("error", "Listing Not found!");
//       return res.redirect("/listings");
//     }

//     const fetchBook = new Book(req.body.book);
//     fetchBook.user = req.user._id;
//     fetchBook.listing = listing._id;
//     await fetchBook.save();
//     console.log(fetchBook);

//     listing.bookings.push(fetchBook);
//     await listing.save();
//     req.flash("success", "Booking Successfully!");
//     res.redirect(`/listings/${id}`);
//   } catch (error) {
//     console.error("Error in saveBookData:", error);
//     req.flash("error", "An error occurred while saving the booking.");
//     return res.redirect(`/listings/${id}`);
//   }
// };

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing Updated!");

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/Listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
