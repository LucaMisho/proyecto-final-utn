const authService = require("../services/auth.services");
const { responderError } = require("../middleware/errores");
const jwt = require("jsonwebtoken");
const usuarioRepositorio = require("../data/usuarios.repositorio");
const { enviarVerificacion } = require("../services/correo");

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
// Registrar
async function registrar(req, res, next) {
    try {
        // El servicio valida los datos y cifra la contraseña
        const usuario = await authService.registrar(req.body);

        // Generar token de verificación
        const token = jwt.sign(
            {
                email: usuario.email,
                tipo: "verificar"
            },
            process.env.JWT_SECRETO,
            { expiresIn: "24h" }
        );

        // Enviar correo
        try {
            await enviarVerificacion(usuario.email, token);
        } catch (errorCorreo) {
            console.error(
                "No se pudo enviar el correo:",
                errorCorreo
            );
        }

        return res.status(201).json({
            mensaje: "Cuenta creada. Revisá tu correo para confirmarla."
        });

    } catch (error) {
        next(error);
    }
}

async function verificarCorreo(req, res, next) {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                mensaje: "Falta el token de verificación"
            });
        }

        const datos = jwt.verify(
            token,
            process.env.JWT_SECRETO
        );

        if (datos.tipo !== "verificar") {
            return res.status(400).json({
                mensaje: "Token inválido"
            });
        }

        const usuario = await usuarioRepositorio.verificarCorreo(
            datos.email
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "No se encontró el usuario"
            });
        }

        return res.status(200).json({
            mensaje: "¡Correo verificado correctamente!"
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {registrar, iniciarSesion, verificarCorreo};
