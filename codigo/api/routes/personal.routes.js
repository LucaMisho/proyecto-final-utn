const express = require("express");
const router = express.Router();

const personalController = require("../controllers/personal.controllers");

router.get("/", personalController.listar);
router.get("/:id", personalController.obtenerPorId);
router.post("/", personalController.crear);
router.put("/:id", personalController.actualizar);
router.delete("/:id", personalController.borrar);

module.exports = router;
