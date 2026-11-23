const pool = require ("./conexion");

//crearAsistencia
async function crearAsistencia(datos){
    const consulta = `
    INSERT INTO asistencia (id_alumno, id_taller, fecha, presente)
    VALUES ($1, $2, $3, COALESCE($4, FALSE))
    RETURNING id_asistencia, id_alumno, id_taller, fecha, presente;
    `;

    const resultado = await pool.query(consulta, [datos.id_alumno ?? null, datos.id_taller ?? null, datos.fecha ?? null, datos.presente ?? null]);
    return resultado.rows[0];
}


//eliminarAsistencia
async function eliminarAsistencia(id){
    const consulta = `
    DELETE FROM asistencia
    WHERE id_asistencia = $1
    RETURNING id_asistencia;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarAsistencias()
async function listarAsistencias(){
    const consulta = `
    SELECT id_asistencia, id_alumno, id_taller, fecha, presente
    FROM asistencia
    ORDER BY id_asistencia;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarAsistencia()
async function actualizarAsistencia(id, datos){
    const consulta = `
    UPDATE asistencia
    SET id_alumno = $1, id_taller = $2, fecha = $3, presente = COALESCE($4, FALSE)
    WHERE id_asistencia = $5
    RETURNING id_asistencia, id_alumno, id_taller, fecha, presente;
    `;

    const resultado = await pool.query(consulta, [datos.id_alumno ?? null, datos.id_taller ?? null, datos.fecha ?? null, datos.presente ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerAsistenciaPorId()
async function obtenerAsistenciaPorId(id){
    const consulta = `
    SELECT id_asistencia, id_alumno, id_taller, fecha, presente
    FROM asistencia
    WHERE id_asistencia = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

//listarAlumnosDePlanilla()
// Alumnos aceptados en el taller más los que tengan asistencias en el mes consultado,
// para no perder el historial de alumnos que ya no están inscriptos.
async function listarAlumnosDePlanilla(idTaller, fechaDesde, fechaHasta){
    const consulta = `
    SELECT a.id_alumno, a.apellido, a.nombre
    FROM alumno a
    WHERE a.id_alumno IN (
        SELECT i.id_alumno
        FROM inscripcion i
        WHERE i.id_taller = $1 AND i.estado = 'aceptada'
        UNION
        SELECT s.id_alumno
        FROM asistencia s
        WHERE s.id_taller = $1 AND s.fecha >= $2 AND s.fecha < $3
    )
    ORDER BY a.apellido, a.nombre, a.id_alumno;
    `;

    const resultado = await pool.query(consulta, [idTaller, fechaDesde, fechaHasta]);
    return resultado.rows;
}

//listarAsistenciasDelMes()
async function listarAsistenciasDelMes(idTaller, fechaDesde, fechaHasta){
    const consulta = `
    SELECT id_alumno, fecha, presente
    FROM asistencia
    WHERE id_taller = $1 AND fecha >= $2 AND fecha < $3
    ORDER BY fecha, id_alumno;
    `;

    const resultado = await pool.query(consulta, [idTaller, fechaDesde, fechaHasta]);
    return resultado.rows;
}

//guardarPlanillaDelMes()
// Reemplaza las marcas del taller para el mes indicado dentro de una transacción.
// Las celdas vacías no llegan en "marcas": al borrar las filas del mes y volver
// a insertar solo las marcas enviadas, una celda vacía queda sin fila en la base.
async function guardarPlanillaDelMes(idTaller, fechaDesde, fechaHasta, marcas){
    const cliente = await pool.connect();

    try {
        await cliente.query("BEGIN");

        await cliente.query(
            `DELETE FROM asistencia
             WHERE id_taller = $1 AND fecha >= $2 AND fecha < $3;`,
            [idTaller, fechaDesde, fechaHasta]
        );

        if (marcas.length > 0) {
            await cliente.query(
                `INSERT INTO asistencia (id_alumno, id_taller, fecha, presente)
                 SELECT alumno_id, $1, fecha, presente
                 FROM UNNEST($2::int[], $3::date[], $4::boolean[]) AS t(alumno_id, fecha, presente);`,
                [
                    idTaller,
                    marcas.map((marca) => marca.id_alumno),
                    marcas.map((marca) => marca.fecha),
                    marcas.map((marca) => marca.presente)
                ]
            );
        }

        await cliente.query("COMMIT");
    } catch (error) {
        await cliente.query("ROLLBACK").catch(() => {});
        throw error;
    } finally {
        cliente.release();
    }
}

//tieneInscripcionAceptada()
async function tieneInscripcionAceptada(idAlumno, idTaller){
    const consulta = `
    SELECT 1
    FROM inscripcion
    WHERE id_alumno = $1 AND id_taller = $2 AND estado = 'aceptada'
    LIMIT 1;
    `;

    const resultado = await pool.query(consulta, [idAlumno, idTaller]);
    return resultado.rowCount > 0;
}

module.exports = {
    tieneInscripcionAceptada,
    listarAsistencias,
    eliminarAsistencia,
    crearAsistencia,
    actualizarAsistencia,
    obtenerAsistenciaPorId,
    listarAlumnosDePlanilla,
    listarAsistenciasDelMes,
    guardarPlanillaDelMes
};
