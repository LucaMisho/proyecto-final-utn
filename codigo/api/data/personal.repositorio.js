const pool = require ("./conexion");

//crearPersonal
async function crearPersonal(datos){
    const consulta = `
    INSERT INTO personal (id_usuario, funcion)
    VALUES ($1, $2)
    RETURNING id_personal, id_usuario, funcion;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.funcion ?? null]);
    return resultado.rows[0];
}


//eliminarPersonal
async function eliminarPersonal(id){
    const consulta = `
    DELETE FROM personal
    WHERE id_personal = $1
    RETURNING id_personal;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarPersonal()
async function listarPersonal(){
    const consulta = `
    SELECT id_personal, id_usuario, funcion
    FROM personal
    ORDER BY id_personal;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarPersonal()
async function actualizarPersonal(id, datos){
    const consulta = `
    UPDATE personal
    SET id_usuario = $1, funcion = $2
    WHERE id_personal = $3
    RETURNING id_personal, id_usuario, funcion;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.funcion ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerPersonalPorId()
async function obtenerPersonalPorId(id){
    const consulta = `
    SELECT id_personal, id_usuario, funcion
    FROM personal
    WHERE id_personal = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarPersonal, eliminarPersonal, crearPersonal, actualizarPersonal, obtenerPersonalPorId};
