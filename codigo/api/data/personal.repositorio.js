const pool = require ("./conexion");

//crearPersonal
async function crearPersonal(datos){
    const consulta = `
    INSERT INTO personal (id_usuario, nombre, apellido, dni, telefono, funcion)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id_personal, id_usuario, nombre, apellido, dni, telefono, funcion;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ,datos.nombre, datos.apellido, datos.dni, datos.telefono, datos.funcion ?? null]);
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
    SELECT id_personal, id_usuario, nombre, apellido, dni, telefono, funcion
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
    SET id_usuario = $1, nombre = $2, apellido = $3, dni = $4, telefono = $5, funcion = $6
    WHERE id_personal = $7
    RETURNING id_personal, id_usuario, nombre, apellido, dni, telefono, funcion;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.nombre, datos.apellido, datos.dni, datos.telefono, datos.funcion ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerPersonalPorId()
async function obtenerPersonalPorId(id){
    const consulta = `
    SELECT id_personal, id_usuario, nombre, apellido, dni, telefono,funcion
    FROM personal
    WHERE id_personal = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarPersonal, eliminarPersonal, crearPersonal, actualizarPersonal, obtenerPersonalPorId};
