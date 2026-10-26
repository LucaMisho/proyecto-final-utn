// PRUEBA 2: BUSCAR. Solo lee: no cambia nada en la base.
// Hay que haber corrido antes la prueba 1.
// Uso: npm run prueba:2-buscar
const pool = require("../../db/pool");
const barrios = require("../../data/barrios.repositorio");
const talleres = require("../../data/talleres.repositorio");
const noticias = require("../../data/noticias.repositorio");
const sedes = require("../../data/sedes.repositorio");
const { titulo, mostrar } = require("./ayuda");

async function main() {
  titulo("BARRIOS");
  const todosLosBarrios = await barrios.todos();
  mostrar("todos() -> tienen que estar los 2 barrios, ordenados por nombre:", todosLosBarrios);
  const primero = todosLosBarrios[0];
  mostrar(`porId(${primero.id_barrio}) -> un solo barrio:`, await barrios.porId(primero.id_barrio));
  mostrar("porId(9999) -> no existe, tiene que dar null:", await barrios.porId(9999));
  mostrar('porNombre("quequen centro") -> encuentra "Quequen Centro" aunque esté en minúsculas (los datos todavía tienen errores de ortografía):', await barrios.porNombre("quequen centro"));
  mostrar('porNombre("Inventado") -> null:', await barrios.porNombre("Inventado"));
  mostrar(`contarDependencias(${primero.id_barrio}) -> cuántos talleres y actividades tiene:`, await barrios.contarDependencias(primero.id_barrio));

  titulo("TALLERES");
  mostrar("todos() -> los 3 talleres, con el nombre del barrio y el cupo_disponible (los textos todavía tienen errores a propósito):", await talleres.todos());
  mostrar("todos({ edad: 9 }) -> tiene que aparecer solo Murga (6 a 11 años):", await talleres.todos({ edad: 9 }));
  mostrar("todos({ edad: 15 }) -> Fotografia y Guitara (12 a 21 años, así están escritos por ahora):", await talleres.todos({ edad: 15 }));
  mostrar('todos({ dia: "miercoles" }) -> solo Fotografia (no distingue mayúsculas):', await talleres.todos({ dia: "miercoles" }));
  mostrar(`todos({ idBarrio: ${primero.id_barrio} }) -> los talleres de ese barrio:`, await talleres.todos({ idBarrio: primero.id_barrio }));
  const unTaller = (await talleres.todos())[0];
  mostrar(`porId(${unTaller.id_taller}):`, await talleres.porId(unTaller.id_taller));
  mostrar("porId(9999) -> null:", await talleres.porId(9999));
  mostrar(`contarDependencias(${unTaller.id_taller}):`, await talleres.contarDependencias(unTaller.id_taller));

  titulo("NOTICIAS");
  mostrar("todas() -> las 2, la más nueva primero:", await noticias.todas());
  mostrar('todas({ buscar: "murga" }) -> solo la de murga:', await noticias.todas({ buscar: "murga" }));
  mostrar('todas({ buscar: "ajedrez" }) -> lista vacía:', await noticias.todas({ buscar: "ajedrez" }));
  const hoy = new Date().toLocaleDateString("sv-SE");
  mostrar(`todas({ fecha: "${hoy}" }) -> las publicadas hoy:`, await noticias.todas({ fecha: hoy }));
  const una = (await noticias.todas())[0];
  mostrar(`porId(${una.id_noticia}):`, await noticias.porId(una.id_noticia));

  titulo("SEDES");
  mostrar("todas() -> las 2 sedes, ordenadas por nombre:", await sedes.todas());
  const sede = (await sedes.todas())[0];
  mostrar(`porId(${sede.id_sede}):`, await sedes.porId(sede.id_sede));
  mostrar("porId(9999) -> null:", await sedes.porId(9999));

  console.log("\nListo. No se cambió nada. Ahora corré: npm run prueba:3-actualizar");
}

main()
  .catch((e) => { console.error("FALLÓ:", e); process.exitCode = 1; })
  .finally(() => pool.end());
