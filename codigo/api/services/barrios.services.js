const barrioRepositorio = require("../data/barrios.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarBarrios()
async function listarBarrios() {
    return barrioRepositorio.listarBarrios();
}

//obtenerBarrioPorId()
async function obtenerBarrio(id) {
    const barrio = await barrioRepositorio.obtenerBarrioPorId(id);

    if (!barrio) {
        throw new ErrorNoEncontrado("Barrio no encontrado");
    }

    return barrio;
}

//crearBarrio()
async function crearBarrio(datos) {
    if (!datos.nombre || !String(datos.nombre).trim()) {
        throw new ErrorDeDatos("El nombre del barrio es obligatorio");
    }

    return barrioRepositorio.crearBarrio(
        String(datos.nombre).trim(),
        datos.descripcion ?? null
    );
}

//actualizarBarrio
async function actualizarBarrio(id, datos) {
    const barrio = await barrioRepositorio.obtenerBarrioPorId(id);

    if (!barrio) {
        throw new ErrorNoEncontrado("Barrio no encontrado");
    }

    if (!datos.nombre || !String(datos.nombre).trim()) {
        throw new ErrorDeDatos("El nombre del barrio es obligatorio");
    }

    return barrioRepositorio.actualizarBarrio(
        id,
        String(datos.nombre).trim(),
        datos.descripcion ?? null
    );
}

//borrarBarrio()
async function borrarBarrio(id) {
    const barrio = await barrioRepositorio.obtenerBarrioPorId(id);

    if (!barrio) {
        throw new ErrorNoEncontrado("Barrio no encontrado");
    }

    return barrioRepositorio.eliminarBarrio(id);
}

module.exports = {
    listarBarrios,
    obtenerBarrio,
    crearBarrio,
    actualizarBarrio,
    borrarBarrio
};