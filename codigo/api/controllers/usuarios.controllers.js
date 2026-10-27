const usuarioService = require("../services/usuarios.services");
const { responderError } = require("../middleware/errores");

// Listar todos: usuarios
async function listar(req, res) {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener usuario por ID
async function obtenerPorId(req, res) {
    try {
        // Un usuario solo puede ver su propia cuenta; el administrador ve cualquiera
        if (req.usuario.rol !== "ADMINISTRADOR" && String(req.usuario.id_usuario) !== String(req.params.id)) {
            return res.status(403).json({ error: "No tienes permisos para realizar esta acción" });
        }

        const usuario = await usuarioService.obtenerUsuario(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear un usuario
async function crear(req, res) {
    try {
        const usuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        responderError(res, error);
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
        responderError(res, error);
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
        responderError(res, error);
    }
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};
