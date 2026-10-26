-- Base de datos del proyecto Envion / Barrio Cultura
-- Las inscripciones son registradas por administradores desde el sistema.

BEGIN;
-- ==========================================
-- USUARIO
-- ==========================================

CREATE TABLE usuario (
    id_usuario       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username         VARCHAR(50) NOT NULL UNIQUE,
	nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    telefono         VARCHAR(30),
    contrasena       VARCHAR(255) NOT NULL,
    rol              VARCHAR(30) NOT NULL DEFAULT 'USUARIO',
    fecha_registro   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado           BOOLEAN NOT NULL DEFAULT TRUE
);	

-- ==========================================
-- BARRIO
-- ==========================================

CREATE TABLE barrio (
    id_barrio   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- ==========================================
-- SEDE
-- ==========================================
CREATE TABLE sede (
    id_sede     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    direccion   VARCHAR(200) NOT NULL,
    descripcion TEXT
);

-- ==========================================
-- NOTICIA
-- ==========================================
CREATE TABLE noticia (
    id_noticia        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo            VARCHAR(200) NOT NULL,
    contenido         TEXT NOT NULL,
    fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    imagen            TEXT,
    estado            VARCHAR(20) NOT NULL DEFAULT 'activa',
    CONSTRAINT ck_noticia_estado CHECK (estado IN ('activa', 'inactiva', 'borrador'))
);

-- ==========================================
-- ALUMNO
-- ==========================================
-- La ficha del alumno ya no depende de una cuenta de usuario.
CREATE TABLE alumno (
    id_alumno          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre             VARCHAR(100) NOT NULL,
    apellido           VARCHAR(100) NOT NULL,
	dni 				VARCHAR(20) NOT NULL UNIQUE,
    tiene_beca         BOOLEAN NOT NULL DEFAULT FALSE,
    estudios_completos BOOLEAN NOT NULL DEFAULT FALSE,
    colegio            VARCHAR(150)
);

-- ==========================================
-- PERSONAL
-- ==========================================
CREATE TABLE personal (
    id_personal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario  INTEGER NOT NULL UNIQUE,
    funcion     VARCHAR(100) NOT NULL,
    CONSTRAINT fk_personal_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ==========================================
-- SUGERENCIA
-- ==========================================
CREATE TABLE sugerencia (
    id_sugerencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario    INTEGER NOT NULL,
    mensaje       TEXT NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	 estado       VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    CONSTRAINT fk_sugerencia_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ==========================================
-- TALLER
-- ==========================================
CREATE TABLE taller (
    id_taller        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre           VARCHAR(150) NOT NULL,
    descripcion      TEXT,
    dia              VARCHAR(20),
    hora_inicio      TIME,
    hora_fin         TIME,
    edad_minima      SMALLINT,
    edad_maxima      SMALLINT,
    id_barrio        INTEGER NOT NULL,
	cupo INTEGER NOT NULL CHECK (cupo > 0),
    equipo_disponible TEXT,
    estado           VARCHAR(30) NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_taller_barrio
        FOREIGN KEY (id_barrio) REFERENCES barrio(id_barrio)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_taller_estado CHECK (estado IN ('activo', 'inactivo')),
    CONSTRAINT ck_taller_edades
        CHECK (edad_minima IS NULL OR edad_maxima IS NULL OR edad_minima <= edad_maxima),
    CONSTRAINT ck_taller_horarios
        CHECK (hora_inicio IS NULL OR hora_fin IS NULL OR hora_inicio < hora_fin)
);

-- ==========================================
-- ACTIVIDAD
-- ==========================================
CREATE TABLE actividad (
    id_actividad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_taller    INTEGER NOT NULL,
    id_barrio    INTEGER NOT NULL,
    nombre       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    fecha        DATE NOT NULL,
	estado VARCHAR(50),
    CONSTRAINT fk_actividad_taller
        FOREIGN KEY (id_taller) REFERENCES taller(id_taller)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_actividad_barrio
        FOREIGN KEY (id_barrio) REFERENCES barrio(id_barrio)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ==========================================
-- INSCRIPCION
-- ==========================================
-- Ahora la inscripción es un registro administrativo, no una solicitud del alumno.
CREATE TABLE inscripcion (
    id_inscripcion  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno       INTEGER NOT NULL,
    id_taller       INTEGER NOT NULL,
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado          VARCHAR(20) NOT NULL DEFAULT 'aceptada',
    comentario      TEXT,
    fecha_respuesta TIMESTAMP,
    CONSTRAINT fk_inscripcion_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_inscripcion_taller
        FOREIGN KEY (id_taller) REFERENCES taller(id_taller)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_inscripcion_estado
        CHECK (estado IN ('pendiente', 'aceptada', 'rechazada')),
    CONSTRAINT uq_inscripcion_alumno_taller UNIQUE (id_alumno, id_taller)
);

-- ==========================================
-- ASISTENCIA
-- ==========================================
CREATE TABLE asistencia (
    id_asistencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno     INTEGER NOT NULL,
    id_taller     INTEGER NOT NULL,
    fecha         DATE NOT NULL,
    presente      BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_asistencia_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_asistencia_taller
        FOREIGN KEY (id_taller) REFERENCES taller(id_taller)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_asistencia_alumno_taller_fecha UNIQUE (id_alumno, id_taller, fecha)
);

-- ==========================================
-- SEGUIMIENTO
-- ==========================================
CREATE TABLE seguimiento (
    id_seguimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_personal    INTEGER NOT NULL,
    id_alumno      INTEGER NOT NULL,
    fecha          DATE NOT NULL DEFAULT CURRENT_DATE,
    observacion    TEXT NOT NULL,
    CONSTRAINT fk_seguimiento_personal
        FOREIGN KEY (id_personal) REFERENCES personal(id_personal)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_seguimiento_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ==========================================
-- RED SOCIAL
-- ==========================================
CREATE TABLE red_social (
    id_red  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sede INTEGER NOT NULL,
    tipo    VARCHAR(50) NOT NULL,
    url     TEXT NOT NULL,
    estado  VARCHAR(20) NOT NULL DEFAULT 'activa',
    CONSTRAINT fk_red_social_sede
        FOREIGN KEY (id_sede) REFERENCES sede(id_sede)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_red_social_estado CHECK (estado IN ('activa', 'inactiva'))
);

-- ==========================================
-- INDICES
-- ==========================================
CREATE INDEX idx_sugerencia_usuario ON sugerencia(id_usuario);
CREATE INDEX idx_seguimiento_alumno ON seguimiento(id_alumno);
CREATE INDEX idx_seguimiento_personal ON seguimiento(id_personal);
CREATE INDEX idx_inscripcion_taller ON inscripcion(id_taller);
CREATE INDEX idx_asistencia_taller_fecha ON asistencia(id_taller, fecha);
CREATE INDEX idx_actividad_barrio ON actividad(id_barrio);
CREATE INDEX idx_noticia_fecha ON noticia(fecha_publicacion DESC);

COMMIT;
