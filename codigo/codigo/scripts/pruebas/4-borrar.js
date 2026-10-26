// PRUEBA 4: BORRAR. Borra todos los datos de ejemplo y verifica que ya no estén.
// Uso: npm run prueba:4-borrar
const pool = require("../../db/pool");
const barrios = require("../../data/barrios.repositorio");
const talleres = require("../../data/talleres.repositorio");
const noticias = require("../../data/noticias.repositorio");
const sedes = require("../../data/sedes.repositorio");
const { titulo, mostrar } = require("./ayuda");

async function main() {
  titulo("1. Un barrio con talleres NO se puede borrar");
  const todosLosBarrios = await barrios.todos();
  if (todosLosBarrios.length === 0) throw new Error("No hay barrios. Corré antes la prueba 1.");
  const conTalleres = todosLosBarrios[0];
  mostrar(`Dependencias del barrio ${conTalleres.id_barrio}:`, await barrios.contarDependencias(conTalleres.id_barrio));
  try {
    await barrios.eliminar(conTalleres.id_barrio);
    console.log("PROBLEMA: la base dejó borrar un barrio con talleres.");
  } catch (e) {
    console.log(`\nLa base lo rechazó, como corresponde (código ${e.code}: clave foránea).`);
    console.log("En la API real, el servicio se va a fijar antes y va a responder 409.");
  }

  titulo("2. Borrar los talleres");
  for (const t of await talleres.todos()) {
    console.log(`eliminar(taller ${t.id_taller} "${t.nombre}") ->`, await talleres.eliminar(t.id_taller));
  }
  mostrar("talleres.todos() ahora:", await talleres.todos());
  mostrar("Borrar de nuevo un taller que ya no existe (id 9999) -> tiene que dar false:", await talleres.eliminar(9999));

  titulo("3. Borrar los barrios (ahora sí se puede)");
  for (const b of await barrios.todos()) {
    console.log(`eliminar(barrio ${b.id_barrio} "${b.nombre}") ->`, await barrios.eliminar(b.id_barrio));
  }
  mostrar("barrios.todos() ahora:", await barrios.todos());

  titulo("4. Borrar las noticias");
  for (const n of await noticias.todas()) {
    console.log(`eliminar(noticia ${n.id_noticia} "${n.titulo}") ->`, await noticias.eliminar(n.id_noticia));
  }
  mostrar("noticias.todas() ahora:", await noticias.todas());

  titulo("5. Borrar las sedes");
  for (const s of await sedes.todas()) {
    console.log(`eliminar(sede ${s.id_sede} "${s.nombre}") ->`, await sedes.eliminar(s.id_sede));
  }
  mostrar("sedes.todas() ahora:", await sedes.todas());

  console.log("\nListo. La base quedó vacía. Podés volver a empezar con: npm run prueba:1-crear");
}

main()
  .catch((e) => { console.error("FALLÓ:", e); process.exitCode = 1; })
  .finally(() => pool.end());
