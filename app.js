const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");

// Routes
const userRoutes = require("./api/routes/user");

const app = express();

//  Body Parser middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect To MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    mongoose.Promise = global.Promise;
    console.log("MongoDB Connected.");
  })
  .catch(err => console.log(err));

// Middelware
app.use(morgan("dev"));
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Routes which should handle requests
app.get("/", (req, res) => res.send("/user/register to start"));
app.use("/user", userRoutes);

// 404 - Page Not Found
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
