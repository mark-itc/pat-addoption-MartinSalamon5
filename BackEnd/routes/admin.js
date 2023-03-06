const express = require("express");
const fs = require("fs");
const router = express.Router();

// router.route("/allpets").get((req, res) => {
//   // SHould prbably add try catch to the following

//   const allpetsFile = fs.readFileSync("animals.json", {
//     encoding: "utf8",
//     flag: "a+",
//   });

//   const allPets = JSON.parse(allpetsFile);

//   res.status(400).send(allPets);
// });

// // SHould probably add try catch to the following
// router.route("/allusers").get((req, res) => {
//   const allUsersFile = fs.readFileSync("usersList.json", {
//     encoding: "utf8",
//     flag: "a+",
//   });

//   const allUsers = JSON.parse(allUsersFile);
//   const admin = allUsers.find((item) => item.userID == 0);
//   const index = allUsers.indexOf(admin);
//   allUsers.splice(index, 1);
//   res.status(400).send(allUsers);
// });

// router.route("/add").post(AuthMiddleware(), (req, res) => {
//   const addPetSchema = {
//     type: "object",
//     properties: {
//       petName: { type: "string", minLength: 2 },
//       animalType: { type: "string", minLength: 3 },
//       breed: { type: "string", minLength: 2 },
//       petDescription: { type: "string", minLength: 10 },
//       age: { type: "integer", maximum: 50 },
//       weight: { type: "integer", maximum: 80, minimum: 1 },
//       petImg: { type: "string" },
//       hypoallergenic: { type: "boolean" },
//       dietaryRestrictions: { type: "boolean" },
//     },
//     required: ["petName", "animalType", "petDescription"],
//     additionalProperties: false,
//   };

//   const ajv = new Ajv();
//   const valid = ajv.validate(addPetSchema, req.body);

//   if (!valid) {
//     return res.status(400).send(ajv.errors);
//   }

//   const newPet = req.body;
//   newPet.petID = nanoid.nanoid();
//   newPet.responsibleUserID = 0;
//   newPet.petStatus = "Available";

//   animalList.push(newPet);

//   fs.writeFileSync("animals.json", JSON.stringify(animalList));
//   res.status(200).json("Successfully saved!");
// });

//maybe even create a server.use general route like above to all routesaccessible to admin only,
//...such as a DELETE route for pets and a PUT route for updating pets.

module.exports = router;
