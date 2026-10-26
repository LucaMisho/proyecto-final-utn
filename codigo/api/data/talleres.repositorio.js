const pool = require ("./conexion");

//crearTaller
async function crearTaller(datos){
    const consulta = `
    INSERT INTO taller (nombre, descripcion, dia, hora_inicio, hora_fin, edad_minima, edad_maxima, id_barrio, cupo)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id_taller, nombre, descripcion, dia, hora_inicio, hora_fin, edad_minima, edad_maxima, id_barrio, cupo, activo;
    `;

    const resultado = await pool.query(consulta, [datos.nombre ?? null, datos.descripcion ?? null, datos.dia ?? null, datos.hora_inicio ?? null, datos.hora_fin ?? null, datos.edad_minima ?? null, datos.edad_maxima ?? null, datos.id_barrio ?? null, datos.cupo ?? null]);
    return resultado.rows[0];
}


//eliminarTaller
async function eliminarTaller(id){
    const consulta = `
    DELETE FROM taller
    WHERE id_taller = $1
    RETURNING id_taller;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarTalleres()
async function listarTalleres(){
    const consulta = `
    SELECT id_taller, nombre, descripcion, dia, hora_inicio, hora_fin, edad_minima, edad_maxima, id_barrio, cupo, activo
    FROM taller
    ORDER BY id_taller;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarTaller()
async function actualizarTaller(id, datos){
    const consulta = `
    UPDATE taller
    SET nombre = $1, descripcion = $2, dia = $3, hora_inicio = $4, hora_fin = $5, edad_minima = $6, edad_maxima = $7, id_barrio = $8, cupo = $9
    WHERE id_taller = $10
    RETURNING id_taller, nombre, descripcion, dia, hora_inicio, hora_fin, edad_minima, edad_maxima, id_barrio, cupo, activo;
    `;

    const resultado = await pool.query(consulta, [datos.nombre ?? null, datos.descripcion ?? null, datos.dia ?? null, datos.hora_inicio ?? null, datos.hora_fin ?? null, datos.edad_minima ?? null, datos.edad_maxima ?? null, datos.id_barrio ?? null, datos.cupo ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerTallerPorId()
async function obtenerTallerPorId(id){
    const consulta = `
    SELECT id_taller, nombre, descripcion, dia, hora_inicio, hora_fin, edad_minima, edad_maxima, id_barrio, cupo, activo
    FROM taller
    WHERE id_taller = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarTalleres, eliminarTaller, crearTaller, actualizarTaller, obtenerTallerPorId};
