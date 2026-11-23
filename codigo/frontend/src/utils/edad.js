// Edad en años cumplidos a partir de "AAAA-MM-DD"; null si no hay fecha válida
export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  const texto = String(fechaNacimiento ?? "").slice(0, 10);
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);

  if (!partes) return null;

  const [, anio, mes, dia] = partes.map(Number);
  let edad = hoy.getFullYear() - anio;

  const cumplioEsteAnio =
    hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);

  if (!cumplioEsteAnio) edad -= 1;

  return edad >= 0 ? edad : null;
}

export function textoDeEdad(fechaNacimiento) {
  const edad = calcularEdad(fechaNacimiento);

  if (edad === null) return "Sin dato";

  return `${edad} ${edad === 1 ? "año" : "años"}`;
}
