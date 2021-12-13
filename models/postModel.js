const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "userModel",
    },
  ],
  love: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "userModel",
    },
  ],
  comments: [{
    text:String,
    commentedBy: {
      type:mongoose.Schema.ObjectId,
      ref: "userModel"
    }
  }],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel"
  },
});

const postModel = mongoose.model("postModel", postSchema);
module.exports = postModel;
