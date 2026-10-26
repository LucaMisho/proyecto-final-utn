//repositorio de barrios
const pool = require("../db/pool");

const COLUMNAS = "id_barrio, nombre, descripcion";

async function todos() {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM barrio ORDER BY nombre`);
  return rows;
}

async function porId(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM barrio WHERE id_barrio = $1`, [id]);
  return rows[0] || null;
}

// Para la regla "el nombre no se repite". Ignora el barrio indicado (sirve al actualizar).
async function porNombre(nombre, ignorarId = null) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM barrio
      WHERE LOWER(nombre) = LOWER($1) AND ($2::int IS NULL OR id_barrio <> $2)`,
    [nombre, ignorarId]
  );
  return rows[0] || null;
}

async function crear({ nombre, descripcion }) {
  const { rows } = await pool.query(
    `INSERT INTO barrio (nombre, descripcion) VALUES ($1, $2) RETURNING ${COLUMNAS}`,
    [nombre, descripcion ?? null]
  );
  return rows[0];
}

// Devuelve el barrio actualizado, o null si no existe.
async function actualizar(id, { nombre, descripcion }) {
  const { rows } = await pool.query(
    `UPDATE barrio SET nombre = $1, descripcion = $2 WHERE id_barrio = $3 RETURNING ${COLUMNAS}`,
    [nombre, descripcion ?? null, id]
  );
  return rows[0] || null;
}

// Devuelve true si borró algo, false si no existía.
async function eliminar(id) {
  const resultado = await pool.query("DELETE FROM barrio WHERE id_barrio = $1", [id]);
  return resultado.rowCount > 0;
}

// Para la regla "no se borra un barrio con talleres o actividades" (409).
async function contarDependencias(id) {
  const { rows } = await pool.query(
    `SELECT (SELECT COUNT(*) FROM taller    WHERE id_barrio = $1)::int AS talleres,
            (SELECT COUNT(*) FROM actividad WHERE id_barrio = $1)::int AS actividades`,
    [id]
  );
  return rows[0];
}

module.exports = { todos, porId, porNombre, crear, actualizar, eliminar, contarDependencias };
