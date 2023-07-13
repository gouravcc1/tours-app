const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requere: [true, "user must have a name"],
  },
  email: {
    type: String,
    require: [true, "please  provide your email"],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, "provide a valide email"],
  },

  photo: {
    type: String,
  },
  role:{
    type:String,
    enum:["admin","user","guide","leader-guide"],
    default:'user'
  },
  password: {
    type: String,
    require: [true, "provide password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "please confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    select: false,
    messege: "password did not match",
  },
  passwordChanged: Date
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // runs only when passward
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctpassword = async function (
  canditatePassword,
  userPassword
) {
  return await bcrypt.compare(canditatePassword, userPassword);
};
userSchema.methods.checkPasswordChanges =  function(TokenTime){
  if(this.passwordChanged){
    const Timeinmin=this.passwordChanged.getTime()/1000;
    return Timeinmin<TokenTime;
  }
  return false;
}
const user = mongoose.model("user", userSchema);
module.exports = user;
