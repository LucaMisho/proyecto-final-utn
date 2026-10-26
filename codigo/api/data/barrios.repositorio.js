const pool = require ("./conexion");

//crearBarrio
async function crearBarrio(nombre, descripcion){
    const consulta = `
    INSERT INTO barrio (nombre, descripcion)
    VALUES ($1, $2)
    RETURNING id_barrio, nombre, descripcion;
    `;

    const resultado = await pool.query(consulta, [nombre, descripcion]);
    return resultado.rows[0];
}


//eliminarBarrio
async function eliminarBarrio(id){
    const consulta = `
    DELETE FROM barrio
    WHERE id_barrio = $1
    RETURNING id_barrio;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarBarrios()
async function listarBarrios(){
    const consulta = `
    SELECT *
    FROM barrio
    ORDER BY id_barrio;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarBarrio()
async function actualizarBarrio(id, nombre, descripcion){
    const consulta = `
    UPDATE barrio
    SET nombre = $1,
    descripcion = $2
    WHERE id_barrio = $3
    RETURNING id_barrio, nombre, descripcion;
    `;

    const resultado = await pool.query(consulta, [id, nombre, descripcion]);
    return resultado.rows[0] || null;

}

//obtenerBarrioPorId()
async function obtenerBarrioPorId(id){
    consulta = `
    SELECT id_barrio, nombre, descripcion
    FROM barrio
    WHERE id_barrio = $1;
    `; 

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarBarrios, eliminarBarrio, crearBarrio, actualizarBarrio, obtenerBarrioPorId};

