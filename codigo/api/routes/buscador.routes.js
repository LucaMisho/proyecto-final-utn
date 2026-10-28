//buscador.routes.js
const express = require("express");
const router = express.Router();

const buscadorController = require("../controllers/buscador.controllers");

router.get("/", buscadorController.buscar);

module.exports = router;