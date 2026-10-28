const redRepositorio = require("../data/redes.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarRedes()
async function listarRedes() {
    return redRepositorio.listarRedes();
}

//obtenerRedPorId()
async function obtenerRed(id) {
    const red = await redRepositorio.obtenerRedPorId(id);

    if (!red) {
        throw new ErrorNoEncontrado("Red social no encontrada");
    }

    return red;
}

//crearRed()
async function crearRed(datos) {
    for (const campo of ["id_sede", "tipo", "url"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return redRepositorio.crearRed(datos);
}

//actualizarRed
async function actualizarRed(id, datos) {
    const red = await redRepositorio.obtenerRedPorId(id);

    if (!red) {
        throw new ErrorNoEncontrado("Red social no encontrada");
    }

    for (const campo of ["id_sede", "tipo", "url"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return redRepositorio.actualizarRed(id, datos);
}

//borrarRed()
async function borrarRed(id) {
    const red = await redRepositorio.obtenerRedPorId(id);

    if (!red) {
        throw new ErrorNoEncontrado("Red social no encontrada");
    }

    return redRepositorio.eliminarRed(id);
}

module.exports = {
    listarRedes,
    obtenerRed,
    crearRed,
    actualizarRed,
    borrarRed
};
