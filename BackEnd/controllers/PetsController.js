const {
  PetSearchValidation,
  MyPetsValidation,
  SavePetValidation,
} = require("../validations/petVal");
const PetsDAO = require("../models/PetsDAO");
const UsersDAO = require("../models/UsersDAO");

module.exports = class PetsController {
  static async SearchPets(req, res) {
    try {
      const validRequest = PetSearchValidation(req.query);

      if (!validRequest) {
        return res.status(400).json({
          success: false,
          message: "Request parameters are not correct!",
        });
      }

      const searchTerms = req.query;
      const searchResults = [];

      const petResults = await PetsDAO.getAllPets();

      petResults.map((item) => {
        let petStatus = item.petStatus.toLowerCase();
        let petName = item.petName.toLowerCase();
        let petType = item.animalType.toLowerCase();
        let petWeight = item.weight;

        if (
          petType.includes(searchTerms.type.toLowerCase()) &&
          petStatus.includes(searchTerms.status.toLowerCase()) &&
          petName.includes(searchTerms.name.toLowerCase()) &&
          (petWeight <= searchTerms.weight || searchTerms.weight == "")
        ) {
          searchResults.push(item);
        }
      });

      if (searchResults.length < 1) {
        return res.status(200).json({ message: "No results were found..." });
      }

      console.log("currentuser", req.query.currentUser[0]);
      const userData = await UsersDAO.getUser(req.query.currentUser[0]._id);

      const userLovedPetsArray = userData[0].lovedPetsIDs;
      searchResults.map((result) => {
        const resultPetID = result._id.toString();
        if (userLovedPetsArray.includes(resultPetID)) {
          result.loved = true;
        } else {
          result.loved = false;
        }
      });
      res.status(200).json(searchResults);
    } catch (err) {
      console.log(err);
    }
  }

  static async MyPets(req, res) {
    try {
      const validRequest = MyPetsValidation(req.query);

      if (!validRequest) {
        return res.status(400).json({
          success: false,
          message: "Request parameters are not correct!",
        });
      }

      const reqType = req.query.reqType.toString().toLowerCase();
      const userID = req.query.userID;

      if (reqType == "lovedpets") {
        const lovedPets = [];

        const userData = await UsersDAO.getUser(req.query.currentUser[0]._id);
        const petResults = await PetsDAO.getAllPets();

        const userLovedPetsArray = userData[0].lovedPetsIDs;

        petResults.map((pet) => {
          if (userLovedPetsArray.includes(pet._id.toString())) {
            pet.loved = true;
            lovedPets.push(pet);
          }
        });

        if (lovedPets.length < 1) {
          return res.status(200).json({ message: "No loved pets yet..." });
        }

        return res.status(200).json(lovedPets);
      }

      if (reqType == "mypets") {
        const myPets = [];

        const userData = await UsersDAO.getUser(req.query.currentUser[0]._id);
        const petResults = await PetsDAO.getAllPets();

        const userLovedPetsArray = userData[0].lovedPetsIDs;

        petResults.map((pet) => {
          let responsibleID = pet.responsibleUserID;
          if (responsibleID == userID) {
            if (userLovedPetsArray.includes(pet._id.toString())) {
              pet.loved = true;
            } else {
              pet.loved = false;
            }
            myPets.push(pet);
          }
        });

        if (myPets.length < 1) {
          return res
            .status(200)
            .json({ message: "You're not taking care any pets right now..." });
        }

        return res.status(200).json(myPets);
      }
    } catch (err) {
      console.log(err);
    }
  }

  //need to work on the below, it is not ready...
  static async SavePet(req, res) {
    try {
      const validRequest = SavePetValidation(req.body);

      if (!validRequest) {
        return res.status(400).json({
          success: false,
          message: "Request parameters are not correct!",
        });
      }
      const userData = await UsersDAO.getUser(userID);
      const userLovedPetsArray = userData[0].lovedPetsIDs;

      return res.status(200).json(userLovedPetsArray);
    } catch (err) {
      console.log(err);
    }
  }
};
