const express = require("express");
const router = express.Router();

const alumnoController = require("../controllers/alumnos.controllers");

router.get("/", alumnoController.listar);
router.get("/:id", alumnoController.obtenerPorId);
router.post("/", alumnoController.crear);
router.put("/:id", alumnoController.actualizar);
router.delete("/:id", alumnoController.borrar);

module.exports = router;
