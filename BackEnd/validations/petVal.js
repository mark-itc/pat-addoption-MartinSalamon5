const Ajv = require("ajv");
const ajv = new Ajv();

module.exports.PetSearchValidation = ajv.compile({
  type: "object",
  properties: {
    currentUser: { type: "array" },
    type: { type: "string" },
    status: { type: "string" },
    name: { type: "string" },
    weight: { type: "string" },
  },
  required: ["currentUser", "type", "status", "name", "weight"],
  additionalProperties: false,
});

module.exports.MyPetsValidation = ajv.compile({
  type: "object",
  properties: {
    reqType: { type: "string" },
    currentUser: { type: "array" },
  },
  required: ["reqType", "currentUser"],
  additionalProperties: false,
});

module.exports.SavePetValidation = ajv.compile({
  type: "object",
  properties: {
    petID: { type: "string" },
    userID: { type: "string" },
  },
  required: ["petID", "userID"],
  additionalProperties: false,
});
