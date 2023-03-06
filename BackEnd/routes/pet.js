const express = require("express");
const router = express.Router();
const { initDB } = require("../models/mongoInit");
require("dotenv").config();
const PetsController = require("../controllers/PetsController");
const { AuthMiddleware } = require("../middlewares/AuthMiddleware");

initDB();

router.route("/search").get(AuthMiddleware, PetsController.SearchPets);

router.route("/mine").get(AuthMiddleware, PetsController.MyPets);

router.route("/save").post(PetsController.SavePet);

// router.route("/:id/save").delete((req, res) => {
//   const bodySchema = {
//     type: "object",
//     properties: {
//       userID: { type: "integer" },
//     },
//     required: ["userID"],
//     additionalProperties: false,
//   };

//   const paramsSchema = {
//     type: "object",
//     properties: {
//       id: { type: "string" },
//     },
//     required: ["id"],
//     additionalProperties: false,
//   };

//   const ajvBody = new Ajv();
//   const validBody = ajvBody.validate(bodySchema, req.body);
//   const ajvParams = new Ajv();
//   const validParams = ajvParams.validate(paramsSchema, req.params);

//   if (!validBody) {
//     return res.status(400).send(ajvBody.errors);
//   }
//   if (!validParams) {
//     return res.status(400).send(ajvParams.errors);
//   }

//   const userID = req.body.userID;
//   const petID = req.params.id;

//   const data = fs.readFileSync("usersList.json", {
//     encoding: "utf8",
//     flag: "a+",
//   });

//   const jsonData = JSON.parse(data);

//   const existingUserIDs = jsonData.find((item) => item.userID == userID);

//   if (!existingUserIDs) {
//     return res.status(200).json("Please check if userID is valid!");
//   }

//   const lovedPets = jsonData.find((item) => item.userID == userID).lovedPetsIDs;

//   const allPetIDsArray = [];

//   animalList.map((pet) => {
//     allPetIDsArray.push(pet.petID);
//   });

//   if (!lovedPets.includes(petID)) {
//     return res
//       .status(200)
//       .json("This pet has NOT been saved previously and can not be deleted.");
//   } else {
//     if (allPetIDsArray.includes(petID)) {
//       const petToDeleteIndex = lovedPets.indexOf(petID);
//       lovedPets.splice(petToDeleteIndex, 1);
//       usersList.map((user) => {
//         if (user.userID == userID) {
//           user.lovedPetsIDs = lovedPets;
//           fs.writeFileSync("usersList.json", JSON.stringify(usersList));
//           return res.status(200).json("Pet was deleted successfully!");
//         }
//       });
//     }
//   }
// });

module.exports = router;
