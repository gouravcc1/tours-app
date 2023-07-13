const ApiFeatures = require("./../utils/ApiFeatures");
const User = require("./../modals/usermodal");
const CatchAssync=require("../utils/CatchAssync")
exports.GetAlluser = CatchAssync(async(req, res,next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    results: user.length,
    data: {
      user,
    },
  });
});
exports.GetAuser = (req, res) => {
  const { id } = req.params;
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.PostAuser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.Putuser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
