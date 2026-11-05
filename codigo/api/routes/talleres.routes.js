const express = require("express");
const router = express.Router();

const tallerController = require("../controllers/talleres.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", tallerController.listar);
router.get("/:id", tallerController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), tallerController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), tallerController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), tallerController.borrar);

module.exports = router;
