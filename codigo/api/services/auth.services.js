const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioRepositorio = require("../data/usuarios.repositorio");


async function registrar(datos) {
    const { username, email, contraseña } = datos;

    if (!username || !email || !contraseña) {
        throw new Error("Todos los campos son obligatorios");
    }

    if (String(contraseña).length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const contrasenaHash = await bcrypt.hash(
        String(contraseña),
        10
    );

    return usuarioRepositorio.crearUsuario(
        datos,
        contrasenaHash
    );
}


//IniciarSesion
async function iniciarSesion(username, contraseña) {
    if (!username || !contraseña) {
        throw new Error("El usuario y la contraseña son obligatorios");
    }

    const usuario = await usuarioRepositorio.buscarPorUsername(username);

    if (!usuario) {
        throw new Error("Credenciales incorrectas");
    }

    const contrasenaValida = await bcrypt.compare(
        contraseña,
        usuario.contraseña
    );

    if (!contrasenaValida) {
        throw new Error("Credenciales incorrectas");
    }

    if (!usuario.estado) {
        throw new Error("La cuenta está inactiva");
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
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol
        }
    };
}

module.exports = { iniciarSesion, registrar};
