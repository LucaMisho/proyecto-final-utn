// PRUEBA 3: ACTUALIZAR. Cambia datos y muestra cómo estaban ANTES y cómo quedaron DESPUÉS.
// Corrige los errores de ortografía que la prueba 1 dejó a propósito y cambia algunos datos más.
// Hay que haber corrido antes la prueba 1. Se puede repetir sin problema.
// Uso: npm run prueba:3-actualizar
const pool = require("../../db/pool");
const barrios = require("../../data/barrios.repositorio");
const talleres = require("../../data/talleres.repositorio");
const noticias = require("../../data/noticias.repositorio");
const sedes = require("../../data/sedes.repositorio");
const { titulo, mostrar } = require("./ayuda");

// Busca por el nombre con error o por el nombre ya corregido (así la prueba se puede repetir).
async function barrioPorNombre(conError, corregido) {
  const b = (await barrios.porNombre(conError)) || (await barrios.porNombre(corregido));
  if (!b) throw new Error(`No encuentro el barrio "${conError}". Corré antes la prueba 1.`);
  return b;
}

async function main() {
  titulo("BARRIOS: corregir ortografía");
  const centro = await barrioPorNombre("Quequen Centro", "Quequén Centro");
  mostrar("ANTES:", centro);
  mostrar("DESPUÉS:", await barrios.actualizar(centro.id_barrio, {
    nombre: "Quequén Centro", descripcion: "Zona céntrica de Quequén",
  }));

  const villa = await barrioPorNombre("Villa Diaz Velez", "Villa Díaz Vélez");
  mostrar("ANTES:", villa);
  mostrar("DESPUÉS:", await barrios.actualizar(villa.id_barrio, {
    nombre: "Villa Díaz Vélez", descripcion: "Barrio al norte de Necochea",
  }));
  mostrar("Confirmación leyendo de nuevo todos los barrios desde la base:", await barrios.todos());
  mostrar("actualizar() de un barrio 9999 que no existe -> tiene que dar null:",
    await barrios.actualizar(9999, { nombre: "x", descripcion: "y" }));

  titulo("TALLERES: corregir ortografía");
  const lista = await talleres.todos();
  const buscarTaller = (conError, corregido) => {
    const t = lista.find((x) => x.nombre === conError || x.nombre === corregido);
    if (!t) throw new Error(`No encuentro el taller "${conError}". Corré antes la prueba 1.`);
    return t;
  };

  const foto = buscarTaller("Fotografia", "Fotografía");
  mostrar("ANTES:", foto);
  mostrar("DESPUÉS:", await talleres.actualizar(foto.id_taller, {
    ...foto, nombre: "Fotografía", descripcion: "Introducción a la fotografía", dia: "Miércoles",
  }));

  const guitarra = buscarTaller("Guitara", "Guitarra");
  mostrar("ANTES:", guitarra);
  mostrar("DESPUÉS:", await talleres.actualizar(guitarra.id_taller, {
    ...guitarra, nombre: "Guitarra", descripcion: "Guitarra para principiantes",
  }));

  titulo("TALLER: subir el cupo de Murga y cambiar el horario");
  const murga = buscarTaller("Murga", "Murga");
  mostrar("ANTES:", murga);
  mostrar("DESPUÉS:", await talleres.actualizar(murga.id_taller, { ...murga, cupo: 30, hora_inicio: "16:00", hora_fin: "18:00" }));
  mostrar("actualizar() de un taller 9999 -> null:", await talleres.actualizar(9999, murga));

  titulo("NOTICIAS: corregir ortografía");
  const todasLasNoticias = await noticias.todas();
  const buscarNoticia = (conError, corregido) => {
    const n = todasLasNoticias.find((x) => x.titulo === conError || x.titulo === corregido);
    if (!n) throw new Error(`No encuentro la noticia "${conError}". Corré antes la prueba 1.`);
    return n;
  };

  const n1 = buscarNoticia("Se abre el taler de murga", "Se abre el taller de murga");
  mostrar("ANTES:", n1);
  mostrar("DESPUÉS (corregida y pasada a INACTIVA):", await noticias.actualizar(n1.id_noticia, {
    titulo: "Se abre el taller de murga", contenido: "Empieza el lunes en Quequén Centro.",
    imagen: n1.imagen, estado: "INACTIVA",
  }));
  mostrar("todas({ soloActivas: true }) -> ya no tiene que estar la de murga:", await noticias.todas({ soloActivas: true }));

  const n2 = buscarNoticia("Muestra de fotografia", "Muestra de fotografía");
  mostrar("ANTES:", n2);
  mostrar("DESPUÉS:", await noticias.actualizar(n2.id_noticia, {
    titulo: "Muestra de fotografía", contenido: "Se exponen las fotos del taller.",
    imagen: n2.imagen, estado: n2.estado,
  }));

  titulo("SEDES: corregir nombres y datos");
  const todasLasSedes = await sedes.todas();
  const buscarSede = (conError, corregido) => {
    const s = todasLasSedes.find((x) => x.nombre === conError || x.nombre === corregido);
    if (!s) throw new Error(`No encuentro la sede "${conError}". Corré antes la prueba 1.`);
    return s;
  };

  const envion = buscarSede("Envion Quequen", "Envión Quequén");
  mostrar("ANTES:", envion);
  mostrar("DESPUÉS (sede principal, jóvenes de 12 a 21 años):", await sedes.actualizar(envion.id_sede, {
    nombre: "Envión Quequén", direccion: "Calle 502 N° 1000, Quequén",
    descripcion: "Sede principal, para jóvenes de 12 a 21 años",
  }));

  const cultura = buscarSede("Barrio Cultra", "Barrio Cultura");
  mostrar("ANTES:", cultura);
  mostrar("DESPUÉS (sede para chicos de 6 a 11 años):", await sedes.actualizar(cultura.id_sede, {
    nombre: "Barrio Cultura", direccion: "Calle 58 N° 1000, Necochea",
    descripcion: "Sede para chicos de 6 a 11 años",
  }));

  console.log("\nListo. Ahora corré: npm run prueba:4-borrar");
}

main()
  .catch((e) => { console.error("FALLÓ:", e); process.exitCode = 1; })
  .finally(() => pool.end());
