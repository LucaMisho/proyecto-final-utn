import { calcularEdad, textoDeEdad } from "../../utils/edad";

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
      { clave: "fecha_nacimiento", titulo: "Edad", mostrar: textoDeEdad },
      { clave: "tiene_beca", titulo: "Beca", mostrar: SI_NO },
      { clave: "colegio", titulo: "Colegio" },
    ],
    campos: [
      { clave: "nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
      { clave: "apellido", etiqueta: "Apellido", tipo: "texto", requerido: true },
      { clave: "dni", etiqueta: "DNI", tipo: "texto", requerido: true },
      {
        clave: "fecha_nacimiento",
        etiqueta: "Fecha de nacimiento",
        tipo: "fecha",
        requeridoAlCrear: true,
        ayuda: "Sirve para calcular la edad y controlar la edad mínima y máxima de los talleres.",
      },
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
    avisoAntesDeGuardar: (valores, datos) => {
      const alumno = (datos.alumnos?.filas ?? []).find((a) => String(a.id_alumno) === String(valores.id_alumno));
      const taller = (datos.talleres?.filas ?? []).find((t) => String(t.id_taller) === String(valores.id_taller));
      const edad = alumno ? calcularEdad(alumno.fecha_nacimiento) : null;

      if (edad === null || !taller) return null;

      const { edad_minima: minima, edad_maxima: maxima } = taller;
      const fuera = (minima != null && edad < minima) || (maxima != null && edad > maxima);

      if (!fuera) return null;

      const rango =
        minima != null && maxima != null
          ? `de ${minima} a ${maxima} años`
          : minima != null
            ? `desde los ${minima} años`
            : `hasta los ${maxima} años`;

      return `${alumno.nombre} ${alumno.apellido} tiene ${edad} ${edad === 1 ? "año" : "años"} y el taller ${taller.nombre} es ${rango}. Si querés inscribirlo igual, volvé a tocar Guardar.`;
    },
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
      {
        clave: "id_taller",
        etiqueta: "Taller",
        tipo: "relacion",
        relacion: "talleres",
        requerido: true,
      },
      {
        clave: "id_alumno",
        etiqueta: "Alumno",
        tipo: "relacion",
        relacion: "alumnos",
        requerido: true,
        soloInscriptosDe: "id_taller",
        ayuda: "Solo aparecen los alumnos con inscripción aceptada en el taller elegido.",
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
      {
        clave: "dia",
        etiqueta: "Días",
        tipo: "texto",
        ayuda: "Escribí los días de dictado, por ejemplo: Lunes, miércoles y viernes. La planilla de asistencias usa este dato.",
      },
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
      { clave: "id_taller", etiqueta: "Taller", tipo: "relacion", relacion: "talleres", ayuda: "Opcional. Dejalo vacío si la actividad no es de un taller." },
      { clave: "id_barrio", etiqueta: "Barrio", tipo: "relacion", relacion: "barrios", ayuda: "Opcional." },
      {
        clave: "estado",
        etiqueta: "Estado",
        tipo: "opciones",
        opciones: ["programada", "realizada", "cancelada"],
        inicial: "programada",
        ayuda: "En el sitio se muestran las programadas como próximas; las realizadas quedan en un apartado aparte y las canceladas no se muestran.",
      },
    ],
    nombreDe: (a) => a.nombre,
  },
  {
    clave: "noticias",
    titulo: "Noticias",
    singular: "noticia",
    ruta: "noticias",
    rutaLista: "noticias/admin/todas",
    id: "id_noticia",
    columnas: [
      { clave: "imagen", titulo: "Imagen", tipo: "imagen" },
      { clave: "titulo", titulo: "Título" },
      { clave: "estado", titulo: "Estado" },
      { clave: "fecha_publicacion", titulo: "Publicada", mostrar: fecha },
    ],
    campos: [
      { clave: "titulo", etiqueta: "Título", tipo: "texto", requerido: true },
      { clave: "contenido", etiqueta: "Contenido", tipo: "enriquecido", requerido: true, filas: 12 },
      {
        clave: "imagen",
        etiqueta: "Imagen",
        tipo: "archivo",
        ayuda: "Opcional. Elegí una foto de tu computadora (JPG, PNG o WebP, hasta 5 MB). Al editar, si no elegís otra se conserva la actual.",
      },
      {
        clave: "estado",
        etiqueta: "Estado",
        tipo: "opciones",
        opciones: ["activa", "inactiva", "borrador"],
        inicial: "activa",
        ayuda: "Solo las noticias activas se ven en el sitio.",
      },
    ],
    nombreDe: (n) => n.titulo,
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

  {
  clave: "novedades",
  titulo: "Novedades",
  singular: "novedad",
  ruta: "novedades",
  id: "id_novedad", 
  conservar: ["imagen"],
  columnas: [
    { clave: "titulo", titulo: "Título" },
    { clave: "categoria", titulo: "Categoría" },
    { clave: "fecha", titulo: "Fecha", mostrar: fecha }, // usá la columna de fecha real
  ],
   campos: [
    { clave: "titulo", etiqueta: "Título", tipo: "texto", requerido: true, ayuda: "Máximo 120 caracteres." },
    { clave: "descripcion", etiqueta: "Descripción", tipo: "textarea", requerido: true, ayuda: "Máximo 500 caracteres." },
    { clave: "categoria", etiqueta: "Categoría", tipo: "texto", requerido: true, ayuda: "Máximo 40 caracteres." },
    {
      clave: "imagen",
      etiqueta: "Imagen",
      tipo: "archivo",
      ayuda: "Elegí una foto de tu computadora (JPG, PNG o WebP, hasta 5 MB). Mejor si mide al menos 1600 px de ancho.",
    },
  ],
  nombreDe: (n) => n.titulo,
},
];
