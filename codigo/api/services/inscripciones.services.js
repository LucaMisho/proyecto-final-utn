const inscripcionRepositorio = require("../data/inscripciones.repositorio");
const tallerRepositorio = require("../data/talleres.repositorio");
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

async function exigirCupo(idTaller, excluirInscripcion) {
    const taller = await tallerRepositorio.obtenerTallerPorId(idTaller);

    if (!taller) {
        throw new ErrorNoEncontrado("Taller no encontrado");
    }

    if (taller.cupo === null || taller.cupo === undefined) return;

    const ocupados = await inscripcionRepositorio.contarAceptadasDelTaller(idTaller, excluirInscripcion);

    if (ocupados >= taller.cupo) {
        throw new ErrorDeDatos(`El taller ${taller.nombre} no tiene cupos disponibles (${ocupados} de ${taller.cupo})`);
    }
}

//crearInscripcion()
async function crearInscripcion(datos) {
    for (const campo of ["id_alumno", "id_taller"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    if ((datos.estado ?? "aceptada") === "aceptada") {
        await exigirCupo(datos.id_taller, null);
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

    const quedaAceptada = (datos.estado ?? "aceptada") === "aceptada";
    const yaOcupabaLugar = inscripcion.estado === "aceptada" && Number(inscripcion.id_taller) === Number(datos.id_taller);

    if (quedaAceptada && !yaOcupabaLugar) {
        await exigirCupo(datos.id_taller, id);
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
