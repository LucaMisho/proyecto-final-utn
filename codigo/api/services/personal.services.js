const personalRepositorio = require("../data/personal.repositorio");

//listarPersonal()
async function listarPersonal() {
    return personalRepositorio.listarPersonal();
}

//obtenerPersonalPorId()
async function obtenerPersonal(id) {
    const personal = await personalRepositorio.obtenerPersonalPorId(id);

    if (!personal) {
        throw new Error("Personal no encontrado");
    }

    return personal;
}

//crearPersonal()
async function crearPersonal(datos) {
    for (const campo of ["id_usuario", "funcion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return personalRepositorio.crearPersonal(datos);
}

//actualizarPersonal
async function actualizarPersonal(id, datos) {
    const personal = await personalRepositorio.obtenerPersonalPorId(id);

    if (!personal) {
        throw new Error("Personal no encontrado");
    }

    for (const campo of ["id_usuario", "funcion"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return personalRepositorio.actualizarPersonal(id, datos);
}

//borrarPersonal()
async function borrarPersonal(id) {
    const personal = await personalRepositorio.obtenerPersonalPorId(id);

    if (!personal) {
        throw new Error("Personal no encontrado");
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
