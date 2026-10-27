const authService = require("../services/auth.services");

// Iniciar sesión
async function iniciarSesion(req, res) {
    try {
        const { username, contraseña } = req.body;

        const resultado = await authService.iniciarSesion(
            username,
            contraseña
        );

        res.status(200).json(resultado);

    } catch (error) {
        if (error.message === "El usuario y la contraseña son obligatorios") {
            return res.status(400).json({ mensaje: error.message });
        }

        if (error.message === "Credenciales incorrectas") {
            return res.status(401).json({ mensaje: error.message });
        }

        if (error.message === "La cuenta está inactiva") {
            return res.status(403).json({ mensaje: error.message });
        }

        console.error(error);
        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
}

//Registrar
async function registrar(req, res) {
    try {
        const usuario = await authService.registrar(req.body);

        res.status(201).json(usuario);
    } catch (error) {
        if (error.message.includes("obligatorio") ||
            error.message.includes("al menos 8 caracteres")) {
            return res.status(400).json({ mensaje: error.message });
        }

        console.error(error);
        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
}

module.exports = {registrar, iniciarSesion};