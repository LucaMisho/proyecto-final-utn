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
    for (const campo of ["username", "nombre", "apellido", "email", "contrasena"]) {
        if (String(datos.contrasena).length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }
        
    for (const campo of ["username", "email", "contraseña"]) {
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

//iniciarSesion()
async function iniciarSesion(username, contrasena) {
    if (!username || !contrasena) {
        throw new Error("El usuario y la contraseña son obligatorios");
    }

    const usuario = await usuarioRepositorio.buscarPorUsername(username);

    if (!usuario) {
        throw new Error("Credenciales incorrectas");
    }

    const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena
    );

    if (!contrasenaValida) {
        throw new Error("Credenciales incorrectas");
    }

    if (!usuario.estado) {
        throw new Error("La cuenta está inactiva");
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol
        },
        process.env.JWT_SECRETO,
        { expiresIn: "1h" }
    );

    return {
        mensaje: "Inicio de sesión exitoso",
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol
        }
    };
}


module.exports = {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    iniciarSesion
};
