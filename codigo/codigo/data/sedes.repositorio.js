// Repositorio de sedes. Las redes sociales de una sede se borran junto con ella (ON DELETE CASCADE).
const pool = require("../db/pool");

const COLUMNAS = "id_sede, nombre, direccion, descripcion";

async function todas() {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM sede ORDER BY nombre`);
  return rows;
}

async function porId(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM sede WHERE id_sede = $1`, [id]);
  return rows[0] || null;
}

async function crear({ nombre, direccion, descripcion }) {
  const { rows } = await pool.query(
    `INSERT INTO sede (nombre, direccion, descripcion) VALUES ($1, $2, $3) RETURNING ${COLUMNAS}`,
    [nombre, direccion, descripcion ?? null]
  );
  return rows[0];
}

async function actualizar(id, { nombre, direccion, descripcion }) {
  const { rows } = await pool.query(
    `UPDATE sede SET nombre = $1, direccion = $2, descripcion = $3
      WHERE id_sede = $4 RETURNING ${COLUMNAS}`,
    [nombre, direccion, descripcion ?? null, id]
  );
  return rows[0] || null;
}

async function eliminar(id) {
  const resultado = await pool.query("DELETE FROM sede WHERE id_sede = $1", [id]);
  return resultado.rowCount > 0;
}

module.exports = { todas, porId, crear, actualizar, eliminar };
