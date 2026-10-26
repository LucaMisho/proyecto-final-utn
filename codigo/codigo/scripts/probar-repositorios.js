// Prueba rápida de los repositorios contra la base real (sin servidor ni Express).
// Requiere el .env y haber corrido: npm run db:iniciar
// Uso: npm run probar:repositorios
const assert = require("assert");
const pool = require("../db/pool");
const barrios = require("../data/barrios.repositorio");
const talleres = require("../data/talleres.repositorio");
const noticias = require("../data/noticias.repositorio");
const sedes = require("../data/sedes.repositorio");

async function main() {
  // --- Barrios ---
  const b = await barrios.crear({ nombre: "Quequén Centro", descripcion: "Zona céntrica" });
  assert.strictEqual(typeof b.id_barrio, "number");
  assert.strictEqual((await barrios.porNombre("quequén centro")).id_barrio, b.id_barrio);
  assert.strictEqual(await barrios.porNombre("quequén centro", b.id_barrio), null);
  assert.strictEqual((await barrios.actualizar(b.id_barrio, { nombre: "Quequén", descripcion: null })).nombre, "Quequén");
  assert.strictEqual(await barrios.actualizar(9999, { nombre: "x" }), null);
  assert.strictEqual(await barrios.porId(9999), null);

  // --- Talleres ---
  const t = await talleres.crear({
    nombre: "Murga", descripcion: "Taller de murga", dia: "Lunes",
    hora_inicio: "15:00", hora_fin: "17:00", edad_minima: 8, edad_maxima: 14,
    id_barrio: b.id_barrio, cupo: 20,
  });
  assert.strictEqual(t.hora_inicio, "15:00");
  assert.strictEqual(t.cupo_disponible, 20);
  assert.strictEqual(t.barrio, "Quequén");
  assert.strictEqual((await talleres.todos({ edad: 10 })).length, 1);
  assert.strictEqual((await talleres.todos({ edad: 20 })).length, 0);
  assert.strictEqual((await talleres.todos({ dia: "lunes", idBarrio: b.id_barrio })).length, 1);
  assert.strictEqual((await talleres.actualizar(t.id_taller, { ...t, cupo: 25 })).cupo, 25);
  assert.deepStrictEqual(await barrios.contarDependencias(b.id_barrio), { talleres: 1, actividades: 0 });

  // Un barrio con talleres no se puede borrar: la base lo impide (la regla del 409 va en el servicio).
  await assert.rejects(barrios.eliminar(b.id_barrio), (e) => e.code === "23503");

  assert.strictEqual(await talleres.eliminar(t.id_taller), true);
  assert.strictEqual(await talleres.eliminar(t.id_taller), false);
  assert.strictEqual(await barrios.eliminar(b.id_barrio), true);

  // --- Noticias ---
  const n = await noticias.crear({ titulo: "Nuevo taller", contenido: "Se abre el taller de murga" });
  assert.match(n.fecha_publicacion, /^\d{4}-\d{2}-\d{2}$/);
  assert.strictEqual(n.estado, "ACTIVA");
  assert.strictEqual((await noticias.todas({ buscar: "murga" })).length, 1);
  assert.strictEqual((await noticias.todas({ buscar: "ajedrez" })).length, 0);
  assert.strictEqual((await noticias.actualizar(n.id_noticia, { titulo: "Cambió", contenido: "x", estado: "INACTIVA" })).estado, "INACTIVA");
  assert.strictEqual((await noticias.todas({ soloActivas: true })).length, 0);
  assert.strictEqual(await noticias.eliminar(n.id_noticia), true);

  // --- Sedes ---
  const s = await sedes.crear({ nombre: "Sede Central", direccion: "Calle 1 123" });
  assert.strictEqual((await sedes.actualizar(s.id_sede, { nombre: "Central", direccion: "Calle 2", descripcion: "d" })).nombre, "Central");
  assert.strictEqual(await sedes.porId(9999), null);
  assert.strictEqual(await sedes.eliminar(s.id_sede), true);

  console.log("Todos los repositorios funcionan.");
}

main()
  .catch((e) => { console.error("FALLÓ:", e); process.exitCode = 1; })
  .finally(() => pool.end());
