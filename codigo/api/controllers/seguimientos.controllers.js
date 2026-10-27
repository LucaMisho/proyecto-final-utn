const seguimientoService = require("../services/seguimientos.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const seguimientos = await seguimientoService.listarSeguimientos();
        res.status(200).json(seguimientos);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const seguimiento = await seguimientoService.obtenerSeguimiento(req.params.id);
        res.status(200).json(seguimiento);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const seguimiento = await seguimientoService.crearSeguimiento(req.body);
        res.status(201).json(seguimiento);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const seguimiento = await seguimientoService.actualizarSeguimiento(
            req.params.id,
            req.body
        );
        res.status(200).json(seguimiento);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await seguimientoService.borrarSeguimiento(req.params.id);
        res.status(200).json({
            mensaje: "Seguimiento eliminado correctamente"
        });
    } catch (error) {
        responderError(res, error);
    }
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};
