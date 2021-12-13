const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default: "https://res.cloudinary.com/king1/image/upload/v1639322930/avatar-1577909_960_720_u2cm6o.webp",
  },
  follower: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "userModel",
    },
  ],
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "userModel",
    },
  ],
});

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
