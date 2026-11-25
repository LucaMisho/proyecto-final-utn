
const seguimientoRepositorio = require("../data/seguimientos.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

const CAMPOS_OBLIGATORIOS = ["id_alumno", "id_usuario", "observacion"];

function validarDatos(datos) {
    for (const campo of CAMPOS_OBLIGATORIOS) {
        if (
            datos[campo] === undefined ||
            datos[campo] === null ||
            String(datos[campo]).trim() === ""
        ) {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }
}

// Listar seguimientos
async function listarSeguimientos() {
    return seguimientoRepositorio.listarSeguimientos();
}

// Obtener seguimiento
async function obtenerSeguimiento(id) {
    const seguimiento = await seguimientoRepositorio.obtenerSeguimientoPorId(id);

    if (!seguimiento) {
        throw new ErrorNoEncontrado("Seguimiento no encontrado");
    }

    return seguimiento;
}

// Crear seguimiento
async function crearSeguimiento(datos) {
    validarDatos(datos);

    const personal = await seguimientoRepositorio.obtenerPersonalPorId(
        datos.id_usuario
    );

    if (!personal) {
        throw new ErrorDeDatos(
            "El usuario seleccionado no existe o no tiene el rol PERSONAL"
        );
    }

    return seguimientoRepositorio.crearSeguimiento({
        id_usuario: datos.id_usuario,
        id_alumno: datos.id_alumno,
        fecha: datos.fecha,
        observacion: datos.observacion
    });
}

// Actualizar seguimiento
async function actualizarSeguimiento(id, datos) {
    const seguimiento = await seguimientoRepositorio.obtenerSeguimientoPorId(id);

    if (!seguimiento) {
        throw new ErrorNoEncontrado("Seguimiento no encontrado");
    }

    validarDatos({
        id_alumno: datos.id_alumno,
        id_usuario: seguimiento.id_usuario,
        observacion: datos.observacion
    });

    return seguimientoRepositorio.actualizarSeguimiento(id, {
        id_alumno: datos.id_alumno,
        fecha: datos.fecha,
        observacion: datos.observacion
    });
}

// Eliminar seguimiento
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
