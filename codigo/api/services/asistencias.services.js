const asistenciaRepositorio = require("../data/asistencias.repositorio");
const tallerRepositorio = require("../data/talleres.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarAsistencias()
async function listarAsistencias() {
    return asistenciaRepositorio.listarAsistencias();
}

//obtenerAsistenciaPorId()
async function obtenerAsistencia(id) {
    const asistencia = await asistenciaRepositorio.obtenerAsistenciaPorId(id);

    if (!asistencia) {
        throw new ErrorNoEncontrado("Asistencia no encontrada");
    }

    return asistencia;
}

async function exigirInscripcion(idAlumno, idTaller) {
    const inscripto = await asistenciaRepositorio.tieneInscripcionAceptada(idAlumno, idTaller);

    if (!inscripto) {
        throw new ErrorDeDatos("El alumno no tiene una inscripción aceptada en ese taller");
    }
}

//crearAsistencia()
async function crearAsistencia(datos) {
    for (const campo of ["id_alumno", "id_taller", "fecha"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    await exigirInscripcion(datos.id_alumno, datos.id_taller);

    return asistenciaRepositorio.crearAsistencia(datos);
}

//actualizarAsistencia
async function actualizarAsistencia(id, datos) {
    const asistencia = await asistenciaRepositorio.obtenerAsistenciaPorId(id);

    if (!asistencia) {
        throw new ErrorNoEncontrado("Asistencia no encontrada");
    }

    for (const campo of ["id_alumno", "id_taller", "fecha"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    const cambiaAlumno = Number(datos.id_alumno) !== Number(asistencia.id_alumno);
    const cambiaTaller = Number(datos.id_taller) !== Number(asistencia.id_taller);

    if (cambiaAlumno || cambiaTaller) {
        await exigirInscripcion(datos.id_alumno, datos.id_taller);
    }

    return asistenciaRepositorio.actualizarAsistencia(id, datos);
}

//borrarAsistencia()
async function borrarAsistencia(id) {
    const asistencia = await asistenciaRepositorio.obtenerAsistenciaPorId(id);

    if (!asistencia) {
        throw new ErrorNoEncontrado("Asistencia no encontrada");
    }

    return asistenciaRepositorio.eliminarAsistencia(id);
}

// Helpers de la planilla mensual
function validarEnteroPositivo(valor, nombre) {
    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero <= 0) {
        throw new ErrorDeDatos(`El campo ${nombre} tiene que ser un número entero positivo`);
    }

    return numero;
}

function validarAnioYMes(anioValor, mesValor) {
    const anio = validarEnteroPositivo(anioValor, "anio");
    const mes = validarEnteroPositivo(mesValor, "mes");

    if (anio < 1900 || anio > 9999) {
        throw new ErrorDeDatos("El año tiene que estar entre 1900 y 9999");
    }

    if (mes < 1 || mes > 12) {
        throw new ErrorDeDatos("El mes tiene que estar entre 1 y 12");
    }

    return { anio, mes };
}

// Devuelve el primer día del mes, el primer día del mes siguiente y la cantidad de días.
function rangoDelMes(anio, mes) {
    const mesTexto = String(mes).padStart(2, "0");
    const fechaDesde = `${anio}-${mesTexto}-01`;

    const siguienteAnio = mes === 12 ? anio + 1 : anio;
    const siguienteMes = mes === 12 ? 1 : mes + 1;
    const fechaHasta = `${siguienteAnio}-${String(siguienteMes).padStart(2, "0")}-01`;

    const dias = new Date(Date.UTC(anio, mes, 0)).getUTCDate();

    return { fechaDesde, fechaHasta, dias };
}

// Valida que la fecha tenga formato AAAA-MM-DD, exista en el calendario
// y pertenezca al mes de la planilla.
function validarFechaDelMes(valor, anio, mes) {
    const fecha = String(valor ?? "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        throw new ErrorDeDatos("Cada marca tiene que incluir una fecha con formato AAAA-MM-DD");
    }

    const [anioFecha, mesFecha, diaFecha] = fecha.split("-").map(Number);
    const fechaObjeto = new Date(Date.UTC(anioFecha, mesFecha - 1, diaFecha));

    const esFechaReal =
        fechaObjeto.getUTCFullYear() === anioFecha &&
        fechaObjeto.getUTCMonth() === mesFecha - 1 &&
        fechaObjeto.getUTCDate() === diaFecha;

    if (!esFechaReal) {
        throw new ErrorDeDatos(`La fecha ${fecha} no existe`);
    }

    if (anioFecha !== anio || mesFecha !== mes) {
        throw new ErrorDeDatos(`La fecha ${fecha} no pertenece al mes de la planilla`);
    }

    return fecha;
}

// Normaliza y valida las marcas que llegan desde la planilla.
function validarMarcasDePlanilla(marcas, anio, mes) {
    if (!Array.isArray(marcas)) {
        throw new ErrorDeDatos("El campo marcas tiene que ser una lista");
    }

    const clavesVistas = new Set();

    return marcas.map((marca, indice) => {
        if (!marca || typeof marca !== "object") {
            throw new ErrorDeDatos(`La marca ${indice + 1} no tiene un formato válido`);
        }

        const idAlumno = validarEnteroPositivo(marca.id_alumno, "id_alumno");
        const fecha = validarFechaDelMes(marca.fecha, anio, mes);

        if (typeof marca.presente !== "boolean") {
            throw new ErrorDeDatos("El campo presente tiene que ser verdadero o falso");
        }

        const clave = `${idAlumno}|${fecha}`;

        if (clavesVistas.has(clave)) {
            throw new ErrorDeDatos(
                `Hay más de una marca para el alumno Nº ${idAlumno} en la fecha ${fecha}`
            );
        }

        clavesVistas.add(clave);

        return { id_alumno: idAlumno, fecha, presente: marca.presente };
    });
}

//obtenerPlanilla()
async function obtenerPlanilla(idTallerValor, anioValor, mesValor) {
    const idTaller = validarEnteroPositivo(idTallerValor, "idTaller");
    const { anio, mes } = validarAnioYMes(anioValor, mesValor);
    const { fechaDesde, fechaHasta, dias } = rangoDelMes(anio, mes);

    const taller = await tallerRepositorio.obtenerTallerPorId(idTaller);

    if (!taller) {
        throw new ErrorNoEncontrado("Taller no encontrado");
    }

    const [alumnos, asistencias] = await Promise.all([
        asistenciaRepositorio.listarAlumnosDePlanilla(idTaller, fechaDesde, fechaHasta),
        asistenciaRepositorio.listarAsistenciasDelMes(idTaller, fechaDesde, fechaHasta)
    ]);

    // Agrupa las marcas por alumno: { id_alumno: { "YYYY-MM-DD": true|false } }
    const marcasPorAlumno = new Map();

    for (const registro of asistencias) {
        const idAlumno = Number(registro.id_alumno);

        if (!marcasPorAlumno.has(idAlumno)) {
            marcasPorAlumno.set(idAlumno, {});
        }

        const fecha = String(registro.fecha).slice(0, 10);
        marcasPorAlumno.get(idAlumno)[fecha] = registro.presente;
    }

    return {
        taller: {
            id_taller: taller.id_taller,
            nombre: taller.nombre,
            estado: taller.estado
        },
        anio,
        mes,
        dias,
        alumnos: alumnos.map((alumno) => ({
            id_alumno: alumno.id_alumno,
            apellido: alumno.apellido,
            nombre: alumno.nombre,
            asistencias: marcasPorAlumno.get(Number(alumno.id_alumno)) ?? {}
        }))
    };
}

//guardarPlanilla()
// Recibe el estado completo de las marcas no vacías de la planilla y reemplaza
// el mes del taller en una transacción. Las celdas vacías no se envían.
async function guardarPlanilla(idTallerValor, anioValor, mesValor, marcasValor) {
    const idTaller = validarEnteroPositivo(idTallerValor, "idTaller");
    const { anio, mes } = validarAnioYMes(anioValor, mesValor);
    const { fechaDesde, fechaHasta } = rangoDelMes(anio, mes);

    const taller = await tallerRepositorio.obtenerTallerPorId(idTaller);

    if (!taller) {
        throw new ErrorNoEncontrado("Taller no encontrado");
    }

    const marcas = validarMarcasDePlanilla(marcasValor, anio, mes);

    // Solo se pueden marcar alumnos aceptados en el taller o con historial
    // de asistencias en ese mes (mismo criterio que la lectura de la planilla).
    if (marcas.length > 0) {
        const alumnos = await asistenciaRepositorio.listarAlumnosDePlanilla(
            idTaller,
            fechaDesde,
            fechaHasta
        );
        const habilitados = new Set(alumnos.map((alumno) => Number(alumno.id_alumno)));
        const noHabilitado = marcas.find((marca) => !habilitados.has(marca.id_alumno));

        if (noHabilitado) {
            throw new ErrorDeDatos(
                `El alumno Nº ${noHabilitado.id_alumno} no tiene inscripción aceptada ni asistencias en ese mes del taller`
            );
        }
    }

    await asistenciaRepositorio.guardarPlanillaDelMes(idTaller, fechaDesde, fechaHasta, marcas);

    return obtenerPlanilla(idTaller, anio, mes);
}

module.exports = {
    listarAsistencias,
    obtenerAsistencia,
    crearAsistencia,
    actualizarAsistencia,
    borrarAsistencia,
    obtenerPlanilla,
    guardarPlanilla
};
