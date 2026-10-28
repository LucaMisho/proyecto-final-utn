const sedeService = require("../services/sedes.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const sedes = await sedeService.listarSedes();
        res.status(200).json(sedes);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const sede = await sedeService.obtenerSede(req.params.id);
        res.status(200).json(sede);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const sede = await sedeService.crearSede(req.body);
        res.status(201).json(sede);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const sede = await sedeService.actualizarSede(
            req.params.id,
            req.body
        );
        res.status(200).json(sede);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await sedeService.borrarSede(req.params.id);
        res.status(200).json({
            mensaje: "Sede eliminada correctamente"
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
