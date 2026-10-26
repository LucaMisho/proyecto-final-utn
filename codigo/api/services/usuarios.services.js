const bcrypt = require("bcryptjs");
const usuarioRepositorio = require("../data/usuarios.repositorio");

//listarUsuarios()
async function listarUsuarios() {
    return usuarioRepositorio.listarUsuarios();
}

//obtenerUsuarioPorId()
async function obtenerUsuario(id) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    return usuario;
}

//crearUsuario()
async function crearUsuario(datos) {
    for (const campo of ["username", "nombre", "apellido", "email", "contrasena"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return usuarioRepositorio.crearUsuario(datos, await bcrypt.hash(String(datos.contrasena), 10));
}

//actualizarUsuario
async function actualizarUsuario(id, datos) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    for (const campo of ["username", "nombre", "apellido", "email"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return usuarioRepositorio.actualizarUsuario(id, datos);
}

//borrarUsuario()
async function borrarUsuario(id) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    return usuarioRepositorio.eliminarUsuario(id);
}

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};
