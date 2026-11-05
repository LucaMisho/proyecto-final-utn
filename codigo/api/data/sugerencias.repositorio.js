const pool = require ("./conexion");

//crearSugerencia
async function crearSugerencia(datos){
    const consulta = `
    INSERT INTO sugerencia (id_usuario, mensaje, estado)
    VALUES ($1, $2, COALESCE($3, 'pendiente'))
    RETURNING id_sugerencia, id_usuario, mensaje, estado, fecha;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.mensaje ?? null, datos.estado ?? null]);
    return resultado.rows[0];
}


//eliminarSugerencia
async function eliminarSugerencia(id){
    const consulta = `
    DELETE FROM sugerencia
    WHERE id_sugerencia = $1
    RETURNING id_sugerencia;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarSugerencias()
async function listarSugerencias(){
    const consulta = `
    SELECT id_sugerencia, id_usuario, mensaje, estado, fecha
    FROM sugerencia
    ORDER BY id_sugerencia;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarSugerencia()
async function actualizarSugerencia(id, datos){
    const consulta = `
    UPDATE sugerencia
    SET id_usuario = $1, mensaje = $2, estado = COALESCE($3, 'pendiente')
    WHERE id_sugerencia = $4
    RETURNING id_sugerencia, id_usuario, mensaje, estado, fecha;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.mensaje ?? null, datos.estado ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerSugerenciaPorId()
async function obtenerSugerenciaPorId(id){
    const consulta = `
    SELECT id_sugerencia, id_usuario, mensaje, estado, fecha
    FROM sugerencia
    WHERE id_sugerencia = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarSugerencias, eliminarSugerencia, crearSugerencia, actualizarSugerencia, obtenerSugerenciaPorId};
