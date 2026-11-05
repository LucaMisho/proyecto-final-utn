const noticiaService = require("../services/noticias.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const noticias = await noticiaService.listarNoticias();
        res.status(200).json(noticias);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const noticia = await noticiaService.obtenerNoticia(req.params.id);
        res.status(200).json(noticia);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        const noticia = await noticiaService.crearNoticia(req.body);
        res.status(201).json(noticia);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const noticia = await noticiaService.actualizarNoticia(
            req.params.id,
            req.body
        );
        res.status(200).json(noticia);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await noticiaService.borrarNoticia(req.params.id);
        res.status(200).json({
            mensaje: "Noticia eliminada correctamente"
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
