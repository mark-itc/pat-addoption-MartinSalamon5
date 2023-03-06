// const { ObjectId } = require("mongodb");

let petsCollection;

module.exports = class PetsDAO {
  static async injectDB(connection) {
    if (!connection) return;

    try {
      petsCollection = await connection.collection("Pets");
      if (petsCollection) {
        console.log("connection to pets collection established");
      }
    } catch (e) {
      console.log(`Could not establish connection to Pets collection ${e}`);
    }
  }

  static async getAllPets() {
    return await petsCollection.find({}).toArray();
  }
};
