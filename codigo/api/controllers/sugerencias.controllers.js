const sugerenciaService = require("../services/sugerencias.services");
const { responderError } = require("../middleware/errores");

// Listar todos
async function listar(req, res) {
    try {
        const sugerencias = await sugerenciaService.listarSugerencias();
        res.status(200).json(sugerencias);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener por ID
async function obtenerPorId(req, res) {
    try {
        const sugerencia = await sugerenciaService.obtenerSugerencia(req.params.id);
        res.status(200).json(sugerencia);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear
async function crear(req, res) {
    try {
        // El autor de la sugerencia es el usuario de la sesión, no lo que mande el cliente
        req.body.id_usuario = req.usuario.id_usuario;
        const sugerencia = await sugerenciaService.crearSugerencia(req.body);
        res.status(201).json(sugerencia);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar
async function actualizar(req, res) {
    try {
        const sugerencia = await sugerenciaService.actualizarSugerencia(
            req.params.id,
            req.body
        );
        res.status(200).json(sugerencia);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar
async function borrar(req, res) {
    try {
        await sugerenciaService.borrarSugerencia(req.params.id);
        res.status(200).json({
            mensaje: "Sugerencia eliminada correctamente"
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
