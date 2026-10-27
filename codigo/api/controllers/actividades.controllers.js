const actividadService = require("../services/actividades.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const actividades = await actividadService.listarActividades();
        res.status(200).json(actividades);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const actividad = await actividadService.obtenerActividad(req.params.id);
        res.status(200).json(actividad);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const actividad = await actividadService.crearActividad(req.body);
        res.status(201).json(actividad);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const actividad = await actividadService.actualizarActividad(
            req.params.id,
            req.body
        );
        res.status(200).json(actividad);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await actividadService.borrarActividad(req.params.id);
        res.status(200).json({
            mensaje: "Actividad eliminada correctamente"
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
