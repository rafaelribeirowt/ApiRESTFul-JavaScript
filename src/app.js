const http = require("http");
const express = require("express");
const status = require("http-status");
const clientesRoute = require("./routes/clientes");
const sequelize = require("./database/database.js");

const app = express();

app.use(express.json());

app.use("/api", clientesRoute);

app.use((request, response, next) => {
  response.status(status.NOT_FOUND).send();
});

app.use((error, request, response, next) => {
  response.status(status.INTERNAL_SERVER_ERROR).json({ error });
});

//Persistencia banco de dados, cria tabelas no banco de dados.
sequelize.sync({ force: false }).then(() => {
  const port = process.env.PORT || 3000;

  app.set("port", port);

  const server = http.createServer(app);

  server.listen(port);
});