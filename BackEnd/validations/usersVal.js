const Ajv = require("ajv");
const ajv = new Ajv();

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

ajv.addFormat("email", emailRegex);
ajv.addFormat("phone", /^\d{10}$/);

module.exports.SignupValidation = ajv.compile({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: {
      type: "string",
      minLength: 8,
    },
    firstName: { type: "string" },
    lastName: { type: "string" },
    phone: { type: "string", format: "phone" },
  },
  required: ["email", "password", "firstName", "lastName", "phone"],
  additionalProperties: false,
});

module.exports.LoginValidation = ajv.compile({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
});

module.exports.EditUserValidation = ajv.compile({
  type: "object",
  properties: {
    userID: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string", format: "email" },
    phone: { type: "string", format: "phone" },
  },
  required: ["userID", "email", "firstName", "lastName", "phone"],
  additionalProperties: false,
});
