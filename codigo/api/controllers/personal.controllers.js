const personalService = require("../services/personal.services");

// Listar todos: personal
async function listar(req, res) {
    try {
        const personal = await personalService.listarPersonal();
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener personal por ID
async function obtenerPorId(req, res) {
    try {
        const personal = await personalService.obtenerPersonal(req.params.id);
        res.status(200).json(personal);
    } catch (error) {
        const estado = error.message === "Personal no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Crear un personal
async function crear(req, res) {
    try {
        const personal = await personalService.crearPersonal(req.body);
        res.status(201).json(personal);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const estado = error.message === "Personal no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
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
        const estado = error.message === "Personal no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};
