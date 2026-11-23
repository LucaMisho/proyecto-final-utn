// Cómo se muestra cada dato relacionado (por ejemplo, el alumno de una inscripción)
export const ETIQUETAS = {
  usuarios: (u) => u.username,
  alumnos: (a) => `${a.apellido}, ${a.nombre}`,
  talleres: (t) => t.nombre,
  barrios: (b) => b.nombre,
  personal: (p) => `${p.apellido}, ${p.nombre}`,
};

export const ROLES = ["USUARIO", "PERSONAL", "ADMINISTRADOR"];

function fecha(valor) {
  if (!valor) return "";
  const [anio, mes, dia] = String(valor).slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

function hora(valor) {
  return valor ? String(valor).slice(0, 5) : "";
}

const SI_NO = (v) => (v ? "Sí" : "No");

export const RECURSOS = [
  {
    clave: "usuarios",
    titulo: "Usuarios",
    singular: "usuario",
    ruta: "usuarios",
    id: "id_usuario",
    metodoEditar: "PATCH",
    columnas: [
      { clave: "username", titulo: "Usuario" },
      { clave: "email", titulo: "Correo" },
      { clave: "rol", titulo: "Rol", tipo: "rol" },
      { clave: "estado", titulo: "Estado", mostrar: (v) => (v ? "Activo" : "Inactivo") },
    ],
    campos: [
      { clave: "username", etiqueta: "Usuario", tipo: "texto", requerido: true },
      { clave: "email", etiqueta: "Correo", tipo: "email", requerido: true },
      { clave: "rol", etiqueta: "Rol", tipo: "opciones", opciones: ROLES, inicial: "USUARIO" },
      { clave: "estado", etiqueta: "Cuenta activa", tipo: "casilla", inicial: true },
      {
        clave: "contrasena",
        etiqueta: "Contraseña",
        tipo: "clave",
        requeridoAlCrear: true,
        ayuda: "Mínimo 8 caracteres. Al editar, dejala vacía para no cambiarla.",
      },
    ],
    nombreDe: (u) => u.username,
  },
  {
    clave: "alumnos",
    titulo: "Alumnos",
    singular: "alumno",
    ruta: "alumnos",
    personal: "pestana",
    id: "id_alumno",
    columnas: [
      { clave: "apellido", titulo: "Apellido" },
      { clave: "nombre", titulo: "Nombre" },
      { clave: "dni", titulo: "DNI" },
      { clave: "telefono", titulo: "Teléfono" },
      { clave: "tiene_beca", titulo: "Beca", mostrar: SI_NO },
      { clave: "colegio", titulo: "Colegio" },
    ],
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
      { clave: "apellido", etiqueta: "Apellido", tipo: "texto", requerido: true },
      { clave: "dni", etiqueta: "DNI", tipo: "texto", requerido: true },
      { clave: "telefono", etiqueta: "Teléfono", tipo: "texto" },
      { clave: "colegio", etiqueta: "Colegio", tipo: "texto" },
      { clave: "tiene_beca", etiqueta: "Tiene beca", tipo: "casilla", inicial: false },
      { clave: "estudios_completos", etiqueta: "Estudios completos", tipo: "casilla", inicial: false },
    ],
    nombreDe: (a) => `${a.nombre} ${a.apellido}`,
  },
  {
    clave: "inscripciones",
    titulo: "Inscripciones",
    singular: "inscripción",
    ruta: "inscripciones",
    personal: "pestana",
    id: "id_inscripcion",
    columnas: [
      { clave: "id_alumno", titulo: "Alumno", relacion: "alumnos" },
      { clave: "id_taller", titulo: "Taller", relacion: "talleres" },
      { clave: "estado", titulo: "Estado" },
      { clave: "comentario", titulo: "Comentario" },
    ],
    campos: [
      { clave: "id_alumno", etiqueta: "Alumno", tipo: "relacion", relacion: "alumnos", requerido: true },
      { clave: "id_taller", etiqueta: "Taller", tipo: "relacion", relacion: "talleres", requerido: true },
      {
        clave: "estado",
        etiqueta: "Estado",
        tipo: "opciones",
        opciones: ["pendiente", "aceptada", "rechazada"],
        inicial: "aceptada",
      },
      { clave: "comentario", etiqueta: "Comentario", tipo: "area" },
    ],
    alGuardar: (valores, fila) => {
      const cambioEstado = !fila || fila.estado !== valores.estado;
      return cambioEstado && valores.estado !== "pendiente"
        ? { ...valores, fecha_respuesta: new Date().toISOString() }
        : valores;
    },
    nombreDe: (i) => `inscripción ${i.id_inscripcion}`,
  },
  {
    clave: "asistencias",
    titulo: "Asistencias",
    singular: "asistencia",
    ruta: "asistencias",
    personal: "pestana",
    id: "id_asistencia",
    vista: "planilla",
    columnas: [
      { clave: "fecha", titulo: "Fecha", mostrar: fecha },
      { clave: "id_alumno", titulo: "Alumno", relacion: "alumnos" },
      { clave: "id_taller", titulo: "Taller", relacion: "talleres" },
      { clave: "presente", titulo: "Presente", mostrar: SI_NO },
    ],
    campos: [
      { clave: "id_alumno", etiqueta: "Alumno", tipo: "relacion", relacion: "alumnos", requerido: true },
      {
        clave: "id_taller",
        etiqueta: "Taller",
        tipo: "relacion",
        relacion: "talleres",
        requerido: true,
      },
      {
        clave: "fecha",
        etiqueta: "Fecha",
        tipo: "texto",
        inicial: new Date().toLocaleDateString("en-CA"),
        requerido: true,
      },
    ],
    nombreDe: (a) => `asistencia del ${fecha(a.fecha)}`,
  },
  {
    clave: "seguimientos",
    titulo: "Seguimientos",
    singular: "seguimiento",
    ruta: "seguimientos",
    id: "id_seguimiento",
    personal: "pestana",
    columnas: [
      { clave: "fecha", titulo: "Fecha", mostrar: fecha },
      { clave: "id_alumno", titulo: "Alumno", relacion: "alumnos" },
      { clave: "id_personal", titulo: "Personal", relacion: "personal" },
      { clave: "observacion", titulo: "Observación" },
    ],
    campos: [
      { clave: "id_alumno", etiqueta: "Alumno", tipo: "relacion", relacion: "alumnos", requerido: true },
      { clave: "id_personal", etiqueta: "Personal", tipo: "relacion", relacion: "personal", requerido: true },
      {
        clave: "fecha",
        etiqueta: "Fecha",
        tipo: "fecha",
        inicial: new Date().toLocaleDateString("en-CA"),
        requerido: true,
      },
      { clave: "observacion", etiqueta: "Observación", tipo: "area", requerido: true },
    ],
    iniciales: (datos, sesion) => {
      const propio = (datos.personal?.filas ?? []).find((p) => p.id_usuario === sesion.id_usuario);
      return propio ? { id_personal: String(propio.id_personal) } : {};
    },
    nombreDe: (s) => `seguimiento del ${fecha(s.fecha)}`,
  },
  {
    clave: "talleres",
    titulo: "Talleres",
    singular: "taller",
    ruta: "talleres",
    personal: "datos",
    id: "id_taller",
    columnas: [
      { clave: "nombre", titulo: "Nombre" },
      { clave: "imagen", titulo: "Imagen", tipo: "imagen" },
      { clave: "id_barrio", titulo: "Barrio", relacion: "barrios" },
      { clave: "dia", titulo: "Días" },
      { clave: "hora_inicio", titulo: "Desde", mostrar: hora },
      { clave: "hora_fin", titulo: "Hasta", mostrar: hora },
      { clave: "cupo", titulo: "Cupo" },
      { clave: "estado", titulo: "Estado" },
    ],
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
      { clave: "descripcion", etiqueta: "Descripción", tipo: "area" },
      { clave: "id_barrio", etiqueta: "Barrio", tipo: "relacion", relacion: "barrios", requerido: true },
      { clave: "dia", etiqueta: "Días", tipo: "texto" },
      { clave: "hora_inicio", etiqueta: "Hora de inicio", tipo: "hora" },
      { clave: "hora_fin", etiqueta: "Hora de fin", tipo: "hora" },
      { clave: "edad_minima", etiqueta: "Edad mínima", tipo: "numero" },
      { clave: "edad_maxima", etiqueta: "Edad máxima", tipo: "numero" },
      { clave: "cupo", etiqueta: "Cupo", tipo: "numero", requerido: true, minimo: 1 },
  {
    clave: "equipo_disponible",
    etiqueta: "Equipo disponible",
    tipo: "texto",
    ayuda: 'Escribí "sí" si el taller cuenta con equipo.',
  },
  {
    clave: "imagen",
    etiqueta: "Imagen",
    tipo: "archivo",
    ayuda: "Elegí una foto de tu computadora (JPG, PNG o WebP, hasta 5 MB). Mejor si mide al menos 1600 px de ancho.",
  },
  { clave: "estado", etiqueta: "Estado", tipo: "opciones", opciones: ["activo", "inactivo"], inicial: "activo" },
],
    nombreDe: (t) => t.nombre,
  },
  {
    clave: "barrios",
    titulo: "Barrios",
    singular: "barrio",
    ruta: "barrios",
    id: "id_barrio",
    columnas: [
      { clave: "nombre", titulo: "Nombre" },
      { clave: "descripcion", titulo: "Descripción" },
    ],
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
      { clave: "descripcion", etiqueta: "Descripción", tipo: "area" },
    ],
    nombreDe: (b) => b.nombre,
  },
  {
    clave: "actividades",
    titulo: "Actividades",
    singular: "actividad",
    ruta: "actividades",
    id: "id_barrio",
    id: "id_actividad",
    columnas: [
      { clave: "nombre", titulo: "Nombre" },
      { clave: "descripcion", titulo: "Descripción" },
      { clave: "fecha", titulo: "Fecha", mostrar: fecha },
      { clave: "id_barrio", titulo: "Barrio", relacion: "barrios" },
      { clave: "estado", titulo: "Estado" },
    ],
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
      { clave: "descripcion", etiqueta: "Descripción", tipo: "area" },
      { clave: "fecha", etiqueta: "Fecha", tipo: "fecha", requerido: true },
      { clave: "id_barrio", etiqueta: "Barrio", tipo: "relacion", relacion: "barrios", requerido: true },
     { clave: "estado", etiqueta: "Estado", tipo: "texto" },
    ],
    nombreDe: (a) => a.nombre,
  },
  {
    clave: "sugerencias",
    titulo: "Sugerencias",
    singular: "sugerencia",
    ruta: "sugerencias",
    id: "id_sugerencia",
    sinAgregar: true,
    columnas: [
      { clave: "fecha", titulo: "Fecha", mostrar: fecha },
      { clave: "id_usuario", titulo: "Usuario", relacion: "usuarios" },
      { clave: "mensaje", titulo: "Mensaje" },
      { clave: "estado", titulo: "Estado" },
    ],
    campos: [
      { clave: "mensaje", etiqueta: "Mensaje", tipo: "area", requerido: true },
      { clave: "estado", etiqueta: "Estado", tipo: "opciones", opciones: ["pendiente", "recibida"], inicial: "pendiente" },
    ],
    conservar: ["id_usuario"],
    nombreDe: (s) => `sugerencia ${s.id_sugerencia}`,
  },
  {
    clave: "personal",
    titulo: "Personal",
    singular: "persona",
    ruta: "personal",
    id: "id_personal",
    personal: "datos",
    oculto: true,
    columnas: [],
    campos: [],
    nombreDe: (p) => `${p.apellido}, ${p.nombre}`,
  },
];
