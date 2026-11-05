const pool = require ("./conexion");

//crearAsistencia
async function crearAsistencia(datos){
    const consulta = `
    INSERT INTO asistencia (id_alumno, id_taller, fecha, presente)
    VALUES ($1, $2, $3, COALESCE($4, FALSE))
    RETURNING id_asistencia, id_alumno, id_taller, fecha, presente;
    `;

    const resultado = await pool.query(consulta, [datos.id_alumno ?? null, datos.id_taller ?? null, datos.fecha ?? null, datos.presente ?? null]);
    return resultado.rows[0];
}


//eliminarAsistencia
async function eliminarAsistencia(id){
    const consulta = `
    DELETE FROM asistencia
    WHERE id_asistencia = $1
    RETURNING id_asistencia;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarAsistencias()
async function listarAsistencias(){
    const consulta = `
    SELECT id_asistencia, id_alumno, id_taller, fecha, presente
    FROM asistencia
    ORDER BY id_asistencia;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarAsistencia()
async function actualizarAsistencia(id, datos){
    const consulta = `
    UPDATE asistencia
    SET id_alumno = $1, id_taller = $2, fecha = $3, presente = COALESCE($4, FALSE)
    WHERE id_asistencia = $5
    RETURNING id_asistencia, id_alumno, id_taller, fecha, presente;
    `;

    const resultado = await pool.query(consulta, [datos.id_alumno ?? null, datos.id_taller ?? null, datos.fecha ?? null, datos.presente ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerAsistenciaPorId()
async function obtenerAsistenciaPorId(id){
    const consulta = `
    SELECT id_asistencia, id_alumno, id_taller, fecha, presente
    FROM asistencia
    WHERE id_asistencia = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarAsistencias, eliminarAsistencia, crearAsistencia, actualizarAsistencia, obtenerAsistenciaPorId};
