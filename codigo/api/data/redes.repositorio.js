const pool = require ("./conexion");

//crearRed
async function crearRed(datos){
    const consulta = `
    INSERT INTO red_social (id_sede, tipo, url, estado)
    VALUES ($1, $2, $3, COALESCE($4, 'activa'))
    RETURNING id_red, id_sede, tipo, url, estado;
    `;

    const resultado = await pool.query(consulta, [datos.id_sede ?? null, datos.tipo ?? null, datos.url ?? null, datos.estado ?? null]);
    return resultado.rows[0];
}


//eliminarRed
async function eliminarRed(id){
    const consulta = `
    DELETE FROM red_social
    WHERE id_red = $1
    RETURNING id_red;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarRedes()
async function listarRedes(){
    const consulta = `
    SELECT id_red, id_sede, tipo, url, estado
    FROM red_social
    ORDER BY id_red;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarRed()
async function actualizarRed(id, datos){
    const consulta = `
    UPDATE red_social
    SET id_sede = $1, tipo = $2, url = $3, estado = COALESCE($4, 'activa')
    WHERE id_red = $5
    RETURNING id_red, id_sede, tipo, url, estado;
    `;

    const resultado = await pool.query(consulta, [datos.id_sede ?? null, datos.tipo ?? null, datos.url ?? null, datos.estado ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerRedPorId()
async function obtenerRedPorId(id){
    const consulta = `
    SELECT id_red, id_sede, tipo, url, estado
    FROM red_social
    WHERE id_red = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarRedes, eliminarRed, crearRed, actualizarRed, obtenerRedPorId};
