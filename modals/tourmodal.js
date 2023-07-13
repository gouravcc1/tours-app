const mongoose = require("mongoose");

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
    trim:true,
  },
  secretTour: { type: Boolean, default: false },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  priceDiscount: { type: Number, default: 0 },
  duration: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
  },
  difficulty: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageCover: {
    type: String,
    required: true,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const tour = mongoose.model("tour", tourSchema);
module.exports = tour;
