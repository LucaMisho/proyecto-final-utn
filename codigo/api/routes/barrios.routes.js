const express = require("express");
const router = express.Router();

const barrioController = require("../controllers/barrios.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", barrioController.listar);
router.get("/:id", barrioController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), barrioController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), barrioController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), barrioController.borrar);

module.exports = router;
