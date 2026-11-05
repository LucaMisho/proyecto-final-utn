const seguimientoRepositorio = require("../data/seguimientos.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarSeguimientos()
async function listarSeguimientos() {
    return seguimientoRepositorio.listarSeguimientos();
}

//obtenerSeguimientoPorId()
async function obtenerSeguimiento(id) {
    const seguimiento = await seguimientoRepositorio.obtenerSeguimientoPorId(id);

    if (!seguimiento) {
        throw new ErrorNoEncontrado("Seguimiento no encontrado");
    }

    return seguimiento;
}

//crearSeguimiento()
async function crearSeguimiento(datos) {
    for (const campo of ["id_personal", "id_alumno", "observacion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return seguimientoRepositorio.crearSeguimiento(datos);
}

//actualizarSeguimiento
async function actualizarSeguimiento(id, datos) {
    const seguimiento = await seguimientoRepositorio.obtenerSeguimientoPorId(id);

    if (!seguimiento) {
        throw new ErrorNoEncontrado("Seguimiento no encontrado");
    }

    for (const campo of ["id_personal", "id_alumno", "observacion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return seguimientoRepositorio.actualizarSeguimiento(id, datos);
}

//borrarSeguimiento()
async function borrarSeguimiento(id) {
    const seguimiento = await seguimientoRepositorio.obtenerSeguimientoPorId(id);

    if (!seguimiento) {
        throw new ErrorNoEncontrado("Seguimiento no encontrado");
    }

    return seguimientoRepositorio.eliminarSeguimiento(id);
}

module.exports = {
    listarSeguimientos,
    obtenerSeguimiento,
    crearSeguimiento,
    actualizarSeguimiento,
    borrarSeguimiento
};
