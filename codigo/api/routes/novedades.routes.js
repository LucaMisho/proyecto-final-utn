const express = require("express");
const router = express.Router();

const novedadesController = require("../controllers/novedades.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");
const subirImagen = require("../middleware/subirImagen");

// Lectura pública: la ve cualquiera en el Inicio
router.get("/", novedadesController.listar);
router.get("/:id", novedadesController.obtener);

// Alta, edición y baja: solo quien administra
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR", "PERSONAL"), subirImagen("imagen", "barrio-cultura/noticias"), novedadesController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR", "PERSONAL"), subirImagen("imagen", "barrio-cultura/noticias"), novedadesController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), novedadesController.eliminar);

module.exports = router;