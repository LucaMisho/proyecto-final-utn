const express = require("express");
const router = express.Router();

const seguimientoController = require("../controllers/seguimientos.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), seguimientoController.listar);
router.get("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), seguimientoController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), seguimientoController.crear);
router.put("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), seguimientoController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), seguimientoController.borrar);

module.exports = router;
