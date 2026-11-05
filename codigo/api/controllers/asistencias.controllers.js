const asistenciaService = require("../services/asistencias.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const asistencias = await asistenciaService.listarAsistencias();
        res.status(200).json(asistencias);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const asistencia = await asistenciaService.obtenerAsistencia(req.params.id);
        res.status(200).json(asistencia);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const asistencia = await asistenciaService.crearAsistencia(req.body);
        res.status(201).json(asistencia);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const asistencia = await asistenciaService.actualizarAsistencia(
            req.params.id,
            req.body
        );
        res.status(200).json(asistencia);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await asistenciaService.borrarAsistencia(req.params.id);
        res.status(200).json({
            mensaje: "Asistencia eliminada correctamente"
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
