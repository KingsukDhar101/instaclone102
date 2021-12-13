const express = require("express");
const CORS = require("cors");
const app = express();
const PORT = process.env.port || 5000;
const mongoose = require("mongoose");
const { MONGOURL } = require("./config/keys");

app.use(express.json());
app.use(CORS());

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Connected to Mongo DB");
  })
  .catch((err) => {
    console.log(err);
  });

require("./models/userModel");
require("./models/postModel");

app.use(require("./routes/authRoute"));
app.use(require("./routes/postRoute"));
app.use(require("./routes/userRoute"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
