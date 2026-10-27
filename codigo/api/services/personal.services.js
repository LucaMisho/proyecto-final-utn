const personalRepositorio = require("../data/personal.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarPersonal()
async function listarPersonal() {
    return personalRepositorio.listarPersonal();
}

//obtenerPersonalPorId()
async function obtenerPersonal(id) {
    const personal = await personalRepositorio.obtenerPersonalPorId(id);

    if (!personal) {
        throw new ErrorNoEncontrado("Personal no encontrado");
    }

    return personal;
}

//crearPersonal()
async function crearPersonal(datos) {
    for (const campo of ["id_usuario", "nombre", "apellido", "dni", "funcion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return personalRepositorio.crearPersonal(datos);
}

//actualizarPersonal
async function actualizarPersonal(id, datos) {
    const personal = await personalRepositorio.obtenerPersonalPorId(id);

    if (!personal) {
        throw new ErrorNoEncontrado("Personal no encontrado");
    }

    for (const campo of ["id_usuario", "nombre", "apellido", "dni", "funcion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return personalRepositorio.actualizarPersonal(id, datos);
}

//borrarPersonal()
async function borrarPersonal(id) {
    const personal = await personalRepositorio.obtenerPersonalPorId(id);

    if (!personal) {
        throw new ErrorNoEncontrado("Personal no encontrado");
    }

    return personalRepositorio.eliminarPersonal(id);
}

module.exports = {
    listarPersonal,
    obtenerPersonal,
    crearPersonal,
    actualizarPersonal,
    borrarPersonal
};
