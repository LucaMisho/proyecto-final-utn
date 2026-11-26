const alumnoRepositorio = require("../data/alumnos.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarAlumnos()
async function listarAlumnos() {
    return alumnoRepositorio.listarAlumnos();
}

//obtenerAlumnoPorId()
async function obtenerAlumno(id) {
    const alumno = await alumnoRepositorio.obtenerAlumnoPorId(id);

    if (!alumno) {
        throw new ErrorNoEncontrado("Alumno no encontrado");
    }

    return alumno;
}

function validarFechaNacimiento(valor) {
    if (valor === undefined || valor === null || String(valor).trim() === "") return;

    const texto = String(valor).slice(0, 10);
    const fecha = new Date(`${texto}T00:00:00Z`);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto) || Number.isNaN(fecha.getTime())) {
        throw new ErrorDeDatos("La fecha de nacimiento no es válida");
    }

    if (fecha > new Date()) {
        throw new ErrorDeDatos("La fecha de nacimiento no puede ser futura");
    }

    if (fecha.getUTCFullYear() < 1900) {
        throw new ErrorDeDatos("La fecha de nacimiento no es válida");
    }
}

const EDAD_MINIMA = 5;

function validarEdadMinima(valor, hoy = new Date()) {
    if (valor === undefined || valor === null || String(valor).trim() === "") return;

    validarFechaNacimiento(valor); // lanza error si la fecha no es válida

    const [anio, mes, dia] = String(valor).slice(0, 10).split("-").map(Number);

    let edad = hoy.getUTCFullYear() - anio;
    const cumplioEsteAnio =
        hoy.getUTCMonth() + 1 > mes ||
        (hoy.getUTCMonth() + 1 === mes && hoy.getUTCDate() >= dia);

    if (!cumplioEsteAnio) edad -= 1;

    if (edad < EDAD_MINIMA) {
        throw new ErrorDeDatos(`La edad mínima es de ${EDAD_MINIMA} años`);
    }
}

//crearAlumno()
async function crearAlumno(datos) {
    for (const campo of ["nombre", "apellido", "dni"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    validarEdadMinima(datos.fecha_nacimiento);

    return alumnoRepositorio.crearAlumno(datos);
}

//actualizarAlumno
async function actualizarAlumno(id, datos) {
    const alumno = await alumnoRepositorio.obtenerAlumnoPorId(id);

    if (!alumno) {
        throw new ErrorNoEncontrado("Alumno no encontrado");
    }

    for (const campo of ["nombre", "apellido", "dni"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    validarEdadMinima(datos.fecha_nacimiento);

    return alumnoRepositorio.actualizarAlumno(id, datos);
}

//borrarAlumno()
async function borrarAlumno(id) {
    const alumno = await alumnoRepositorio.obtenerAlumnoPorId(id);

    if (!alumno) {
        throw new ErrorNoEncontrado("Alumno no encontrado");
    }

    return alumnoRepositorio.eliminarAlumno(id);
}

module.exports = {
    listarAlumnos,
    obtenerAlumno,
    crearAlumno,
    actualizarAlumno,
    borrarAlumno,
    validarEdadMinima
};
