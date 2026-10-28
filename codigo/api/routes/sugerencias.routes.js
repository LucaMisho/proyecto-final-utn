const express = require("express");
const router = express.Router();

const sugerenciaController = require("../controllers/sugerencias.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("ADMINISTRADOR"), sugerenciaController.listar);
router.get("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), sugerenciaController.obtenerPorId);
router.post("/", autenticarToken, sugerenciaController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), sugerenciaController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), sugerenciaController.borrar);

module.exports = router;
