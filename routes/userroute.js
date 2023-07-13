const express = require("express");
const {
  GetAlluser,
  PostAuser,
  GetAuser,
  Putuser,
} = require("../controllars/usercontrolar");
const {
 signup,login
} = require("../controllars/authanticationControllar");

const router = express.Router();


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/").get(GetAlluser).post(PostAuser);
router.route("/:id").get(GetAuser).put(Putuser);

module.exports = router;
