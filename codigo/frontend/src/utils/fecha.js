// Toma solo año-mes-día para que la zona horaria no corra la fecha un día
export function formatearFecha(
  valor,
  opciones = { day: "2-digit", month: "short" }
) {
  if (!valor) return "";

  const [anio, mes, dia] = String(valor).slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return "";

  return new Date(anio, mes - 1, dia)
    .toLocaleDateString("es-AR", opciones)
    .replace(".", "");
}