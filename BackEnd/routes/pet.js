const express = require("express");
const router = express.Router();

const nanoid = require("nanoid");

const animalList = require("../animals.json");
const usersList = require("../usersList.json");
const Ajv = require("ajv");
const fs = require("fs");

router.route("/add").post((req, res) => {
  const addPetSchema = {
    type: "object",
    properties: {
      petName: { type: "string", minLength: 2 },
      animalType: { type: "string", minLength: 3 },
      breed: { type: "string", minLength: 2 },
      petDescription: { type: "string", minLength: 10 },
      age: { type: "integer", maximum: 50 },
      weight: { type: "integer", maximum: 80, minimum: 1 },
      petImg: { type: "string" },
      hypoallergenic: { type: "boolean" },
      dietaryRestrictions: { type: "boolean" },
    },
    required: ["petName", "animalType", "petDescription"],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const valid = ajv.validate(addPetSchema, req.body);

  if (!valid) {
    return res.status(400).send(ajv.errors);
  }

  const newPet = req.body;
  newPet.petID = nanoid.nanoid();
  newPet.responsibleUserID = 0;
  newPet.petStatus = "Available";

  animalList.push(newPet);

  fs.writeFileSync("animals.json", JSON.stringify(animalList));
  res.status(200).json("Successfully saved!");
});

router.route("/search").get((req, res) => {
  const schema = {
    type: "object",
    properties: {
      userID: { type: "string" },
      type: { type: "string" },
      status: { type: "string" },
      name: { type: "string" },
      weight: { type: "string" },
    },
    required: ["userID", "type", "status", "name", "weight"],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.query);

  if (!valid) {
    return res.status(400).send(ajv.errors);
  }
  const searchResults = [];

  const searchTerms = req.query;

  animalList.map((item) => {
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

  const userLovedPetsArray = usersList.find(
    (item) => item.userID == searchTerms.userID
  ).lovedPetsIDs;

  if (searchResults.length < 1) {
    return res.status(200).json({ message: "No results were found..." });
  }

  searchResults.map((result) => {
    const resultPetID = result.petID;
    if (userLovedPetsArray.includes(resultPetID)) {
      result.loved = true;
    } else {
      result.loved = false;
    }
  });

  res.status(200).json(searchResults);
});

router.route("/mine").get((req, res) => {
  const schema = {
    type: "object",
    properties: {
      reqType: { type: "string" },
      userID: { type: "string" },
    },
    required: ["reqType", "userID"],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.query);

  if (!valid) {
    return res.status(400).send(ajv.errors);
  }

  const reqType = req.query.reqType.toString().toLowerCase();
  const userID = req.query.userID;

  if (reqType == "lovedpets") {
    const lovedPets = [];

    usersList.map((item) => {
      if (userID == item.userID) {
        let lovedPetsIDs = item.lovedPetsIDs;
        lovedPetsIDs.map((id) => {
          animalList.map((pet) => {
            let petID = pet.petID;
            if (petID == id) {
              lovedPets.push(pet);
            }
          });
        });
      }
    });

    if (lovedPets.length < 1) {
      return res.status(200).json({ message: "No loved pets yet..." });
    }

    const userLovedPetsArray = usersList.find(
      (item) => item.userID == userID
    ).lovedPetsIDs;

    lovedPets.map((result) => {
      const resultPetID = result.petID;
      if (userLovedPetsArray.includes(resultPetID)) {
        result.loved = true;
      } else {
        result.loved = false;
      }
    });

    return res.status(200).json(lovedPets);
  }

  if (reqType == "mypets") {
    const myPets = [];
    animalList.map((item) => {
      let responsibleID = item.responsibleUserID;
      if (responsibleID == userID) {
        myPets.push(item);
      }
    });

    if (myPets.length < 1) {
      return res
        .status(200)
        .json({ message: "You're not taking care any pets right now..." });
    }

    const userLovedPetsArray = usersList.find(
      (item) => item.userID == userID
    ).lovedPetsIDs;

    myPets.map((result) => {
      const resultPetID = result.petID;
      if (userLovedPetsArray.includes(resultPetID)) {
        result.loved = true;
      } else {
        result.loved = false;
      }
    });

    return res.status(200).json(myPets);
  }
});

// Save/Love pet route:

router.route("/:id/save").post((req, res) => {
  const schema = {
    type: "object",
    properties: {
      userID: { type: "integer" },
    },
    required: ["userID"],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);

  if (!valid) {
    return res.status(400).send(ajv.errors);
  }

  const userID = req.body.userID;
  const petID = req.params.id;

  const data = fs.readFileSync("usersList.json", {
    encoding: "utf8",
    flag: "a+",
  });

  const jsonData = JSON.parse(data);

  const existingUserIDs = jsonData.find((item) => item.userID == userID);

  if (!existingUserIDs) {
    return res.status(200).json("Please check if userID is valid!");
  }

  const lovedPets = jsonData.find((item) => item.userID == userID).lovedPetsIDs;

  const allPetIDsArray = [];

  animalList.map((pet) => {
    allPetIDsArray.push(pet.petID);
  });

  if (!lovedPets.includes(petID)) {
    if (allPetIDsArray.includes(petID)) {
      lovedPets.push(petID);

      usersList.map((user) => {
        if (user.userID == userID) {
          user.lovedPetsIDs = lovedPets;
        }
      });
      fs.writeFileSync("usersList.json", JSON.stringify(usersList));
      return res.status(200).json("Pet was saved successfully!");
    } else {
      return res
        .status(200)
        .json("This pet ID does not exist. Please try using another pet ID!");
    }
  } else {
    return res.status(200).json("This pet has already been saved previously!");
  }
});

router.route("/:id/save").delete((req, res) => {
  const bodySchema = {
    type: "object",
    properties: {
      userID: { type: "integer" },
    },
    required: ["userID"],
    additionalProperties: false,
  };

  const paramsSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
  };

  const ajvBody = new Ajv();
  const validBody = ajvBody.validate(bodySchema, req.body);
  const ajvParams = new Ajv();
  const validParams = ajvParams.validate(paramsSchema, req.params);

  if (!validBody) {
    return res.status(400).send(ajvBody.errors);
  }
  if (!validParams) {
    return res.status(400).send(ajvParams.errors);
  }

  const userID = req.body.userID;
  const petID = req.params.id;

  const data = fs.readFileSync("usersList.json", {
    encoding: "utf8",
    flag: "a+",
  });

  const jsonData = JSON.parse(data);

  const existingUserIDs = jsonData.find((item) => item.userID == userID);

  if (!existingUserIDs) {
    return res.status(200).json("Please check if userID is valid!");
  }

  const lovedPets = jsonData.find((item) => item.userID == userID).lovedPetsIDs;

  const allPetIDsArray = [];

  animalList.map((pet) => {
    allPetIDsArray.push(pet.petID);
  });

  if (!lovedPets.includes(petID)) {
    return res
      .status(200)
      .json("This pet has NOT been saved previously and can not be deleted.");
  } else {
    if (allPetIDsArray.includes(petID)) {
      const petToDeleteIndex = lovedPets.indexOf(petID);
      lovedPets.splice(petToDeleteIndex, 1);
      usersList.map((user) => {
        if (user.userID == userID) {
          user.lovedPetsIDs = lovedPets;
          fs.writeFileSync("usersList.json", JSON.stringify(usersList));
          return res.status(200).json("Pet was deleted successfully!");
        }
      });
    }
  }
});

module.exports = router;
