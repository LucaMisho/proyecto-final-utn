const pool = require ("./conexion");

//crearNoticia
async function crearNoticia(datos){
    const consulta = `
    INSERT INTO noticia (titulo, contenido, imagen, estado)
    VALUES ($1, $2, $3, COALESCE($4, 'activa'))
    RETURNING id_noticia, titulo, contenido, imagen, estado, fecha_publicacion;
    `;

    const resultado = await pool.query(consulta, [datos.titulo ?? null, datos.contenido ?? null, datos.imagen ?? null, datos.estado ?? null]);
    return resultado.rows[0];
}


//eliminarNoticia
async function eliminarNoticia(id){
    const consulta = `
    DELETE FROM noticia
    WHERE id_noticia = $1
    RETURNING id_noticia;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarNoticias()
async function listarNoticias(){
    const consulta = `
    SELECT id_noticia, titulo, contenido, imagen, estado, fecha_publicacion
    FROM noticia
    ORDER BY id_noticia;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarNoticia()
async function actualizarNoticia(id, datos){
    const consulta = `
    UPDATE noticia
    SET titulo = $1, contenido = $2, imagen = $3, estado = COALESCE($4, 'activa')
    WHERE id_noticia = $5
    RETURNING id_noticia, titulo, contenido, imagen, estado, fecha_publicacion;
    `;

    const resultado = await pool.query(consulta, [datos.titulo ?? null, datos.contenido ?? null, datos.imagen ?? null, datos.estado ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerNoticiaPorId()
async function obtenerNoticiaPorId(id){
    const consulta = `
    SELECT id_noticia, titulo, contenido, imagen, estado, fecha_publicacion
    FROM noticia
    WHERE id_noticia = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarNoticias, eliminarNoticia, crearNoticia, actualizarNoticia, obtenerNoticiaPorId};
