const express = require("express");
const router = express.Router();

const redController = require("../controllers/redes.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", redController.listar);
router.get("/:id", redController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), redController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), redController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), redController.borrar);

module.exports = router;
