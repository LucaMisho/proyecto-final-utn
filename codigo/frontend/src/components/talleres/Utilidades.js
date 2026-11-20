// Funciones de apoyo para la página de Talleres

export function formatearHora(hora) {
  return hora ? String(hora).slice(0, 5) : "";
}

export function textoHorario(taller) {
  return `${formatearHora(taller.hora_inicio)} a ${formatearHora(taller.hora_fin)}`;
}

export function textoEdades(min, max) {
  const hayMin = min !== null && min !== undefined;
  const hayMax = max !== null && max !== undefined;

  if (hayMin && hayMax) return `${min} a ${max} años`;
  if (hayMin) return `Desde ${min} años`;
  if (hayMax) return `Hasta ${max} años`;
  return "Todas las edades";
}

export function esVerdadero(valor) {
  return (
    valor === true ||
    valor === 1 ||
    ["true", "1", "si", "sí"].includes(String(valor).trim().toLowerCase())
  );
}

// Ajustá esta lista a los valores reales de la columna "estado"
const ESTADOS_DISPONIBLES = ["activo", "disponible", "abierto", "true", "1"];

export function estaDisponible(estado) {
  return ESTADOS_DISPONIBLES.includes(String(estado ?? "").trim().toLowerCase());
}

// Para buscar sin importar mayúsculas ni tildes
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}