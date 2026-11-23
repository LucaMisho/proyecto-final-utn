const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioRepositorio = require("../data/usuarios.repositorio");
const { ErrorDeDatos, ErrorDeCredenciales, ErrorSinPermiso } = require("./errores");


// La clave puede llegar como "contrasena" o "contraseña"
function leerClave(datos) {
    return datos.contrasena ?? datos["contraseña"];
}

// Registrar
async function registrar(req, res, next) {
    try {
        // 1. Registrar usuario mediante el servicio
        const usuario = await authService.registrar(req.body);

        // 2. Generar token de verificación
        const token = jwt.sign(
            {
                email: usuario.email,
                tipo: "verificar"
            },
            process.env.JWT_SECRETO,
            { expiresIn: "24h" }
        );

        // 3. Enviar correo
        try {
            await enviarVerificacion(usuario.email, token);
        } catch (errorCorreo) {
            console.error(
                "No se pudo enviar el correo:",
                errorCorreo
            );
        }

        return res.status(201).json({
            mensaje: "Cuenta creada. Revisá tu correo para confirmarla."
        });

    } catch (error) {
        next(error);
    }
}


//IniciarSesion
async function iniciarSesion(username, clave) {
    if (!username || !clave) {
        throw new ErrorDeDatos("El usuario y la contraseña son obligatorios");
    }

    const usuario = await usuarioRepositorio.buscarPorUsername(username);

    console.log("Usuario encontrado:", !!usuario);
    console.log("Username recibido:", username);
    console.log("Hash guardado:", !!usuario?.contraseña);

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
