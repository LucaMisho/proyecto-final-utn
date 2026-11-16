const express = require("express");
const router = express.Router();

const perfilController = require("../controllers/perfil.controllers");
const { autenticarToken } = require("../middleware/autenticacion");

router.get("/", autenticarToken, perfilController.verPerfil);
router.put("/", autenticarToken, perfilController.actualizarPerfil);

module.exports = router;