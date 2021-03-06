const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

const app = express();

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

app.get("/", (req, res) => res.send("Hello!"));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on port ${port}`));
