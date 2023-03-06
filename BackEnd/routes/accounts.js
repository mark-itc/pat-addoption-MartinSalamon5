const express = require("express");
const router = express.Router();
require("dotenv").config();
const UsersController = require("../controllers/UsersController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");

const { initDB } = require("../models/mongoInit");
initDB();

router.route("/userinfo").get(AuthMiddleware, (req, res) => {
  return res.json(req.query);
});
router.route("/edituserinfo").put(AuthMiddleware, UsersController.UpdateUser);
router.route("/signup").post(UsersController.Signup);
router.route("/login").post(UsersController.Login);

module.exports = router;
