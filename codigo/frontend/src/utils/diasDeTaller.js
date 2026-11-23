const DIAS = [
  { numero: 0, patron: /\b(domingos?|dom)\b/ },
  { numero: 1, patron: /\b(lunes|lun)\b/ },
  { numero: 2, patron: /\b(martes|mar)\b/ },
  { numero: 3, patron: /\b(miercoles|mie|mier)\b/ },
  { numero: 4, patron: /\b(jueves|jue)\b/ },
  { numero: 5, patron: /\b(viernes|vie)\b/ },
  { numero: 6, patron: /\b(sabados?|sab)\b/ },
];

// Días de la semana (0 = domingo) que nombra el texto de un taller, como "Lunes y viernes".
// Devuelve null si no se reconoce ninguno, para que la planilla muestre todos los días.
export function diasDeSemanaDeTaller(texto) {
  const limpio = String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const encontrados = DIAS.filter((d) => d.patron.test(limpio)).map((d) => d.numero);

  return encontrados.length > 0 ? encontrados : null;
}
