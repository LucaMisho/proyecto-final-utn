const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioRepositorio = require("../data/usuarios.repositorio");
const { ErrorDeDatos, ErrorDeCredenciales, ErrorSinPermiso } = require("./errores");


// La clave puede llegar como "contrasena" o "contraseña"
function leerClave(datos) {
    return datos.contrasena ?? datos["contraseña"];
}

async function registrar(datos) {
    const { username, email } = datos;
    const clave = leerClave(datos);

    if (!username || !email || !clave) {
        throw new ErrorDeDatos("Todos los campos son obligatorios");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
        throw new ErrorDeDatos("El email no es válido");
    }

    if (String(clave).length < 8) {
        throw new ErrorDeDatos("La contraseña debe tener al menos 8 caracteres");
    }

    const claveHash = await bcrypt.hash(
        String(clave),
        10
    );

    // El rol no se toma del pedido: quien se registra siempre es USUARIO
    return usuarioRepositorio.crearUsuario(
        { username, email },
        claveHash
    );
}


//IniciarSesion
async function iniciarSesion(username, clave) {
    if (!username || !clave) {
        throw new ErrorDeDatos("El usuario y la contraseña son obligatorios");
    }

    const usuario = await usuarioRepositorio.buscarPorUsername(username);

    if (!usuario) {
        throw new ErrorDeCredenciales("Credenciales incorrectas");
    }

    const claveValida = await bcrypt.compare(
        String(clave),
        usuario.contraseña
    );

    if (!claveValida) {
        throw new ErrorDeCredenciales("Credenciales incorrectas");
    }

    if (!usuario.estado) {
        throw new ErrorSinPermiso("La cuenta está inactiva");
    }

    const secreto = process.env.JWT_SECRETO;

    if (!secreto) {
        throw new Error("Falta configurar JWT_SECRETO");
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol
        },
        secreto,
        { expiresIn: "1h" }
    );

    return {
        mensaje: "Inicio de sesión exitoso",
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol
        }
    };
}

module.exports = { iniciarSesion, registrar, leerClave };
