const pool = require ("./conexion");

//crearInscripcion
async function crearInscripcion(datos){
    const consulta = `
    INSERT INTO inscripcion (id_alumno, id_taller, estado, comentario)
    VALUES ($1, $2, COALESCE($3, 'aceptada'), $4)
    RETURNING id_inscripcion, id_alumno, id_taller, estado, comentario, fecha_solicitud, fecha_respuesta;
    `;

    const resultado = await pool.query(consulta, [datos.id_alumno ?? null, datos.id_taller ?? null, datos.estado ?? null, datos.comentario ?? null]);
    return resultado.rows[0];
}


//eliminarInscripcion
async function eliminarInscripcion(id){
    const consulta = `
    DELETE FROM inscripcion
    WHERE id_inscripcion = $1
    RETURNING id_inscripcion;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarInscripciones()
async function listarInscripciones(){
    const consulta = `
    SELECT id_inscripcion, id_alumno, id_taller, estado, comentario, fecha_solicitud, fecha_respuesta
    FROM inscripcion
    ORDER BY id_inscripcion;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarInscripcion()
async function actualizarInscripcion(id, datos){
    const consulta = `
    UPDATE inscripcion
    SET id_alumno = $1, id_taller = $2, estado = COALESCE($3, 'aceptada'), comentario = $4
    WHERE id_inscripcion = $5
    RETURNING id_inscripcion, id_alumno, id_taller, estado, comentario, fecha_solicitud, fecha_respuesta;
    `;

    const resultado = await pool.query(consulta, [datos.id_alumno ?? null, datos.id_taller ?? null, datos.estado ?? null, datos.comentario ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerInscripcionPorId()
async function obtenerInscripcionPorId(id){
    const consulta = `
    SELECT id_inscripcion, id_alumno, id_taller, estado, comentario, fecha_solicitud, fecha_respuesta
    FROM inscripcion
    WHERE id_inscripcion = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarInscripciones, eliminarInscripcion, crearInscripcion, actualizarInscripcion, obtenerInscripcionPorId};
