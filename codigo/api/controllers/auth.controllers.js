const authService = require("../services/auth.services");
const { responderError } = require("../middleware/errores");

// Iniciar sesión
async function iniciarSesion(req, res) {
    try {
        const username = req.body.username;
        const clave = authService.leerClave(req.body);

        const resultado = await authService.iniciarSesion(
            username,
            clave
        );

        res.status(200).json(resultado);

    } catch (error) {
        responderError(res, error);
    }
}

//Registrar
async function registrar(req, res) {
    try {
        const usuario = await authService.registrar(req.body);

        res.status(201).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = {registrar, iniciarSesion};
