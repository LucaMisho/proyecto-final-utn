const barrioRepositorio = require("../data/barrios.repositorio");

//listarBarrios()
async function listarBarrios() {
    return barrioRepositorio.listarBarrios();
}

//obtenerBarrioPorId()
async function obtenerBarrio(id) {
    const barrio = await barrioRepositorio.obtenerBarrioPorId(id);

    if (!barrio) {
        throw new Error("Barrio no encontrado");
    }

    return barrio;
}

//crearBarrio()
async function crearBarrio(datos) {
    if (!datos.nombre || !datos.nombre.trim()) {
        throw new Error("El nombre del barrio es obligatorio");
    }

    return barrioRepositorio.crearBarrio(
        datos.nombre.trim(),
        datos.descripcion ?? null
    );
}

//actualizarBarrio
async function actualizarBarrio(id, datos) {
    const barrio = await barrioRepositorio.obtenerBarrioPorId(id);

    if (!barrio) {
        throw new Error("Barrio no encontrado");
    }

    if (!datos.nombre || !datos.nombre.trim()) {
        throw new Error("El nombre del barrio es obligatorio");
    }

    return barrioRepositorio.actualizarBarrio(
        id,
        datos.nombre.trim(),
        datos.descripcion ?? null
    );
}

//borrarBarrio()
async function borrarBarrio(id) {
    const barrio = await barrioRepositorio.obtenerBarrioPorId(id);

    if (!barrio) {
        throw new Error("Barrio no encontrado");
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