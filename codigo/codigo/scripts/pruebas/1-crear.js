// PRUEBA 1: CREAR. Inserta datos de ejemplo y los deja guardados en la base.
// OJO: algunos datos tienen errores de ortografía a propósito (sin tilde, una letra de menos,
// un nombre provisorio). La prueba 3 (actualizar) los corrige, así se ve el antes y el después.
// Después podés mirarlos en pgAdmin (clic derecho en la tabla, View/Edit Data).
// Si lo corrés dos veces no duplica: avisa que ya existen.
// Uso: npm run prueba:1-crear
const pool = require("../../db/pool");
const barrios = require("../../data/barrios.repositorio");
const talleres = require("../../data/talleres.repositorio");
const noticias = require("../../data/noticias.repositorio");
const sedes = require("../../data/sedes.repositorio");
const { titulo, mostrar } = require("./ayuda");

async function crearBarrio(datos) {
  const existente = await barrios.porNombre(datos.nombre);
  if (existente) { console.log(`(el barrio "${datos.nombre}" ya existía)`); return existente; }
  return barrios.crear(datos);
}

async function crearTaller(datos) {
  const existente = (await talleres.todos()).find((t) => t.nombre === datos.nombre);
  if (existente) { console.log(`(el taller "${datos.nombre}" ya existía)`); return existente; }
  return talleres.crear(datos);
}

async function main() {
  titulo("BARRIOS creados");
  const centro = await crearBarrio({ nombre: "Quequen Centro", descripcion: "Zona centrica de Quequen" });
  const villa = await crearBarrio({ nombre: "Villa Diaz Velez", descripcion: "Barrio al norte de Necochea" });
  mostrar("Barrios (con errores de ortografía a propósito, se corrigen en la prueba 3):", [centro, villa]);

  titulo("TALLERES creados");
  const murga = await crearTaller({
    nombre: "Murga", descripcion: "Taller de murga", dia: "Lunes",
    hora_inicio: "15:00", hora_fin: "17:00", edad_minima: 6, edad_maxima: 11,
    id_barrio: centro.id_barrio, cupo: 20,
  });
  const foto = await crearTaller({
    nombre: "Fotografia", descripcion: "Introduccion a la fotografia", dia: "Miercoles",
    hora_inicio: "16:00", hora_fin: "18:00", edad_minima: 12, edad_maxima: 21,
    id_barrio: villa.id_barrio, cupo: 15,
  });
  const guitarra = await crearTaller({
    nombre: "Guitara", descripcion: "Guitara para principiantes", dia: "Viernes",
    hora_inicio: "14:00", hora_fin: "15:30", edad_minima: 12, edad_maxima: 21,
    id_barrio: centro.id_barrio, cupo: 10,
  });
  mostrar("Talleres (fijate que el cupo_disponible es igual al cupo, porque todavía no hay inscripciones):", [murga, foto, guitarra]);

  titulo("NOTICIAS creadas");
  const n1 = await noticias.crear({ titulo: "Se abre el taler de murga", contenido: "Empieza el lunes en Quequen Centro." });
  const n2 = await noticias.crear({ titulo: "Muestra de fotografia", contenido: "Se exponen las fotos del taler.", imagen: "muestra.jpg" });
  mostrar("Noticias (la fecha se pone sola y el estado empieza en ACTIVA):", [n1, n2]);

  titulo("SEDES creadas");
  const s1 = await sedes.crear({ nombre: "Envion Quequen", direccion: "Calle 502 N 1000, Quequen", descripcion: "Sede principal, para jovenes de 12 a 21 anos" });
  const s2 = await sedes.crear({ nombre: "Barrio Cultra", direccion: "Calle 58 N 1000, Necochea", descripcion: "Sede para chicos de 6 a 11 anos" });
  mostrar("Sedes:", [s1, s2]);

  console.log("\nListo. Los datos quedaron guardados. Ahora corré: npm run prueba:2-buscar");
}

main()
  .catch((e) => { console.error("FALLÓ:", e); process.exitCode = 1; })
  .finally(() => pool.end());
