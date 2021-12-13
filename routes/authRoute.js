const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/keys");
const { urlencoded } = require("express");
// const requireLogin = require('../middleware/requireLogin');

// router.get("/protected", requireLogin, (req, res) => {
//   res.send("hello - this is protected zone");
// });

router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ Error: "Please enter all the fields" });
  } else {
    const checkUser = await userModel.findOne({ email: email });
    if (checkUser) {
      return res.json({ Error: "user already exists." });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        pic
      });
      if (newUser) {
        return res.json({
          Msg: "User signed up successfully.",
          Data: newUser,
        });
      } else {
        return res.json({ Error: "error in creating" });
      }
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ Error: "please add all the fields" });
  } else {
    const savedUser = await userModel.findOne({ email: email });
    if (!savedUser) {
      return res.json({ Error: "Invalid username or password" });
    } else {
      const checkPassword = await bcrypt.compare(password, savedUser.password);
      if (checkPassword) {
        const token = await jwt.sign({ _id: savedUser._id }, JWT_KEY);
        return res.json({
          Msg: "Logged in successfully!",
          Token: token,
          User: {
            name: savedUser.name,
            email: savedUser.email,
            pic: savedUser.pic,
            __v: savedUser.__v,
            _id: savedUser._id,
            follower: savedUser.follower,
            following: savedUser.following
          },
        });
      } else {
        return res.json({ Error: "Invalid username or password" });
      }
    }
  }
});

module.exports = router;
