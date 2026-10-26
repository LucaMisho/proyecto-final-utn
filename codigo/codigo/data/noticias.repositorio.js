// Repositorio de noticias.
const pool = require("../db/pool");

const COLUMNAS = `id_noticia, titulo, contenido, fecha_publicacion, imagen, estado`;

// filtros opcionales: { buscar, fecha, soloActivas }
async function todas({ buscar, fecha, soloActivas = false } = {}) {
  const condiciones = [];
  const valores = [];

  if (buscar !== undefined) {
    valores.push(`%${buscar}%`);
    condiciones.push(`(titulo ILIKE $${valores.length} OR contenido ILIKE $${valores.length})`);
  }
  if (fecha !== undefined) {
    valores.push(fecha);
    condiciones.push(`fecha_publicacion = $${valores.length}`);
  }
  if (soloActivas) condiciones.push("estado = 'ACTIVA'");

  const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM noticia ${where} ORDER BY fecha_publicacion DESC, id_noticia DESC`,
    valores
  );
  return rows;
}

async function porId(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM noticia WHERE id_noticia = $1`, [id]);
  return rows[0] || null;
}

async function crear({ titulo, contenido, fecha, imagen, estado }) {
  const { rows } = await pool.query(
    `INSERT INTO noticia (titulo, contenido, fecha_publicacion, imagen, estado)
     VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4, COALESCE($5, 'ACTIVA'))
     RETURNING ${COLUMNAS}`,
    [titulo, contenido, fecha ?? null, imagen ?? null, estado ?? null]
  );
  return rows[0];
}

async function actualizar(id, { titulo, contenido, fecha, imagen, estado }) {
  const { rows } = await pool.query(
    `UPDATE noticia
        SET titulo = $1, contenido = $2,
            fecha_publicacion = COALESCE($3::date, fecha_publicacion),
            imagen = $4, estado = COALESCE($5, estado)
      WHERE id_noticia = $6 RETURNING ${COLUMNAS}`,
    [titulo, contenido, fecha ?? null, imagen ?? null, estado ?? null, id]
  );
  return rows[0] || null;
}

async function eliminar(id) {
  const resultado = await pool.query("DELETE FROM noticia WHERE id_noticia = $1", [id]);
  return resultado.rowCount > 0;
}

module.exports = { todas, porId, crear, actualizar, eliminar };
