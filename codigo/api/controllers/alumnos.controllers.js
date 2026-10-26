const alumnoService = require("../services/alumnos.services");

// Listar todos: alumnos
async function listar(req, res) {
    try {
        const alumnos = await alumnoService.listarAlumnos();
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener alumno por ID
async function obtenerPorId(req, res) {
    try {
        const alumno = await alumnoService.obtenerAlumno(req.params.id);
        res.status(200).json(alumno);
    } catch (error) {
        const estado = error.message === "Alumno no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Crear un alumno
async function crear(req, res) {
    try {
        const alumno = await alumnoService.crearAlumno(req.body);
        res.status(201).json(alumno);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const estado = error.message === "Alumno no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
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
        const estado = error.message === "Alumno no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};
