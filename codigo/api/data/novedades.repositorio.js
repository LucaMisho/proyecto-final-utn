const pool = require("./conexion");

//listarNovedades
async function listarNovedades(){
    const consulta = `
    SELECT id_novedad, titulo, descripcion, categoria, imagen, fecha
    FROM novedades
    ORDER BY fecha DESC, id_novedad DESC;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//obtenerNovedadPorId
async function obtenerNovedadPorId(id){
    const consulta = `
    SELECT id_novedad, titulo, descripcion, categoria, imagen, fecha
    FROM novedades
    WHERE id_novedad = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

//crearNovedad
async function crearNovedad(datos){
    const consulta = `
    INSERT INTO novedades (titulo, descripcion, categoria, imagen)
    VALUES ($1, $2, $3, $4)
    RETURNING id_novedad, titulo, descripcion, categoria, imagen, fecha;
    `;

    const resultado = await pool.query(consulta, [
        datos.titulo, datos.descripcion, datos.categoria, datos.imagen ?? null
    ]);
    return resultado.rows[0];
}

//actualizarNovedad
async function actualizarNovedad(id, datos){
    const consulta = `
    UPDATE novedades
    SET titulo = $1, descripcion = $2, categoria = $3, imagen = $4
    WHERE id_novedad = $5
    RETURNING id_novedad, titulo, descripcion, categoria, imagen, fecha;
    `;

    const resultado = await pool.query(consulta, [
        datos.titulo, datos.descripcion, datos.categoria, datos.imagen ?? null, id
    ]);
    return resultado.rows[0] || null;
}

//eliminarNovedad
async function eliminarNovedad(id){
    const consulta = `
    DELETE FROM novedades
    WHERE id_novedad = $1
    RETURNING id_novedad;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

module.exports = {
  listarNovedades, obtenerNovedadPorId, crearNovedad, actualizarNovedad, eliminarNovedad
};