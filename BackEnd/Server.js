const express = require("express");
const server = express();
server.use(express.json());

const cors = require("cors");
server.use(cors());

const petRoute = require("./routes/pet");

server.use("/pet", petRoute);

//for the /allpets route, I need to add the jwt interdiction to admins only

server.get("/allpets", (req, res) => {
  console.log(req);
  res.status(400).send({ message: "hello" });
});

server.listen(4000);
