const barrioService = require("../services/barrios.services");
const { responderError } = require("../middleware/errores");

// Listar todos los barrios
async function listar(req, res) {
    try {
        const barrios = await barrioService.listarBarrios();
        res.status(200).json(barrios);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener un barrio por ID
async function obtenerPorId(req, res) {
    try {
        const barrio = await barrioService.obtenerBarrio(req.params.id);
        res.status(200).json(barrio);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear un barrio
async function crear(req, res) {
    try {
        const barrio = await barrioService.crearBarrio(req.body);
        res.status(201).json(barrio);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar un barrio
async function actualizar(req, res) {
    try {
        const barrio = await barrioService.actualizarBarrio(
            req.params.id,
            req.body
        );
        res.status(200).json(barrio);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar un barrio
async function borrar(req, res) {
    try {
        await barrioService.borrarBarrio(req.params.id);
        res.status(200).json({
            mensaje: "Barrio eliminado correctamente"
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
