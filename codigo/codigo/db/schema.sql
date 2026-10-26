-- Esquema de Envión Quequén para PostgreSQL.
-- Se puede ejecutar varias veces: borra y vuelve a crear todo (solo para desarrollo).

DROP TABLE IF EXISTS sugerencia, red_social, sede, noticia, actividad, seguimiento,
                     asistencia, inscripcion, personal, taller, barrio, alumno, usuario CASCADE;

CREATE TABLE usuario (
    id_usuario     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username       VARCHAR(50)  NOT NULL UNIQUE,
    nombre         VARCHAR(100) NOT NULL,
    apellido       VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    telefono       VARCHAR(30),
    contrasena     VARCHAR(200) NOT NULL,            -- siempre guardada con hash, nunca en texto plano
    rol            VARCHAR(10)  NOT NULL DEFAULT 'USUARIO'
                   CHECK (rol IN ('USUARIO', 'PERSONAL', 'ADMIN')),
    fecha_registro TIMESTAMP    NOT NULL DEFAULT NOW(),
    estado         BOOLEAN      NOT NULL DEFAULT TRUE  -- activo / inactivo
);

-- Un usuario puede tener un alumno (diagrama: 1 a 0..1). Pendiente de confirmar con el grupo.
CREATE TABLE alumno (
    id_alumno          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario         INTEGER NOT NULL UNIQUE REFERENCES usuario (id_usuario),
    dni                VARCHAR(20) NOT NULL UNIQUE,
    tiene_beca         BOOLEAN NOT NULL DEFAULT FALSE,
    estudios_completos BOOLEAN NOT NULL DEFAULT FALSE,
    colegio            VARCHAR(200)
);

CREATE TABLE barrio (
    id_barrio   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE taller (
    id_taller    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    dia          VARCHAR(15)  NOT NULL,
    hora_inicio  TIME NOT NULL,
    hora_fin     TIME NOT NULL,
    edad_minima  INTEGER NOT NULL CHECK (edad_minima >= 0),
    edad_maxima  INTEGER NOT NULL,
    id_barrio    INTEGER NOT NULL REFERENCES barrio (id_barrio),
    cupo         INTEGER NOT NULL CHECK (cupo > 0),
    activo       BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (hora_fin > hora_inicio),
    CHECK (edad_maxima >= edad_minima)
);

CREATE TABLE inscripcion (
    id_inscripcion  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno       INTEGER NOT NULL REFERENCES alumno (id_alumno),
    id_taller       INTEGER NOT NULL REFERENCES taller (id_taller),
    fecha_solicitud TIMESTAMP   NOT NULL DEFAULT NOW(),
    estado          VARCHAR(10) NOT NULL DEFAULT 'PENDIENTE'
                    CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'RECHAZADA')),
    comentario      TEXT,
    fecha_respuesta TIMESTAMP
);

CREATE TABLE asistencia (
    id_asistencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno     INTEGER NOT NULL REFERENCES alumno (id_alumno),
    id_taller     INTEGER NOT NULL REFERENCES taller (id_taller),
    fecha         DATE    NOT NULL,
    presente      BOOLEAN NOT NULL,
    UNIQUE (id_alumno, id_taller, fecha)
);

CREATE TABLE personal (
    id_personal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario  INTEGER NOT NULL UNIQUE REFERENCES usuario (id_usuario),
    funcion     VARCHAR(100) NOT NULL,
    activo      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE seguimiento (
    id_seguimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno      INTEGER NOT NULL REFERENCES alumno (id_alumno),
    id_personal    INTEGER NOT NULL REFERENCES personal (id_personal),
    fecha          DATE NOT NULL DEFAULT CURRENT_DATE,
    observacion    TEXT NOT NULL
);

CREATE TABLE actividad (
    id_actividad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_taller    INTEGER REFERENCES taller (id_taller),   -- pendiente de confirmar si es obligatorio
    id_barrio    INTEGER NOT NULL REFERENCES barrio (id_barrio),
    nombre       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    fecha        DATE NOT NULL
);

CREATE TABLE noticia (
    id_noticia        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo            VARCHAR(200) NOT NULL,
    contenido         TEXT NOT NULL,
    fecha_publicacion DATE NOT NULL DEFAULT CURRENT_DATE,
    imagen            VARCHAR(500),
    estado            VARCHAR(10) NOT NULL DEFAULT 'ACTIVA'
                      CHECK (estado IN ('ACTIVA', 'INACTIVA'))
);

CREATE TABLE sede (
    id_sede     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    direccion   VARCHAR(250) NOT NULL,
    descripcion TEXT
);

CREATE TABLE red_social (
    id_red  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sede INTEGER NOT NULL REFERENCES sede (id_sede) ON DELETE CASCADE,
    tipo    VARCHAR(50)  NOT NULL,
    url     VARCHAR(500) NOT NULL,
    estado  VARCHAR(10)  NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

CREATE TABLE sugerencia (
    id_sugerencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario    INTEGER NOT NULL REFERENCES usuario (id_usuario),
    mensaje       TEXT NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT NOW(),
    estado        VARCHAR(15) NOT NULL DEFAULT 'PENDIENTE'
);
