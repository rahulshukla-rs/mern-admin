const passport = require("passport");
const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

router.post("/register", UserController.userRegister);

router.post("/login", UserController.userLogin);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  UserController.userCurrent
);

//router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
