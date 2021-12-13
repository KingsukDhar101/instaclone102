const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/keys");
const userModel = require("../models/userModel");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // authorization = Brearer sjfalkjflsdajfkldsafl
  if (!authorization) {
    res.status(401).json({ Error: "you must be logged in." });
  } else {
    const token = authorization;
    jwt.verify(token, JWT_KEY, (err, payload) => {
      if (err) {
        res.status(401).json({ Error: "you must be logged in." });
      } else {
        const { _id } = payload;
        userModel.findById(_id).then((userdata) => {
          req.user = userdata;
          next();
        });
      }
    });
  }
};
