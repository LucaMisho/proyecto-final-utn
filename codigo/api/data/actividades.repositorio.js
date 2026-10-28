const pool = require ("./conexion");

//crearActividad
async function crearActividad(datos){
    const consulta = `
    INSERT INTO actividad (id_taller, id_barrio, nombre, descripcion, fecha, estado)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id_actividad, id_taller, id_barrio, nombre, descripcion, fecha, estado;
    `;

    const resultado = await pool.query(consulta, [datos.id_taller ?? null, datos.id_barrio ?? null, datos.nombre ?? null, datos.descripcion ?? null, datos.fecha ?? null, datos.estado ?? null]);
    return resultado.rows[0];
}


//eliminarActividad
async function eliminarActividad(id){
    const consulta = `
    DELETE FROM actividad
    WHERE id_actividad = $1
    RETURNING id_actividad;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarActividades()
async function listarActividades(){
    const consulta = `
    SELECT id_actividad, id_taller, id_barrio, nombre, descripcion, fecha, estado
    FROM actividad
    ORDER BY id_actividad;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarActividad()
async function actualizarActividad(id, datos){
    const consulta = `
    UPDATE actividad
    SET id_taller = $1, id_barrio = $2, nombre = $3, descripcion = $4, fecha = $5, estado = $6
    WHERE id_actividad = $7
    RETURNING id_actividad, id_taller, id_barrio, nombre, descripcion, fecha, estado;
    `;

    const resultado = await pool.query(consulta, [datos.id_taller ?? null, datos.id_barrio ?? null, datos.nombre ?? null, datos.descripcion ?? null, datos.fecha ?? null, datos.estado ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerActividadPorId()
async function obtenerActividadPorId(id){
    const consulta = `
    SELECT id_actividad, id_taller, id_barrio, nombre, descripcion, fecha, estado
    FROM actividad
    WHERE id_actividad = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarActividades, eliminarActividad, crearActividad, actualizarActividad, obtenerActividadPorId};
