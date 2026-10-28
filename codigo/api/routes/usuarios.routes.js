const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarios.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.listar);
router.get("/:id", autenticarToken, usuarioController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.borrar);

module.exports = router;
