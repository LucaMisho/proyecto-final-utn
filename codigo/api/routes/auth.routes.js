const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controllers");

router.post("/registro", authController.registrar);
router.post("/login", authController.iniciarSesion);

module.exports = router;