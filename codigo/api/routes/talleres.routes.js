const express = require("express");
const router = express.Router();

const tallerController = require("../controllers/talleres.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");
const subirImagen = require("../middleware/subirImagen");

router.get("/", tallerController.listar);
router.get("/:id", tallerController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"),  subirImagen("imagen", "barrio-cultura/talleres"), tallerController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), subirImagen("imagen", "barrio-cultura/talleres"),tallerController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), tallerController.borrar);

module.exports = router;
