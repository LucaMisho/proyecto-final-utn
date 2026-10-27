const pool = require ("./conexion");

//crearSede
async function crearSede(datos){
    const consulta = `
    INSERT INTO sede (nombre, direccion, descripcion)
    VALUES ($1, $2, $3)
    RETURNING id_sede, nombre, direccion, descripcion;
    `;

    const resultado = await pool.query(consulta, [datos.nombre ?? null, datos.direccion ?? null, datos.descripcion ?? null]);
    return resultado.rows[0];
}


//eliminarSede
async function eliminarSede(id){
    const consulta = `
    DELETE FROM sede
    WHERE id_sede = $1
    RETURNING id_sede;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarSedes()
async function listarSedes(){
    const consulta = `
    SELECT id_sede, nombre, direccion, descripcion
    FROM sede
    ORDER BY id_sede;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarSede()
async function actualizarSede(id, datos){
    const consulta = `
    UPDATE sede
    SET nombre = $1, direccion = $2, descripcion = $3
    WHERE id_sede = $4
    RETURNING id_sede, nombre, direccion, descripcion;
    `;

    const resultado = await pool.query(consulta, [datos.nombre ?? null, datos.direccion ?? null, datos.descripcion ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerSedePorId()
async function obtenerSedePorId(id){
    const consulta = `
    SELECT id_sede, nombre, direccion, descripcion
    FROM sede
    WHERE id_sede = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarSedes, eliminarSede, crearSede, actualizarSede, obtenerSedePorId};
