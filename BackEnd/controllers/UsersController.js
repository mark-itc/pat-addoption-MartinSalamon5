const {
  SignupValidation,
  LoginValidation,
  EditUserValidation,
} = require("../validations/usersVal");
const UsersDAO = require("../models/UsersDAO");
const sha256 = require("js-sha256");
const jwt = require("jsonwebtoken");

module.exports = class UsersController {
  static async Login(req, res) {
    try {
      const validRequest = LoginValidation(req.body);

      if (!validRequest) {
        return res.status(400).json({
          success: false,
          message: "Please fill in all the fields",
        });
      }

      const user = await UsersDAO.getUserByEmail(req.body.email);
      if (!user || user.password != sha256(req.body.password)) {
        return res.status(400).json({
          success: false,
          message: "Wrong username or password",
        });
      }

      const userID = user._id;
      const userEmail = user.email;

      const token = jwt.sign(
        {
          userID: userID,
          email: userEmail,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        token: token,
      });
    } catch (e) {
      console.log(`Error in UsersController.Login ${e}`);
      return res.status(500).json({
        success: false,
        message: "unknown error",
      });
    }
  }

  static async Signup(req, res) {
    try {
      const validRequest = SignupValidation(req.body);

      if (!validRequest) {
        return res.status(400).json({
          success: false,
          message: "Signup was unsuccessful.",
        });
      }

      const userObject = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        lovedPetsIDs: [],
      };

      const existingUser = await UsersDAO.getUserByEmail(userObject.email);

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "The email you entered is already in use. Please use another email address or log in.",
        });
      }

      userObject.password = sha256(userObject.password);

      await UsersDAO.createUser(userObject);
      const user = await UsersDAO.getUserByEmail(userObject.email);

      return res.json({
        success: true,
        userID: user._id,
        message: "User signed up and logged in.",
      });
    } catch (e) {
      console.log(`Error in UsersController.Signup ${e}`);
      return res.status(500).json({
        success: false,
        message: "unknown error",
      });
    }
  }

  static async UpdateUser(req, res) {
    try {
      const validRequest = EditUserValidation(req.body);

      if (!validRequest) {
        return res.status(400).json({
          success: false,
          message: "Request not valid",
        });
      }

      const updatedUser = await UsersDAO.updateUser(
        req.body.userID,
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.phone
      );

      if (updatedUser) {
        return res.status(400).json({
          success: false,
          message: "User was updated",
        });
      }

      //   console.log("exist", existingUser);

      //   if (!existingUser) {
      //     return res.status(400).json({
      //       success: false,
      //       message:
      //         "An issue appeared when trying to update your information. Please try again later",
      //     });
      //   }

      //   userObject.password = sha256(userObject.password);

      //   await UsersDAO.createUser(userObject);
      //   const user = await UsersDAO.getUserByEmail(userObject.email);

      return res.json({
        success: true,
        user: "done",
        message: "Working right.",
      });
    } catch (e) {
      console.log(`Error in UsersController.UpdateUser ${e}`);
      return res.status(500).json({
        success: false,
        message: "unknown error",
      });
    }
  }
};
