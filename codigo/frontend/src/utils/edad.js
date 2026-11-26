// edad.js
export const EDAD_MINIMA = 5;
// Devuelve un mensaje de error, o null si la fecha es válida
export function validarFechaNacimiento(valor, hoy = new Date()) {
  const texto = String(valor ?? "").slice(0, 10);
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);

  if (!partes) return "La fecha de nacimiento no es válida";

  const [, anio, mes, dia] = partes.map(Number);
  const fecha = new Date(anio, mes - 1, dia);

  // Detecta fechas inexistentes como 2020-02-31 (JS las "corrige" solas)
  const existe =
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia;

  if (!existe || anio < 1900) return "La fecha de nacimiento no es válida";
  if (fecha > hoy) return "La fecha de nacimiento no puede ser futura";

  return null;
}

// Edad en años cumplidos a partir de "AAAA-MM-DD"; null si la fecha no es válida
export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  if (validarFechaNacimiento(fechaNacimiento, hoy) !== null) return null;

  const [anio, mes, dia] = String(fechaNacimiento).slice(0, 10).split("-").map(Number);
  let edad = hoy.getFullYear() - anio;

  const cumplioEsteAnio =
    hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);

  if (!cumplioEsteAnio) edad -= 1;

  return edad;
}

export function textoDeEdad(fechaNacimiento) {
  const edad = calcularEdad(fechaNacimiento);

  if (edad === null) return "Sin dato";

  return `${edad} ${edad === 1 ? "año" : "años"}`;
}

export function validarEdadMinima(valor, hoy = new Date()){
  const errorFecha = validarFechaNacimiento(valor, hoy);
  if (errorFecha) 
    return errorFecha;
 const edad = calcularEdad(valor, hoy);
 if (edad < EDAD_MINIMA){
    return `La edad mínima es de ${EDAD_MINIMA} años`;
  }

  return null;

   }



