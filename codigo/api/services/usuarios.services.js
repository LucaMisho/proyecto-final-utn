const bcrypt = require("bcryptjs");
const usuarioRepositorio = require("../data/usuarios.repositorio");
const jwt = require("jsonwebtoken");

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
    for (const campo of ["username", "email", "contraseña"]) {
        if (
            datos[campo] === undefined ||
            datos[campo] === null ||
            String(datos[campo]).trim() === ""
        ) {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    if (String(datos.contraseña).length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const contrasenaHash = await bcrypt.hash(
        String(datos.contraseña),
        10
    );

    return usuarioRepositorio.crearUsuario(datos, contrasenaHash);
}


//actualizarUsuario
async function actualizarUsuario(id, datos) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }

    for (const campo of ["username", "contraseña", "email"]) {

        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }
    const contrasenaHash = await bcrypt.hash(datos.contraseña, 10);

    return usuarioRepositorio.actualizarUsuario(id, datos, contrasenaHash);
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
    borrarUsuario,
};
