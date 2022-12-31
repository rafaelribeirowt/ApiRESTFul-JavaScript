const express = require("express");
const controller = require("../controller/controllerCliente");
const { eAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get('/clientes/:id', eAdmin, controller.buscarUm);

router.get("/clientes", eAdmin, controller.buscarTodos);

router.post("/clientes", controller.criar);

router.put("/clientes/:id", controller.atualizar);

router.delete("/clientes/:id", controller.excluir);

router.post("/login", controller.login);

router.post("/transferir/:id/:value",eAdmin, controller.transferir);


module.exports = router;
