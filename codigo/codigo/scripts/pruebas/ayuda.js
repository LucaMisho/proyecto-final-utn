// Funciones chicas para que cada prueba muestre lo que pasa de forma legible.

if (process.platform === "win32") {
  console.log("(Si ves tildes o letras que faltan, escribí  chcp 65001  y volvé a correr la prueba.)");
}

function titulo(texto) {
  console.log("\n==== " + texto + " ====");
}

function mostrar(descripcion, valor) {
  console.log("\n" + descripcion);
  if (valor === null || valor === undefined) console.log("  -> null (no encontrado)");
  else if (Array.isArray(valor)) valor.length ? console.table(valor) : console.log("  -> lista vacía");
  else if (typeof valor === "object") console.table([valor]);
  else console.log("  ->", valor);
}

module.exports = { titulo, mostrar };
