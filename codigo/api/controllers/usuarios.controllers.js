const usuarioService = require("../services/usuarios.services");

// Listar todos: usuarios
async function listar(req, res) {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener usuario por ID
async function obtenerPorId(req, res) {
    try {
        const usuario = await usuarioService.obtenerUsuario(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        const estado = error.message === "Usuario no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Crear un usuario
async function crear(req, res) {
    try {
        const usuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar un usuario
async function actualizar(req, res) {
    try {
        const usuario = await usuarioService.actualizarUsuario(
            req.params.id,
            req.body
        );
        res.status(200).json(usuario);
    } catch (error) {
        const estado = error.message === "Usuario no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Eliminar un usuario
async function borrar(req, res) {
    try {
        await usuarioService.borrarUsuario(req.params.id);
        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });
    } catch (error) {
        const estado = error.message === "Usuario no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Iniciar sesión
async function iniciarSesion(req, res) {
    try {
        const { username, contrasena } = req.body;

        const resultado = await usuarioService.iniciarSesion(
            username,
            contrasena
        );

        res.status(200).json(resultado);

    } catch (error) {
        if (error.message === "El usuario y la contraseña son obligatorios") {
            return res.status(400).json({ mensaje: error.message });
        }

        if (error.message === "Credenciales incorrectas") {
            return res.status(401).json({ mensaje: error.message });
        }

        if (error.message === "La cuenta está inactiva") {
            return res.status(403).json({ mensaje: error.message });
        }

        console.error(error);
        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
}


module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    borrar,
    iniciarSesion
};
