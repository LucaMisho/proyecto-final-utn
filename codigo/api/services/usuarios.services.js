const bcrypt = require("bcryptjs");
const usuarioRepositorio = require("../data/usuarios.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

const ROLES = ["USUARIO", "PERSONAL", "ADMINISTRADOR"];

// La clave puede llegar como "contrasena" o "contraseña"
function leerClave(datos) {
    return datos.contrasena ?? datos["contraseña"];
}

function validarRol(rol) {
    if (rol !== undefined && rol !== null && !ROLES.includes(rol)) {
        throw new ErrorDeDatos(`El rol tiene que ser uno de: ${ROLES.join(", ")}`);
    }
}

function validarEstado(estado) {
    if (estado !== undefined && estado !== null && typeof estado !== "boolean") {
        throw new ErrorDeDatos("El estado tiene que ser true o false");
    }
}

//listarUsuarios()
async function listarUsuarios() {
    return usuarioRepositorio.listarUsuarios();
}

//obtenerUsuarioPorId()
async function obtenerUsuario(id) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new ErrorNoEncontrado("Usuario no encontrado");
    }

    return usuario;
}

//crearUsuario()
async function crearUsuario(datos) {
    for (const campo of ["username", "email"]) {
        if (
            datos[campo] === undefined ||
            datos[campo] === null ||
            String(datos[campo]).trim() === ""
        ) {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    const clave = leerClave(datos);

    if (clave === undefined || clave === null || String(clave).trim() === "") {
        throw new ErrorDeDatos("El campo contrasena es obligatorio");
    }

    if (String(clave).length < 8) {
        throw new ErrorDeDatos("La contraseña debe tener al menos 8 caracteres");
    }

    validarRol(datos.rol);

    const claveHash = await bcrypt.hash(String(clave), 10);

    return usuarioRepositorio.crearUsuario(datos, claveHash);
}


//actualizarUsuario
async function actualizarUsuario(id, datos) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new ErrorNoEncontrado("Usuario no encontrado");
    }

    for (const campo of ["username", "email"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    validarRol(datos.rol);
    validarEstado(datos.estado);

    // La contraseña solo se cambia si viene en el pedido
    const clave = leerClave(datos);
    let claveHash = null;

    if (clave !== undefined && clave !== null && String(clave) !== "") {
        if (String(clave).length < 8) {
            throw new ErrorDeDatos("La contraseña debe tener al menos 8 caracteres");
        }
        claveHash = await bcrypt.hash(String(clave), 10);
    }

    return usuarioRepositorio.actualizarUsuario(id, datos, claveHash);
}

//borrarUsuario()
async function borrarUsuario(id) {
    const usuario = await usuarioRepositorio.obtenerUsuarioPorId(id);

    if (!usuario) {
        throw new ErrorNoEncontrado("Usuario no encontrado");
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
