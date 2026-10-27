const alumnoService = require("../services/alumnos.services");
const { responderError } = require("../middleware/errores");

// Listar todos: alumnos
async function listar(req, res) {
    try {
        const alumnos = await alumnoService.listarAlumnos();
        res.status(200).json(alumnos);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener alumno por ID
async function obtenerPorId(req, res) {
    try {
        const alumno = await alumnoService.obtenerAlumno(req.params.id);
        res.status(200).json(alumno);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear un alumno
async function crear(req, res) {
    try {
        const alumno = await alumnoService.crearAlumno(req.body);
        res.status(201).json(alumno);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar un alumno
async function actualizar(req, res) {
    try {
        const alumno = await alumnoService.actualizarAlumno(
            req.params.id,
            req.body
        );
        res.status(200).json(alumno);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar un alumno
async function borrar(req, res) {
    try {
        await alumnoService.borrarAlumno(req.params.id);
        res.status(200).json({
            mensaje: "Alumno eliminado correctamente"
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
