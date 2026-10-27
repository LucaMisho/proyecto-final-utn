const pool = require ("./conexion");

//crearSeguimiento
async function crearSeguimiento(datos){
    const consulta = `
    INSERT INTO seguimiento (id_personal, id_alumno, fecha, observacion)
    VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4)
    RETURNING id_seguimiento, id_personal, id_alumno, fecha, observacion;
    `;

    const resultado = await pool.query(consulta, [datos.id_personal ?? null, datos.id_alumno ?? null, datos.fecha ?? null, datos.observacion ?? null]);
    return resultado.rows[0];
}


//eliminarSeguimiento
async function eliminarSeguimiento(id){
    const consulta = `
    DELETE FROM seguimiento
    WHERE id_seguimiento = $1
    RETURNING id_seguimiento;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarSeguimientos()
async function listarSeguimientos(){
    const consulta = `
    SELECT id_seguimiento, id_personal, id_alumno, fecha, observacion
    FROM seguimiento
    ORDER BY id_seguimiento;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarSeguimiento()
async function actualizarSeguimiento(id, datos){
    const consulta = `
    UPDATE seguimiento
    SET id_personal = $1, id_alumno = $2, fecha = COALESCE($3, CURRENT_DATE), observacion = $4
    WHERE id_seguimiento = $5
    RETURNING id_seguimiento, id_personal, id_alumno, fecha, observacion;
    `;

    const resultado = await pool.query(consulta, [datos.id_personal ?? null, datos.id_alumno ?? null, datos.fecha ?? null, datos.observacion ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerSeguimientoPorId()
async function obtenerSeguimientoPorId(id){
    const consulta = `
    SELECT id_seguimiento, id_personal, id_alumno, fecha, observacion
    FROM seguimiento
    WHERE id_seguimiento = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarSeguimientos, eliminarSeguimiento, crearSeguimiento, actualizarSeguimiento, obtenerSeguimientoPorId};
