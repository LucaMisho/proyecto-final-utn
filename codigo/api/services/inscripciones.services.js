const inscripcionRepositorio = require("../data/inscripciones.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarInscripciones()
async function listarInscripciones() {
    return inscripcionRepositorio.listarInscripciones();
}

//obtenerInscripcionPorId()
async function obtenerInscripcion(id) {
    const inscripcion = await inscripcionRepositorio.obtenerInscripcionPorId(id);

    if (!inscripcion) {
        throw new ErrorNoEncontrado("Inscripción no encontrada");
    }

    return inscripcion;
}

//crearInscripcion()
async function crearInscripcion(datos) {
    for (const campo of ["id_alumno", "id_taller"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return inscripcionRepositorio.crearInscripcion(datos);
}

//actualizarInscripcion
async function actualizarInscripcion(id, datos) {
    const inscripcion = await inscripcionRepositorio.obtenerInscripcionPorId(id);

    if (!inscripcion) {
        throw new ErrorNoEncontrado("Inscripción no encontrada");
    }

    for (const campo of ["id_alumno", "id_taller"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return inscripcionRepositorio.actualizarInscripcion(id, datos);
}

//borrarInscripcion()
async function borrarInscripcion(id) {
    const inscripcion = await inscripcionRepositorio.obtenerInscripcionPorId(id);

    if (!inscripcion) {
        throw new ErrorNoEncontrado("Inscripción no encontrada");
    }

    return inscripcionRepositorio.eliminarInscripcion(id);
}

module.exports = {
    listarInscripciones,
    obtenerInscripcion,
    crearInscripcion,
    actualizarInscripcion,
    borrarInscripcion
};
