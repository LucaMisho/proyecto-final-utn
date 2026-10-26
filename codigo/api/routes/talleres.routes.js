const express = require("express");
const router = express.Router();

const tallerController = require("../controllers/talleres.controllers");

router.get("/", tallerController.listar);
router.get("/:id", tallerController.obtenerPorId);
router.post("/", tallerController.crear);
router.put("/:id", tallerController.actualizar);
router.delete("/:id", tallerController.borrar);

module.exports = router;
