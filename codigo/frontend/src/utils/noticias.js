// Resumen para la tarjeta: primeros caracteres del contenido, sin cortar palabras
export function resumir(texto, max = 160) {
  const limpio = String(texto ?? "").replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  return limpio.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// Único lugar donde se mapean los campos de la tabla de noticias
export function normalizarNoticia(n) {
  const imagen =
    n.imagen && !/^(\/|https?:\/\/)/.test(n.imagen) ? `/${n.imagen}` : n.imagen;

  return {
    id: n.id_noticia ?? n.id,
    tipo: "Noticia",
    titulo: n.titulo,
    contenido: n.contenido ?? "",
    descripcion: resumir(n.contenido),
    imagen,
    fecha: n.fecha_publicacion,
  };
}