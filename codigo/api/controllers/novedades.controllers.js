const novedadesData = require("../data/novedades.repositorio");

// Valida y limpia lo que llega del formulario
function validar(body) {
  const titulo = body?.titulo?.trim();
  const descripcion = body?.descripcion?.trim();
  const categoria = body?.categoria?.trim();
  const imagen = body?.imagen?.trim() || null;

  if (!titulo || titulo.length > 120) {
    return { error: "El título es obligatorio (máximo 120 caracteres)" };
  }
  if (!descripcion || descripcion.length > 500) {
    return { error: "La descripción es obligatoria (máximo 500 caracteres)" };
  }
  if (!categoria || categoria.length > 40) {
    return { error: "La categoría es obligatoria (máximo 40 caracteres)" };
  }
  if (imagen && !/^(\/|https:\/\/)/.test(imagen)) {
    return { error: "La imagen debe ser una ruta que empiece con / o una URL https" };
  }

  return { datos: { titulo, descripcion, categoria, imagen } };
}

const listar = async (req, res) => {
  try {
    res.status(200).json(await novedadesData.listarNovedades());
  } catch (error) {
    console.error("Error al listar novedades:", error.message);
    res.status(500).json({ error: "Error interno" });
  }
};

const obtener = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Id inválido" });

  try {
    const novedad = await novedadesData.obtenerNovedadPorId(id);
    if (!novedad) return res.status(404).json({ error: "Novedad no encontrada" });
    res.status(200).json(novedad);
  } catch (error) {
    console.error("Error al obtener novedad:", error.message);
    res.status(500).json({ error: "Error interno" });
  }
};

const crear = async (req, res) => {
  const { error, datos } = validar(req.body);
  if (error) return res.status(400).json({ error });

  try {
    res.status(201).json(await novedadesData.crearNovedad(datos));
  } catch (err) {
    console.error("Error al crear novedad:", err.message);
    res.status(500).json({ error: "Error interno" });
  }
};

const actualizar = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Id inválido" });

  const { error, datos } = validar(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const novedad = await novedadesData.actualizarNovedad(id, datos);
    if (!novedad) return res.status(404).json({ error: "Novedad no encontrada" });
    res.status(200).json(novedad);
  } catch (err) {
    console.error("Error al actualizar novedad:", err.message);
    res.status(500).json({ error: "Error interno" });
  }
};

const eliminar = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Id inválido" });

  try {
    const eliminada = await novedadesData.eliminarNovedad(id);
    if (!eliminada) return res.status(404).json({ error: "Novedad no encontrada" });
    res.status(200).json({ mensaje: "Novedad eliminada" });
  } catch (error) {
    console.error("Error al eliminar novedad:", error.message);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };