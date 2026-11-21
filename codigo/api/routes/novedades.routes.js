const express = require("express");
const router = express.Router();

const controller = require("../controllers/novedades.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

// Lectura pública: la ve cualquiera en el Inicio
router.get("/", controller.listar);
router.get("/:id", controller.obtener);

// Alta, edición y baja: solo quien administra
// (copiá de otra ruta tuya cómo le pasás los roles a autorizarRol)
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), controller.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), controller.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), controller.eliminar);

module.exports = router;