
const pool = require("./conexion");

// Crear seguimiento
async function crearSeguimiento(datos) {
    const consulta = `
        INSERT INTO seguimiento (id_usuario, id_alumno, fecha, observacion)
        VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4)
        RETURNING id_seguimiento, id_usuario, id_alumno, fecha, observacion;
    `;

    const resultado = await pool.query(consulta, [
        datos.id_usuario,
        datos.id_alumno,
        datos.fecha ?? null,
        datos.observacion
    ]);

    return resultado.rows[0];
}

// Obtener personal por ID
async function obtenerPersonalPorId(id_usuario) {
    const consulta = `
        SELECT id_usuario, username
        FROM usuario
        WHERE id_usuario = $1
        AND rol = 'PERSONAL'
        AND estado = TRUE;
    `;

    const resultado = await pool.query(consulta, [id_usuario]);

    return resultado.rows[0] || null;
}

// Eliminar seguimiento
async function eliminarSeguimiento(id) {
    const consulta = `
        DELETE FROM seguimiento
        WHERE id_seguimiento = $1
        RETURNING id_seguimiento;
    `;

    const resultado = await pool.query(consulta, [id]);

    return resultado.rowCount > 0;
}

// Listar seguimientos
async function listarSeguimientos() {
    const consulta = `
        SELECT id_seguimiento, id_usuario, id_alumno, fecha, observacion
        FROM seguimiento
        ORDER BY id_seguimiento;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}

// Actualizar seguimiento
async function actualizarSeguimiento(id, datos) {
    const consulta = `
        UPDATE seguimiento
        SET id_alumno = $1,
            fecha = COALESCE($2, fecha),
            observacion = $3
        WHERE id_seguimiento = $4
        RETURNING id_seguimiento, id_usuario, id_alumno, fecha, observacion;
    `;

    const resultado = await pool.query(consulta, [
        datos.id_alumno,
        datos.fecha ?? null,
        datos.observacion,
        id
    ]);

    return resultado.rows[0] || null;
}

// Obtener seguimiento por ID
async function obtenerSeguimientoPorId(id) {
    const consulta = `
        SELECT id_seguimiento, id_usuario, id_alumno, fecha, observacion
        FROM seguimiento
        WHERE id_seguimiento = $1;
    `;

    const resultado = await pool.query(consulta, [id]);

    return resultado.rows[0] || null;
}

module.exports = {
    listarSeguimientos,
    eliminarSeguimiento,
    crearSeguimiento,
    actualizarSeguimiento,
    obtenerSeguimientoPorId,
    obtenerPersonalPorId
};
