const pool = require ("./conexion");

//crearUsuario
async function crearUsuario(datos, contrasenaHash){
    const consulta = `
    INSERT INTO usuario (username, nombre, apellido, email, telefono, contrasena, rol)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id_usuario, username, nombre, apellido, email, telefono, rol, estado;
    `;

    const resultado = await pool.query(consulta, [datos.username ?? null, datos.nombre ?? null, datos.apellido ?? null, datos.email ?? null, datos.telefono ?? null, contrasenaHash, datos.rol ?? "USUARIO"]);
    return resultado.rows[0];
}


//eliminarUsuario
async function eliminarUsuario(id){
    const consulta = `
    DELETE FROM usuario
    WHERE id_usuario = $1
    RETURNING id_usuario;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarUsuarios()
async function listarUsuarios(){
    const consulta = `
    SELECT id_usuario, username, nombre, apellido, email, telefono, rol, estado
    FROM usuario
    ORDER BY id_usuario;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarUsuario()
async function actualizarUsuario(id, datos){
    const consulta = `
    UPDATE usuario
    SET username = $1, nombre = $2, apellido = $3, email = $4, telefono = $5, rol = $6, estado = $7
    WHERE id_usuario = $8
    RETURNING id_usuario, username, nombre, apellido, email, telefono, rol, estado;
    `;

    const resultado = await pool.query(consulta, [datos.username ?? null, datos.nombre ?? null, datos.apellido ?? null, datos.email ?? null, datos.telefono ?? null, datos.rol ?? "USUARIO", datos.estado ?? true, id]);
    return resultado.rows[0] || null;

}

//obtenerUsuarioPorId()
async function obtenerUsuarioPorId(id){
    const consulta = `
    SELECT id_usuario, username, nombre, apellido, email, telefono, rol, estado
    FROM usuario
    WHERE id_usuario = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarUsuarios, eliminarUsuario, crearUsuario, actualizarUsuario, obtenerUsuarioPorId};
