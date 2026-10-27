const tallerService = require("../services/talleres.services");
const { responderError } = require("../middleware/errores");

// Listar todos: talleres
async function listar(req, res) {
    try {
        const talleres = await tallerService.listarTalleres();
        res.status(200).json(talleres);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener taller por ID
async function obtenerPorId(req, res) {
    try {
        const taller = await tallerService.obtenerTaller(req.params.id);
        res.status(200).json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear un taller
async function crear(req, res) {
    try {
        const taller = await tallerService.crearTaller(req.body);
        res.status(201).json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar un taller
async function actualizar(req, res) {
    try {
        const taller = await tallerService.actualizarTaller(
            req.params.id,
            req.body
        );
        res.status(200).json(taller);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar un taller
async function borrar(req, res) {
    try {
        await tallerService.borrarTaller(req.params.id);
        res.status(200).json({
            mensaje: "Taller eliminado correctamente"
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
