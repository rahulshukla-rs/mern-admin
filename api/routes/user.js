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

router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  UserController.userList
);

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  UserController.userAdd
);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  UserController.userUpdate
);

router.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  UserController.userDelete
);

module.exports = router;
