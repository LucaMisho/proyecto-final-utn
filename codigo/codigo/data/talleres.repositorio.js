// Repositorio de talleres.
// "cupo_disponible" = cupo - inscripciones ACEPTADAS (la regla del flujo de la Etapa 3).
const pool = require("../db/pool");

const SELECT_TALLER = `
  SELECT t.id_taller, t.nombre, t.descripcion, t.dia,
         TO_CHAR(t.hora_inicio, 'HH24:MI') AS hora_inicio,
         TO_CHAR(t.hora_fin, 'HH24:MI')    AS hora_fin,
         t.edad_minima, t.edad_maxima, t.id_barrio, b.nombre AS barrio,
         t.cupo, t.activo,
         t.cupo - (SELECT COUNT(*) FROM inscripcion i
                    WHERE i.id_taller = t.id_taller AND i.estado = 'ACEPTADA')::int AS cupo_disponible
    FROM taller t
    JOIN barrio b ON b.id_barrio = t.id_barrio`;

// filtros opcionales: { idBarrio, dia, edad, soloActivos }
async function todos({ idBarrio, dia, edad, soloActivos = false } = {}) {
  const condiciones = [];
  const valores = [];
  const agregar = (sql, valor) => { valores.push(valor); condiciones.push(sql.replace("?", `$${valores.length}`)); };

  if (idBarrio !== undefined) agregar("t.id_barrio = ?", idBarrio);
  if (dia !== undefined) agregar("LOWER(t.dia) = LOWER(?)", dia);
  if (edad !== undefined) { valores.push(edad); condiciones.push(`$${valores.length} BETWEEN t.edad_minima AND t.edad_maxima`); }
  if (soloActivos) condiciones.push("t.activo = TRUE");

  const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
  const { rows } = await pool.query(`${SELECT_TALLER} ${where} ORDER BY t.nombre`, valores);
  return rows;
}

async function porId(id) {
  const { rows } = await pool.query(`${SELECT_TALLER} WHERE t.id_taller = $1`, [id]);
  return rows[0] || null;
}

async function crear(d) {
  const { rows } = await pool.query(
    `INSERT INTO taller (nombre, descripcion, dia, hora_inicio, hora_fin,
                         edad_minima, edad_maxima, id_barrio, cupo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_taller`,
    [d.nombre, d.descripcion ?? null, d.dia, d.hora_inicio, d.hora_fin,
     d.edad_minima, d.edad_maxima, d.id_barrio, d.cupo]
  );
  return porId(rows[0].id_taller);
}

// PUT: reemplaza todos los datos editables. Devuelve el taller o null si no existe.
async function actualizar(id, d) {
  const resultado = await pool.query(
    `UPDATE taller SET nombre = $1, descripcion = $2, dia = $3, hora_inicio = $4, hora_fin = $5,
                       edad_minima = $6, edad_maxima = $7, id_barrio = $8, cupo = $9
      WHERE id_taller = $10`,
    [d.nombre, d.descripcion ?? null, d.dia, d.hora_inicio, d.hora_fin,
     d.edad_minima, d.edad_maxima, d.id_barrio, d.cupo, id]
  );
  return resultado.rowCount > 0 ? porId(id) : null;
}

async function eliminar(id) {
  const resultado = await pool.query("DELETE FROM taller WHERE id_taller = $1", [id]);
  return resultado.rowCount > 0;
}

// Para la regla "no se borra un taller con inscripciones, asistencias o actividades" (409).
async function contarDependencias(id) {
  const { rows } = await pool.query(
    `SELECT (SELECT COUNT(*) FROM inscripcion WHERE id_taller = $1)::int AS inscripciones,
            (SELECT COUNT(*) FROM asistencia  WHERE id_taller = $1)::int AS asistencias,
            (SELECT COUNT(*) FROM actividad   WHERE id_taller = $1)::int AS actividades`,
    [id]
  );
  return rows[0];
}

module.exports = { todos, porId, crear, actualizar, eliminar, contarDependencias };
