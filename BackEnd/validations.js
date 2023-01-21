const Ajv = require("ajv");
const ajv = new Ajv();

const animalsSearch = {
  bar: "Winking Lizard",
  text: "Best Bar uyiuhjopppokkokopk",
  integer: 2,
};

const AuthSchema = {
  type: "object",
  properties: {
    userName: { type: "string" },
    pass: { type: "string", minLength: 5, maxLength: 10 },
  },
  required: ["userName", "password"],
};

// const validate = ajv.compile(AuthSchema);

module.exports.AuthValidation = ajv.compile(AuthSchema);
