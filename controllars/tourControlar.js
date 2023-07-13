const { Query } = require("mongoose");
const { dirname } = require("path");
// const { features } = require("process");
const ApiFeatures = require("./../utils/ApiFeatures");
const Tour = require("./../modals/tourmodal");
const CatchAssync=require("../utils/CatchAssync")
const { match } = require("assert");
const AppError = require("../utils/AppError");
exports.aliastoptours = (req, res, next) => {
  req.query.sort = "-ratingsAverage price";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};
exports.PostATour = CatchAssync(async (req, res,next) => {
  // try {
    const newtour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newtour,
      },
    });
  } 
);
// const CatchAssync=fn=>{
//   return (req,res,next)=>{
//     fn(req,res,next).catch(next);
//   }
// }

exports.GetAllTours = CatchAssync(async (req, res,next) => {
    const Features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sorting()
      .limilfields()
      .pagination();
    const tour = await Features.query;
    res.status(200).json({
      status: "success",
      results: tour.length,
      data: {
        tour,
      },
    });
  
});
exports.GetAtour = CatchAssync(async (req, res,next) => {
  // try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    if(!tour){
      return next(new AppError('no tour found with that id',404));
    }
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
 
});
exports.DeleteAtour = CatchAssync(async (req, res,next) => {
  
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);
    if(!tour){
      return next(new AppError('no tour found with that id',404));
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  
});

exports.PutTour = CatchAssync(async (req, res,next) => {
  
    const { id } = req.params;
    const tour = await Tour.findOneAndReplace(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
    res.send("done");
  } 
);
exports.UpdateTour = CatchAssync(async (req, res,next) => {
  
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour){
      return next(new AppError('no tour found with that id',404));
    }
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  
});
exports.GetTourStates = CatchAssync(async (req, res,next) => {
  
    // console.log("success");
    const states = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: null,
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        states,
      },
    });
  
});
