const express = require("express");
const router = express.Router();

const asistenciaController = require("../controllers/asistencias.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

// Planillas: PERSONAL y ADMINISTRADOR
router.get(
  "/planilla/:idTaller/:anio/:mes",
  autenticarToken,
  autorizarRol("PERSONAL", "ADMINISTRADOR"),
  asistenciaController.obtenerPlanilla
);

router.put(
  "/planilla/:idTaller/:anio/:mes",
  autenticarToken,
  autorizarRol("PERSONAL", "ADMINISTRADOR"),
  asistenciaController.guardarPlanilla
);

// CRUD general: solamente ADMINISTRADOR
router.get("/", autenticarToken, autorizarRol("ADMINISTRADOR"), asistenciaController.listar);
router.get("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), asistenciaController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), asistenciaController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), asistenciaController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), asistenciaController.borrar);

module.exports = router;