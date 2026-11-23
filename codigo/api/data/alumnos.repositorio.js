const pool = require ("./conexion");

//crearAlumno
async function crearAlumno(datos){
    const consulta = `
    INSERT INTO alumno (nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio, fecha_nacimiento)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio, to_char(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento;
    `;

    const resultado = await pool.query(consulta, [datos.nombre , datos.apellido , datos.dni, datos.telefono ?? null, datos.tiene_beca ?? false, datos.estudios_completos ?? false, datos.colegio ?? null, datos.fecha_nacimiento || null]);
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
    SELECT id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio, to_char(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento
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
    SET nombre = $1, apellido = $2, dni = $3, telefono = $4, tiene_beca = $5, estudios_completos = $6, colegio = $7, fecha_nacimiento = $8
    WHERE id_alumno = $9
    RETURNING id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio, to_char(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento;
    `;

    const resultado = await pool.query(consulta, [datos.nombre, datos.apellido, datos.dni, datos.telefono ?? null, datos.tiene_beca ?? false, datos.estudios_completos ?? false, datos.colegio ?? null, datos.fecha_nacimiento || null, id]);
    return resultado.rows[0] || null;

}

//obtenerAlumnoPorId()
async function obtenerAlumnoPorId(id){
    const consulta = `
    SELECT id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio, to_char(fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento
    FROM alumno
    WHERE id_alumno = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarAlumnos, eliminarAlumno, crearAlumno, actualizarAlumno, obtenerAlumnoPorId};
