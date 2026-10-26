const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarios.controllers");

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.obtenerPorId);
router.post("/", usuarioController.crear);
router.put("/:id", usuarioController.actualizar);
router.delete("/:id", usuarioController.borrar);

module.exports = router;
