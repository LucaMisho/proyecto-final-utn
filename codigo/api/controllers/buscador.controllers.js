//buscador.controllers.js
const buscadorRepositorio = require("../data/buscador.repositorio");

async function buscar(req, res, next) {
    try {
        const { q } = req.query;

        if (typeof q !== "string" || !q.trim()) {
            return res.status(400).json({
                error: "El parámetro q es obligatorio"
            });
        }

        const resultados = await buscadorRepositorio.buscar(q.trim());

        return res.status(200).json(resultados);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    buscar
};
