const express = require("express");
const router = express.Router();

const asistenciaController = require("../controllers/asistencias.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), asistenciaController.listar);
router.get("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), asistenciaController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), asistenciaController.crear);
router.put("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), asistenciaController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), asistenciaController.borrar);

module.exports = router;
