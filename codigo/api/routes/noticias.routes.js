const express = require("express");
const router = express.Router();

const noticiaController = require("../controllers/noticias.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", noticiaController.listar);
router.get("/:id", noticiaController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), noticiaController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), noticiaController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), noticiaController.borrar);

module.exports = router;
