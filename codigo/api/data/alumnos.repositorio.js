const pool = require ("./conexion");

//crearAlumno
async function crearAlumno(datos){
    const consulta = `
    INSERT INTO alumno (nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio;
    `;

    const resultado = await pool.query(consulta, [datos.nombre , datos.apellido , datos.dni , datos.telefono, datos.tiene_beca , datos.estudios_completos , datos.colegio ]);
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
    SELECT id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio
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
    SET nombre = $1, apellido = $2, dni = $3, telefono = $4, tiene_beca = $5, estudios_completos = $6, colegio = $7
    WHERE id_alumno = $8
    RETURNING id_alumno, nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio;
    `;

    const resultado = await pool.query(consulta, [datos.nombre, datos.apellido, datos.dni, datos.telefono, datos.tiene_beca, datos.estudios_completos, datos.colegio, id]);
    return resultado.rows[0] || null;

}

//obtenerAlumnoPorId()
async function obtenerAlumnoPorId(id){
    const consulta = `
    SELECT id_alumno, nombre, apellido, dni, tiene_beca, estudios_completos, colegio
    FROM alumno
    WHERE id_alumno = $1;
    `;

    const resultado = await pool.query(consulta, [id]);
    return resultado.rows[0] || null;
}

module.exports = {listarAlumnos, eliminarAlumno, crearAlumno, actualizarAlumno, obtenerAlumnoPorId};
