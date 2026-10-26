const tallerRepositorio = require("../data/talleres.repositorio");

//listarTalleres()
async function listarTalleres() {
    return tallerRepositorio.listarTalleres();
}

//obtenerTallerPorId()
async function obtenerTaller(id) {
    const taller = await tallerRepositorio.obtenerTallerPorId(id);

    if (!taller) {
        throw new Error("Taller no encontrado");
    }

    return taller;
}

//crearTaller()
async function crearTaller(datos) {
    for (const campo of ["nombre", "id_barrio", "cupo"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return tallerRepositorio.crearTaller(datos);
}

//actualizarTaller
async function actualizarTaller(id, datos) {
    const taller = await tallerRepositorio.obtenerTallerPorId(id);

    if (!taller) {
        throw new Error("Taller no encontrado");
    }

    for (const campo of ["nombre", "id_barrio", "cupo"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return tallerRepositorio.actualizarTaller(id, datos);
}

//borrarTaller()
async function borrarTaller(id) {
    const taller = await tallerRepositorio.obtenerTallerPorId(id);

    if (!taller) {
        throw new Error("Taller no encontrado");
    }

    return tallerRepositorio.eliminarTaller(id);
}

module.exports = {
    listarTalleres,
    obtenerTaller,
    crearTaller,
    actualizarTaller,
    borrarTaller
};
