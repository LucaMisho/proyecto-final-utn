const pool = require ("./conexion");

//crearUsuario
async function crearUsuario(datos, claveHash){
    const consulta = `
    INSERT INTO usuario (username, email, contraseña, rol, correo_verificado)
    VALUES ($1, $2, $3, $4, TRUE)
    RETURNING id_usuario, username, email, rol, fecha_registro, estado, correo_verificado;
    `;

    const resultado = await pool.query(consulta, [datos.username, datos.email, claveHash, datos.rol ?? "USUARIO"]);
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
async function actualizarUsuario(id, datos, claveHash){
    const consulta = `
    UPDATE usuario
    SET username = $1, email = $2, rol = COALESCE($3, rol), estado = COALESCE($4, estado), contraseña = COALESCE($5, contraseña)
    WHERE id_usuario = $6
    RETURNING id_usuario, username, email, rol, fecha_registro, estado;
    `;

    const resultado = await pool.query(consulta, [datos.username, datos.email, datos.rol ?? null, datos.estado ?? null, claveHash ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerUsuarioPorId()
async function obtenerUsuarioPorId(id){
    const consulta = `
    SELECT id_usuario, username, email, rol, estado, correo_verificado
    FROM usuario
    WHERE id_usuario = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

//buscarPorUsername()
async function buscarPorUsername(username) {
    const consulta = `
        SELECT id_usuario, username, email, contraseña, rol, estado, correo_verificado
        FROM usuario
        WHERE username = $1;
    `;

    const resultado = await pool.query(consulta, [username]);

    return resultado.rows[0] || null;
}

const actualizarPerfil = async (id_usuario, { username, email, claveHash }) => {
  const consulta = `
    UPDATE usuario
       SET username   = COALESCE($1, username),
           email      = COALESCE($2, email),
           contraseña = COALESCE($3, contraseña)
     WHERE id_usuario = $4
    RETURNING id_usuario, username, email, rol, fecha_registro, estado;
  `;
  const resultado = await pool.query(consulta, [
    username ?? null,
    email ?? null,
    claveHash ?? null,
    id_usuario
  ]);
  return resultado.rows[0];
};

// Verificar correo electrónico
async function verificarCorreo(email) {
    const consulta = `
        UPDATE usuario
        SET correo_verificado = TRUE
        WHERE email = $1
        RETURNING id_usuario, username, email, correo_verificado;
    `;

    const resultado = await pool.query(consulta, [email]);

    return resultado.rows[0] || null;
}

module.exports = {
    listarUsuarios, 
    eliminarUsuario, 
    crearUsuario, 
    actualizarUsuario, 
    obtenerUsuarioPorId,
    buscarPorUsername,
    actualizarPerfil,
    verificarCorreo
};
