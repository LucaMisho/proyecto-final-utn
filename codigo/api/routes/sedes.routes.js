const express = require("express");
const router = express.Router();

const sedeController = require("../controllers/sedes.controllers");
const { autenticarToken, autorizarRol } = require("../middleware/autenticacion");

router.get("/", sedeController.listar);
router.get("/:id", sedeController.obtenerPorId);
router.post("/", autenticarToken, autorizarRol("ADMINISTRADOR"), sedeController.crear);
router.put("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), sedeController.actualizar);
router.delete("/:id", autenticarToken, autorizarRol("ADMINISTRADOR"), sedeController.borrar);

module.exports = router;
