const barrioService = require("../services/barrios.services");

// Listar todos los barrios
async function listar(req, res) {
    try {
        const barrios = await barrioService.listarBarrios();
        res.status(200).json(barrios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener un barrio por ID
async function obtenerPorId(req, res) {
    try {
        const barrio = await barrioService.obtenerBarrio(req.params.id);
        res.status(200).json(barrio);
    } catch (error) {
        const estado = error.message === "Barrio no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Crear un barrio
async function crear(req, res) {
    try {
        const barrio = await barrioService.crearBarrio(req.body);
        res.status(201).json(barrio);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Actualizar un barrio
async function actualizar(req, res) {
    try {
        const barrio = await barrioService.actualizarBarrio(
            req.params.id,
            req.body
        );
        res.status(200).json(barrio);
    } catch (error) {
        const estado = error.message === "Barrio no encontrado" ? 404 : 400;
        res.status(estado).json({ error: error.message });
    }
}

// Eliminar un barrio
async function borrar(req, res) {
    try {
        await barrioService.borrarBarrio(req.params.id);
        res.status(200).json({
            mensaje: "Barrio eliminado correctamente"
        });
    } catch (error) {
        const estado = error.message === "Barrio no encontrado" ? 404 : 400;
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
