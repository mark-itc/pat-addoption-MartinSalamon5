const { ObjectId } = require("mongodb");

let usersCollection;

module.exports = class UsersDAO {
  static async injectDB(connection) {
    if (!connection) return;

    try {
      usersCollection = await connection.collection("Users");
    } catch (e) {
      console.log(`Could not establish connection to Users collection ${e}`);
    }
  }

  static async getUser(userID) {
    return await usersCollection.find({ _id: new ObjectId(userID) }).toArray();
  }

  static async getAllUsers() {
    return await usersCollection.find({}).toArray();
  }

  static async createUser(userData) {
    userData.created_at = new Date();
    userData.login_attempts = 0;
    await usersCollection.insertOne({ ...userData });
  }

  static async getUserByEmail(email) {
    return await usersCollection.findOne({ email });
  }

  static async updateUser(userID, firstName, lastName, email, phone) {
    await usersCollection.updateOne(
      { _id: new ObjectId(userID) },
      { $set: { firstName, lastName, email, phone } }
    );
  }
};
