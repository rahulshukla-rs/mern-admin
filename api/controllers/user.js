const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");

/* Load input Validation */
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

/* Load user Model */
const User = require("../models/User");

// @route POST user/register
// @desc Regiser New User
// @access public
exports.userRegister = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists.";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
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
};

// @route POST user/login
// @desc Login User / Return JWT Token
// @access public
exports.userLogin = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find User by Email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "user not found.";
      return res.status(404).json(errors);
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //res.json({ status: "1", msg: "Login Success" });
        //User Matched
        const payLoad = {
          id: user.id,
          type: user.type,
          name: user.name,
          email: user.email
        }; //Create JWT PayLoad

        // Sign Token
        jwt.sign(payLoad, keys.jwtKEY, { expiresIn: 360000 }, (err, token) => {
          res.json({
            status: "1",
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Incorrect Password.";
        return res.status(400).json(errors);
      }
    });
  });
};

// @route GET users/current
// @desc Return current User
// @access private
exports.userCurrent = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};

// @route GET user/current
// @desc Return current User
// @access private
exports.userList = (req, res) => {
  User.find({})
    .exec()
    .then(users => {
      const userMap = {};

      users.forEach(function(user) {
        userMap[user._id] = {
          id: user._id,
          type: user.type,
          name: user.name,
          email: user.email
        };
      });
      res.json(userMap);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// @route POST user/add
// @desc Add New User
// @access private
exports.userAdd = (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json("Email already exists.");
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
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
};

// @route UPDATE user/:userId
// @desc Update User by userId
// @access private
exports.userUpdate = (req, res) => {
  User.findByIdAndUpdate(req.body.userId, { $set: req.body })
    .exec()
    .then(users => {
      console.log(users);
      if (!users) return res.status(404).json({ msg: "User Not Found." });
      return res.json({ success: true });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// @route DELETE user/:userId
// @desc Delete User by userId
// @access private
exports.userDelete = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
    .exec()
    .then(users => {
      if (!users) return res.status(404).json({ msg: "User Not Found." });
      return res.json({ success: true });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};
