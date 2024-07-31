const mongoose = require("mongoose");
const Review = require("./review");
const { listingSchema } = require("../schema");

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // bookings: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Book",
  //   },
  // ],
});

ListingSchema.post("findOneAndDelete", async (Listing) => {
  if (Listing) {
    Review.deleteMany({ _id: { $in: listingSchema.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
