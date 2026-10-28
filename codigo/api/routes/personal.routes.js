const express = require("express");
const router = express.Router();

const personalController = require("../controllers/personal.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), personalController.listar);
router.get("/:id", autenticarToken, autorizarRol("PERSONAL", "ADMINISTRADOR"), personalController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), personalController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), personalController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), personalController.borrar);

module.exports = router;
