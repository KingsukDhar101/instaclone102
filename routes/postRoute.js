const express = require("express");
const router = express.Router();
const postModel = require("../models/postModel");
const requireLogin = require("../middleware/requireLogin");

router.get("/allPost", requireLogin, async (req, res) => {
  const post = await postModel
    .find()
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name");
  if (post) {
    return res.json({ post });
  } else {
    return res.send("Post not found");
  }
});

router.get("/getsubpost", requireLogin, async (req, res) => {
  const post = await postModel
    .find({postedBy: {$in : req.user.following}})
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name");
  if (post) {
    return res.json({ post });
  } else {
    return res.send("Post not found");
  }
});

router.post("/createPost", requireLogin, async (req, res) => {
  const { title, body, url } = req.body;
  if (!title || !body || !url) {
    return res.status(422).json({ Error: "please add all the fields." });
  } else {
    // postModel :: title, body, photo, postedBy(ObjectId)
    const post = await postModel.create({
      title,
      body,
      photo: url,
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        return res.json({
          Msg: "posted successfully",
          Data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({ Error: "error in post" });
      });
  }
});

router.get("/myPost", requireLogin, async (req, res) => {
  const mypost = await postModel
    .find({ postedBy: req.user._id })
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name")
    .catch((err) => res.json(err));
  if (mypost) {
    return res.json({ mypost });
  }
});

router.put("/like", requireLogin, (req, res) => {
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.user._id } },
      { new: true }
    )
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      } else {
        return res.json({
          Msg: "liked successfully",
          Data: result,
        });
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      } else {
        return res.json({
          Msg: "unliked successfully",
          Data: result,
        });
      }
    });
});

router.put("/love", requireLogin, (req, res) => {
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      { $push: { love: req.user._id } },
      { new: true }
    )
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      } else {
        return res.json({
          Msg: "loved successfully",
          Data: result,
        });
      }
    });
});

router.put("/unlove", requireLogin, (req, res) => {
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      { $pull: { love: req.user._id } },
      { new: true }
    )
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      } else {
        return res.json({
          Msg: "unloved successfully",
          Data: result,
        });
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    commentedBy: req.user._id,
  };
  postModel
    .findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
    .populate("comments.commentedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ Error: err });
      } else {
        return res.json({
          Msg: "Commented successfully",
          Data: result,
        });
      }
    });
});

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  postModel
    .findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ Error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            return res.json({
              Msg: "Successfully deleted",
              Data: result,
            });
          })
          .catch((err) => console.log(err));
      }
    });
});

module.exports = router;
