const { MongoClient } = require("mongodb");
const PetsDAO = require("./PetsDAO");
const UsersDAO = require("./UsersDAO");

module.exports.initDB = async function initDB() {
  MongoClient.connect(process.env.MONGODB_ENV)
    .then(async (connection) => {
      const db = connection.db(process.env.DB);
      await PetsDAO.injectDB(db);
      await UsersDAO.injectDB(db);
      console.log("Connection to DB established");
      return;
    })
    .catch((error) => {
      console.log(error);
      console.log(`DB connection failed ${error}`);
      process.exit(1);
    });
};
