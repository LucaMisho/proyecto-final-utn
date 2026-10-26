const pool = require ("./conexion");

//crearAlumno
async function crearAlumno(datos){
    const consulta = `
    INSERT INTO alumno (id_usuario, dni, tiene_beca, estudios_completos, colegio)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_alumno, id_usuario, dni, tiene_beca, estudios_completos, colegio;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.dni ?? null, datos.tiene_beca ?? false, datos.estudios_completos ?? false, datos.colegio ?? null]);
    return resultado.rows[0];
}


//eliminarAlumno
async function eliminarAlumno(id){
    const consulta = `
    DELETE FROM alumno
    WHERE id_alumno = $1
    RETURNING id_alumno;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rowCount > 0;
}

//listarAlumnos()
async function listarAlumnos(){
    const consulta = `
    SELECT id_alumno, id_usuario, dni, tiene_beca, estudios_completos, colegio
    FROM alumno
    ORDER BY id_alumno;
    `;

    const resultado = await pool.query(consulta);
    return resultado.rows;
}

//actualizarAlumno()
async function actualizarAlumno(id, datos){
    const consulta = `
    UPDATE alumno
    SET id_usuario = $1, dni = $2, tiene_beca = $3, estudios_completos = $4, colegio = $5
    WHERE id_alumno = $6
    RETURNING id_alumno, id_usuario, dni, tiene_beca, estudios_completos, colegio;
    `;

    const resultado = await pool.query(consulta, [datos.id_usuario ?? null, datos.dni ?? null, datos.tiene_beca ?? false, datos.estudios_completos ?? false, datos.colegio ?? null, id]);
    return resultado.rows[0] || null;

}

//obtenerAlumnoPorId()
async function obtenerAlumnoPorId(id){
    const consulta = `
    SELECT id_alumno, id_usuario, dni, tiene_beca, estudios_completos, colegio
    FROM alumno
    WHERE id_alumno = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarAlumnos, eliminarAlumno, crearAlumno, actualizarAlumno, obtenerAlumnoPorId};
