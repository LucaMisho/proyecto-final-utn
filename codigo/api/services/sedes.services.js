const sedeRepositorio = require("../data/sedes.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarSedes()
async function listarSedes() {
    return sedeRepositorio.listarSedes();
}

//obtenerSedePorId()
async function obtenerSede(id) {
    const sede = await sedeRepositorio.obtenerSedePorId(id);

    if (!sede) {
        throw new ErrorNoEncontrado("Sede no encontrada");
    }

    return sede;
}

//crearSede()
async function crearSede(datos) {
    for (const campo of ["nombre", "direccion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return sedeRepositorio.crearSede(datos);
}

//actualizarSede
async function actualizarSede(id, datos) {
    const sede = await sedeRepositorio.obtenerSedePorId(id);

    if (!sede) {
        throw new ErrorNoEncontrado("Sede no encontrada");
    }

    for (const campo of ["nombre", "direccion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return sedeRepositorio.actualizarSede(id, datos);
}

//borrarSede()
async function borrarSede(id) {
    const sede = await sedeRepositorio.obtenerSedePorId(id);

    if (!sede) {
        throw new ErrorNoEncontrado("Sede no encontrada");
    }

    return sedeRepositorio.eliminarSede(id);
}

module.exports = {
    listarSedes,
    obtenerSede,
    crearSede,
    actualizarSede,
    borrarSede
};
