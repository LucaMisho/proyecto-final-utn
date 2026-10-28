const inscripcionService = require("../services/inscripciones.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const inscripciones = await inscripcionService.listarInscripciones();
        res.status(200).json(inscripciones);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const inscripcion = await inscripcionService.obtenerInscripcion(req.params.id);
        res.status(200).json(inscripcion);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const inscripcion = await inscripcionService.crearInscripcion(req.body);
        res.status(201).json(inscripcion);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const inscripcion = await inscripcionService.actualizarInscripcion(
            req.params.id,
            req.body
        );
        res.status(200).json(inscripcion);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await inscripcionService.borrarInscripcion(req.params.id);
        res.status(200).json({
            mensaje: "Inscripción eliminada correctamente"
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
