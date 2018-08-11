const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");

// Load user Model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Test users route
// @access public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works!"
  })
);

// @route POST api/users/register
// @desc Regiser New User
// @access public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res
        .status(400)
        .json({ status: "0", msg: "Email already exists." });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login User / Return JWT Token
// @access public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find User by Email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ status: "0", msg: "user not found." });
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //res.json({ status: "1", msg: "Login Success" });
        //User Matched
        const payLoad = {
          id: user.id,
          name: user.name,
          email: user.email
        }; //Create JWT PayLoad

        // Sign Token
        jwt.sign(payLoad, keys.jwtKEY, { expiresIn: 3600 }, (err, token) => {
          res.json({
            status: "1",
            token: "Bearer " + token
          });
        });
      } else {
        return res
          .status(400)
          .json({ status: "0", msg: "Incorrect Password." });
      }
    });
  });
});

// @route GET api/users/current
// @desc Return current User
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
