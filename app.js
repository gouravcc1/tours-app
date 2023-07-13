const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const AppError=require('./utils/AppError')
const globleErrorHandler=require('./controllars/errorControllar')
const TourRoute = require("./routes/tourroute");
const userRoute = require("./routes/userroute");


app.use(express.json());

app.use("/api/v1/tours", TourRoute);
app.use("/api/v1/user",  userRoute);
app.all('*',(req,res,next)=>{
   next(new AppError(`can't find ${req.originalUrl} on the server`,404));
})
app.use(globleErrorHandler)

module.exports = app;
//
