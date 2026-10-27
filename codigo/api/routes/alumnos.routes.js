const express = require("express");
const router = express.Router();

const alumnoController = require("../controllers/alumnos.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), alumnoController.listar);
router.get("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), alumnoController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), alumnoController.crear);
router.put("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), alumnoController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), alumnoController.borrar);

module.exports = router;
