const jwt = require("jsonwebtoken");
const { AuthValidation } = require("./validations");

class AuthClass {
  #privateKey = "mymovieapp";

  //   constructor() {}

  Login = (req, res) => {
    const { username, password } = req.body;

    if (username == "student" && password == "fullstack") {
      const token = jwt.sign({ username }, this.#privateKey);

      return res.json({ token: token });
    }

    return res.status(401).send("Login failed!");
  };
}

module.exports = AuthClass;
