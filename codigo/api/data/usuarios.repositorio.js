const pool = require ("./conexion");

//crearUsuario
async function crearUsuario(datos, contrasenaHash){
    const consulta = `
    INSERT INTO usuario (username, email, contraseña, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING id_usuario, username, email, rol, fecha_registro, estado;
    `;

    const resultado = await pool.query(consulta, [datos.username , datos.email , contrasenaHash, "USUARIO"]);
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
    SELECT id_usuario, username, email, rol, estado
    FROM usuario
    ORDER BY id_usuario;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarUsuario()
async function actualizarUsuario(id, datos, contrasenaHash){
    const consulta = `
    UPDATE usuario
    SET username = $1, email = $2, contraseña = $3
    WHERE id_usuario = $4
    RETURNING id_usuario, username, email, rol, estado;
    `;

    const resultado = await pool.query(consulta, [datos.username, datos.email, contrasenaHash, id]);
    return resultado.rows[0] || null;

}

//obtenerUsuarioPorId()
async function obtenerUsuarioPorId(id){
    const consulta = `
    SELECT id_usuario, username, email, rol, estado
    FROM usuario
    WHERE id_usuario = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

//buscarPorUsername()
async function buscarPorUsername(username) {
    const consulta = `
        SELECT id_usuario, username, email, contraseña, rol, estado
        FROM usuario
        WHERE username = $1;
    `;

    const resultado = await pool.query(consulta, [username]);

    return resultado.rows[0] || null;
}



module.exports = {
    listarUsuarios, 
    eliminarUsuario, 
    crearUsuario, 
    actualizarUsuario, 
    obtenerUsuarioPorId,
    buscarPorUsername
};
