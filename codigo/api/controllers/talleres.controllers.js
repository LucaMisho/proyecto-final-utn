const tallerService = require("../services/talleres.services");

// Listar todos: talleres
async function listar(req, res) {
    try {
        const talleres = await tallerService.listarTalleres();
        res.status(200).json(talleres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener taller por ID
async function obtenerPorId(req, res) {
    try {
        const taller = await tallerService.obtenerTaller(req.params.id);
        res.status(200).json(taller);
    } catch (error) {
        const estado = error.message === "Taller no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Crear un taller
async function crear(req, res) {
    try {
        const taller = await tallerService.crearTaller(req.body);
        res.status(201).json(taller);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar un taller
async function actualizar(req, res) {
    try {
        const taller = await tallerService.actualizarTaller(
            req.params.id,
            req.body
        );
        res.status(200).json(taller);
    } catch (error) {
        const estado = error.message === "Taller no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Eliminar un taller
async function borrar(req, res) {
    try {
        await tallerService.borrarTaller(req.params.id);
        res.status(200).json({
            mensaje: "Taller eliminado correctamente"
        });
    } catch (error) {
        const estado = error.message === "Taller no encontrado" ? 404 : 400;
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
