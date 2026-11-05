const actividadRepositorio = require("../data/actividades.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarActividades()
async function listarActividades() {
    return actividadRepositorio.listarActividades();
}

//obtenerActividadPorId()
async function obtenerActividad(id) {
    const actividad = await actividadRepositorio.obtenerActividadPorId(id);

    if (!actividad) {
        throw new ErrorNoEncontrado("Actividad no encontrada");
    }

    return actividad;
}

//crearActividad()
async function crearActividad(datos) {
    for (const campo of ["id_taller", "id_barrio", "nombre", "fecha"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return actividadRepositorio.crearActividad(datos);
}

//actualizarActividad
async function actualizarActividad(id, datos) {
    const actividad = await actividadRepositorio.obtenerActividadPorId(id);

    if (!actividad) {
        throw new ErrorNoEncontrado("Actividad no encontrada");
    }

    for (const campo of ["id_taller", "id_barrio", "nombre", "fecha"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return actividadRepositorio.actualizarActividad(id, datos);
}

//borrarActividad()
async function borrarActividad(id) {
    const actividad = await actividadRepositorio.obtenerActividadPorId(id);

    if (!actividad) {
        throw new ErrorNoEncontrado("Actividad no encontrada");
    }

    return actividadRepositorio.eliminarActividad(id);
}

module.exports = {
    listarActividades,
    obtenerActividad,
    crearActividad,
    actualizarActividad,
    borrarActividad
};
