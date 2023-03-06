const express = require("express");
const server = express();
server.use(express.json());

const cors = require("cors");
server.use(cors());

const accountsRoutes = require("./routes/accounts");
const petRoutes = require("./routes/pet");
const adminRoutes = require("./routes/admin");

server.use("/accounts", accountsRoutes);
server.use("/pet", petRoutes);
server.use("/admin", adminRoutes);

server.listen(4000);
