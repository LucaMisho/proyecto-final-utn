const sugerenciaRepositorio = require("../data/sugerencias.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarSugerencias()
async function listarSugerencias() {
    return sugerenciaRepositorio.listarSugerencias();
}

//obtenerSugerenciaPorId()
async function obtenerSugerencia(id) {
    const sugerencia = await sugerenciaRepositorio.obtenerSugerenciaPorId(id);

    if (!sugerencia) {
        throw new ErrorNoEncontrado("Sugerencia no encontrada");
    }

    return sugerencia;
}

//crearSugerencia()
async function crearSugerencia(datos) {
    for (const campo of ["id_usuario", "mensaje"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return sugerenciaRepositorio.crearSugerencia(datos);
}

//actualizarSugerencia
async function actualizarSugerencia(id, datos) {
    const sugerencia = await sugerenciaRepositorio.obtenerSugerenciaPorId(id);

    if (!sugerencia) {
        throw new ErrorNoEncontrado("Sugerencia no encontrada");
    }

    for (const campo of ["id_usuario", "mensaje"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return sugerenciaRepositorio.actualizarSugerencia(id, datos);
}

//borrarSugerencia()
async function borrarSugerencia(id) {
    const sugerencia = await sugerenciaRepositorio.obtenerSugerenciaPorId(id);

    if (!sugerencia) {
        throw new ErrorNoEncontrado("Sugerencia no encontrada");
    }

    return sugerenciaRepositorio.eliminarSugerencia(id);
}

module.exports = {
    listarSugerencias,
    obtenerSugerencia,
    crearSugerencia,
    actualizarSugerencia,
    borrarSugerencia
};
