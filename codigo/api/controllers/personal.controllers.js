const personalService = require("../services/personal.services");
const { responderError } = require("../middleware/errores");

// Listar todos: personal
async function listar(req, res) {
    try {
        const personal = await personalService.listarPersonal();
        res.status(200).json(personal);
    } catch (error) {
        responderError(res, error);
    }
}

// Obtener personal por ID
async function obtenerPorId(req, res) {
    try {
        const personal = await personalService.obtenerPersonal(req.params.id);
        res.status(200).json(personal);
    } catch (error) {
        responderError(res, error);
    }
}

// Crear un personal
async function crear(req, res) {
    try {
        const personal = await personalService.crearPersonal(req.body);
        res.status(201).json(personal);
    } catch (error) {
        responderError(res, error);
    }
}

// Actualizar un personal
async function actualizar(req, res) {
    try {
        const personal = await personalService.actualizarPersonal(
            req.params.id,
            req.body
        );
        res.status(200).json(personal);
    } catch (error) {
        responderError(res, error);
    }
}

// Eliminar un personal
async function borrar(req, res) {
    try {
        await personalService.borrarPersonal(req.params.id);
        res.status(200).json({
            mensaje: "Personal eliminado correctamente"
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
