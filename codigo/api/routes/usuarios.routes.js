
const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarios.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

// Rutas públicas
router.post("/", usuarioController.crear);
router.post("/login", usuarioController.iniciarSesion);

// Rutas que requieren iniciar sesión
router.get("/", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.listar);
router.get("/:id", autenticarToken, usuarioController.obtenerPorId);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), usuarioController.borrar);

module.exports = router;
