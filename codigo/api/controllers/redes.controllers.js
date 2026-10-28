const redService = require("../services/redes.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const redes = await redService.listarRedes();
        res.status(200).json(redes);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const red = await redService.obtenerRed(req.params.id);
        res.status(200).json(red);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const red = await redService.crearRed(req.body);
        res.status(201).json(red);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const red = await redService.actualizarRed(
            req.params.id,
            req.body
        );
        res.status(200).json(red);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await redService.borrarRed(req.params.id);
        res.status(200).json({
            mensaje: "Red social eliminada correctamente"
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
