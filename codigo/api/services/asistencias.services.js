const asistenciaRepositorio = require("../data/asistencias.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarAsistencias()
async function listarAsistencias() {
    return asistenciaRepositorio.listarAsistencias();
}

//obtenerAsistenciaPorId()
async function obtenerAsistencia(id) {
    const asistencia = await asistenciaRepositorio.obtenerAsistenciaPorId(id);

    if (!asistencia) {
        throw new ErrorNoEncontrado("Asistencia no encontrada");
    }

    return asistencia;
}

//crearAsistencia()
async function crearAsistencia(datos) {
    for (const campo of ["id_alumno", "id_taller", "fecha"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return asistenciaRepositorio.crearAsistencia(datos);
}

//actualizarAsistencia
async function actualizarAsistencia(id, datos) {
    const asistencia = await asistenciaRepositorio.obtenerAsistenciaPorId(id);

    if (!asistencia) {
        throw new ErrorNoEncontrado("Asistencia no encontrada");
    }

    for (const campo of ["id_alumno", "id_taller", "fecha"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return asistenciaRepositorio.actualizarAsistencia(id, datos);
}

//borrarAsistencia()
async function borrarAsistencia(id) {
    const asistencia = await asistenciaRepositorio.obtenerAsistenciaPorId(id);

    if (!asistencia) {
        throw new ErrorNoEncontrado("Asistencia no encontrada");
    }

    return asistenciaRepositorio.eliminarAsistencia(id);
}

module.exports = {
    listarAsistencias,
    obtenerAsistencia,
    crearAsistencia,
    actualizarAsistencia,
    borrarAsistencia
};
