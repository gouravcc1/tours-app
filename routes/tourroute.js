const express = require("express");
const {
  aliastoptours,
  GetAllTours,
  PostATour,
  GetAtour,
  PutTour,
  UpdateTour,
  DeleteAtour,
  GetTourStates,
} = require("../controllars/tourControlar");
const authanticationController=require("./../controllars/authanticationControllar");
const router = express.Router();

router.route("/").get(authanticationController.protect,GetAllTours).post(PostATour);
router.route("/tour-states").get(GetTourStates);
router.route("/top-5-cheap").get(aliastoptours, GetAllTours);
router
  .route("/:id")
  .get(GetAtour)
  .put(PutTour)
  .patch(UpdateTour)
  .delete(authanticationController.protect,authanticationController.restrictTo('admin','leader-guide'),DeleteAtour);
module.exports = router;
