const express = require("express");
const router = express.Router();

const actividadController = require("../controllers/actividades.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", actividadController.listar);
router.get("/:id", actividadController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), actividadController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), actividadController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), actividadController.borrar);

module.exports = router;
