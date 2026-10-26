const express = require("express");
const router = express.Router();

const barrioController = require("../controllers/barrios.controllers");

router.get("/", barrioController.listar);
router.get("/:id", barrioController.obtenerPorId);
router.post("/", barrioController.crear);
router.put("/:id", barrioController.actualizar);
router.delete("/:id", barrioController.borrar);

module.exports = router;
