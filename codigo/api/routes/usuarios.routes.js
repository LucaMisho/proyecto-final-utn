
const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarios.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.listar);

// Obtener usuarios con rol PERSONAL
router.get("/personal", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.listarPersonal);

router.get("/:id", autenticarToken, usuarioController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.crear);
router.patch("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.borrar);

module.exports = router;
