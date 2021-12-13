const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");

router.get("/user/:id", requireLogin, (req, res) => {
  userModel
    .findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      postModel
        .find({ postedBy: req.params.id })
        .populate("postedBy", "_id name email")
        .then((posts) => {
          res.json({ posts, user });
        })
        .catch((err) => {
          return res.status(404).json({ Error: err });
        });
    })
    .catch((err) => {
      return res.status(404).json({ Error: err });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  userModel.findByIdAndUpdate(
    req.body.followId,
    { $push: { follower: req.user._id } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      }
      userModel
        .findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.body.followId } },
          { new: true }
        )
        .select("-password")
        .then((result) =>
          res.json({
            Msg: "followed successfully",
            User: result,
          })
        )
        .catch((err) => res.json({ Error: err }));
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  userModel.findByIdAndUpdate(
    req.body.unfollowId,
    { $pull: { follower: req.user._id } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      }
      userModel
        .findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.body.unfollowId } },
          { new: true }
        )
        .select("-password")
        .then((result) =>
          res.json({
            Msg: "Unfollowed successfully",
            User: result,
          })
        )
        .catch((err) => res.json({ Error: err }));
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  // console.log("in bacend - start");
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { $set: { pic: req.body.pic } },
      { new: true }
    )
    .select("-password")
    .then((result) => res.json(result))
    .catch((err) => res.status(422).json({ Error: err }));
});

module.exports = router;
