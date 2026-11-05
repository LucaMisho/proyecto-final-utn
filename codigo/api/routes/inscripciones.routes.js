const express = require("express");
const router = express.Router();

const inscripcionController = require("../controllers/inscripciones.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), inscripcionController.listar);
router.get("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), inscripcionController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), inscripcionController.crear);
router.put("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), inscripcionController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), inscripcionController.borrar);

module.exports = router;
