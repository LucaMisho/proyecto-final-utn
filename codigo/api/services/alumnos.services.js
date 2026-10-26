const alumnoRepositorio = require("../data/alumnos.repositorio");

//listarAlumnos()
async function listarAlumnos() {
    return alumnoRepositorio.listarAlumnos();
}

//obtenerAlumnoPorId()
async function obtenerAlumno(id) {
    const alumno = await alumnoRepositorio.obtenerAlumnoPorId(id);

    if (!alumno) {
        throw new Error("Alumno no encontrado");
    }

    return alumno;
}

//crearAlumno()
async function crearAlumno(datos) {
    for (const campo of ["nombre", "apellido", "dni"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return alumnoRepositorio.crearAlumno(datos);
}

//actualizarAlumno
async function actualizarAlumno(id, datos) {
    const alumno = await alumnoRepositorio.obtenerAlumnoPorId(id);

    if (!alumno) {
        throw new Error("Alumno no encontrado");
    }

    for (const campo of ["nombre", "apellido", "dni"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new Error(`El campo ${campo} es obligatorio`);
        }
    }

    return alumnoRepositorio.actualizarAlumno(id, datos);
}

//borrarAlumno()
async function borrarAlumno(id) {
    const alumno = await alumnoRepositorio.obtenerAlumnoPorId(id);

    if (!alumno) {
        throw new Error("Alumno no encontrado");
    }

    return alumnoRepositorio.eliminarAlumno(id);
}

module.exports = {
    listarAlumnos,
    obtenerAlumno,
    crearAlumno,
    actualizarAlumno,
    borrarAlumno
};
