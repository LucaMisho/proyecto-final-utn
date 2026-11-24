const express = require("express");
const router = express.Router();

const noticiaController = require("../controllers/noticias.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");
const subirImagen = require("../middleware/subirImagen");

router.get("/", noticiaController.listar);
router.get("/admin/todas", autenticarToken, autorizarRol("ADMINISTRADOR"), noticiaController.listarTodas);
router.get("/:id", noticiaController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), subirImagen("imagen", "barrio-cultura/noticias"), noticiaController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), subirImagen("imagen", "barrio-cultura/noticias"), noticiaController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), noticiaController.borrar);

module.exports = router;
