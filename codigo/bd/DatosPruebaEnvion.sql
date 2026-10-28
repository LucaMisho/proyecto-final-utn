-- Datos de prueba para la base Envion / Barrio Cultura
-- Ejecutar DESPUES del script de tablas (con las tablas vacias).
-- Las columnas id son GENERATED ALWAYS, asi que no se insertan:

BEGIN;

-- ==========================================
-- BARRIO
-- ==========================================
INSERT INTO barrio (nombre, descripcion) VALUES
('Quequen Centro', 'Zona cercana al puerto y a la costanera de Quequen.'),
('Barrio Villa Zabala', 'Barrio residencial con sede comunitaria y plaza central.'),
('Barrio Docente', 'Barrio de Necochea con espacio cultural y deportivo.'),
('Barrio Las Margaritas', 'Zona periferica con fuerte participacion de las familias.');

-- ==========================================
-- SEDE
-- ==========================================
INSERT INTO sede (nombre, direccion, descripcion) VALUES
('Sede Quequen', 'Calle 509 N° 1234, Quequen', 'Sede principal del programa Envion en Quequen.'),
('Sede Barrio Cultura', 'Calle 62 N° 2500, Necochea', 'Espacio de talleres artisticos y culturales.');

-- ==========================================
-- NOTICIA
-- ==========================================
INSERT INTO noticia (titulo, contenido, fecha_publicacion, imagen, estado) VALUES
('Comienzan los talleres 2026', 'Se abre el ciclo de talleres con cupos disponibles en todos los barrios.', '2026-03-02 10:00', 'https://ejemplo.test/img/talleres-2026.jpg', 'activa'),
('Muestra de fin de ano', 'Los alumnos presentaran sus trabajos en la Sede Barrio Cultura.', '2026-10-15 18:30', 'https://ejemplo.test/img/muestra.jpg', 'activa'),
('Torneo de futbol interbarrial', 'Se suspende hasta nuevo aviso por mal tiempo.', '2026-09-20 09:00', NULL, 'inactiva'),
('Nuevo taller de robotica (borrador)', 'Estamos evaluando sumar un taller de robotica educativa.', '2026-10-25 12:00', NULL, 'borrador');

-- ==========================================
-- ALUMNO
-- ==========================================
INSERT INTO alumno (nombre, apellido, dni, telefono, tiene_beca, estudios_completos, colegio) VALUES
('Lucas',    'Martinez', '45123456', '2262-501001', TRUE,  FALSE, 'EES N° 1 Quequen'),
('Valentina','Suarez',   '46234567', '2262-501002', FALSE, FALSE, 'EES N° 5 Necochea'),
('Mateo',    'Romero',   '44345678', '2262-501003', TRUE,  FALSE, 'EES N° 3 Necochea'),
('Camila',   'Acosta',   '45456789', NULL,          FALSE, FALSE, 'EES N° 1 Quequen'),
('Thiago',   'Benitez',  '43567890', '2262-501005', FALSE, TRUE,  'Escuela Tecnica N° 1'),
('Agustina', 'Molina',   '46678901', '2262-501006', TRUE,  FALSE, NULL),
('Bruno',    'Herrera',  '45789012', NULL,          FALSE, FALSE, 'EES N° 5 Necochea'),
('Milagros', 'Castro',   '44890123', '2262-501008', FALSE, TRUE,  'EES N° 3 Necochea');

-- ==========================================
-- PERSONAL  (vinculado a usuarios; se requiere crear primero el usuario
-- ==========================================
INSERT INTO personal (id_usuario, nombre, apellido, dni, telefono, funcion) VALUES
((SELECT id_usuario FROM usuario WHERE username = 'mperez'),     'Martin',  'Perez',     '30111222', '2262-401002', 'Profesor de deportes'),
((SELECT id_usuario FROM usuario WHERE username = 'sfernandez'), 'Sofia',   'Fernandez', '31222333', '2262-401003', 'Profesora de arte y musica'),
((SELECT id_usuario FROM usuario WHERE username = 'jrodriguez'), 'Julian',  'Rodriguez', '29333444', NULL,           'Psicologo / acompanamiento');

-- ==========================================
-- SUGERENCIA  (solo usuarios registrados)
-- ==========================================
INSERT INTO sugerencia (id_usuario, mensaje, fecha, estado) VALUES
((SELECT id_usuario FROM usuario WHERE username = 'cdiaz'),  'Seria bueno sumar un taller de cocina para adolescentes.', '2026-09-05 16:20', 'pendiente'),
((SELECT id_usuario FROM usuario WHERE username = 'cdiaz'),  'Podrian publicar los horarios en las redes sociales.',      '2026-09-18 11:05', 'revisada'),
((SELECT id_usuario FROM usuario WHERE username = 'tlopez'), 'Falta iluminacion en la entrada de la sede de Quequen.',   '2026-10-02 19:40', 'pendiente');

-- ==========================================
-- TALLER  (estado solo admite 'activo' / 'inactivo')
-- ==========================================
INSERT INTO taller (nombre, descripcion, dia, hora_inicio, hora_fin, edad_minima, edad_maxima, id_barrio, cupo, equipo_disponible, estado) VALUES
('Futbol Recreativo', 'Entrenamiento y juegos de equipo.', 'Lunes', '16:00', '18:00', 8, 14,
    (SELECT id_barrio FROM barrio WHERE nombre = 'Quequen Centro'), 25, 'Pelotas, conos, pecheras', 'activo'),
('Taller de Musica', 'Iniciacion a la guitarra y percusion.', 'Martes', '15:00', '17:00', 10, 17,
    (SELECT id_barrio FROM barrio WHERE nombre = 'Barrio Villa Zabala'), 15, 'Guitarras, cajones, parlantes', 'activo'),
('Taller de Arte y Murales', 'Dibujo, pintura y diseno de murales barriales.', 'Miercoles', '14:30', '17:00', 9, 16,
    (SELECT id_barrio FROM barrio WHERE nombre = 'Barrio Docente'), 20, 'Pinturas, pinceles, caballetes', 'activo'),
('Apoyo Escolar', 'Acompanamiento en tareas de matematica y lengua.', 'Jueves', '14:00', '16:00', 8, 18,
    (SELECT id_barrio FROM barrio WHERE nombre = 'Barrio Las Margaritas'), 12, 'Pizarra, libros, netbooks', 'activo'),
('Taller de Fotografia', 'Nociones basicas de fotografia con celular.', 'Viernes', '16:00', '18:00', 12, 18,
    (SELECT id_barrio FROM barrio WHERE nombre = 'Quequen Centro'), 10, NULL, 'inactivo');

-- ==========================================
-- ACTIVIDAD
-- ==========================================
INSERT INTO actividad (id_taller, id_barrio, nombre, descripcion, fecha, estado) VALUES
((SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),
 (SELECT id_barrio FROM barrio WHERE nombre = 'Quequen Centro'),
 'Torneo relampago', 'Torneo de un dia entre equipos del taller.', '2026-11-07', 'programada'),
((SELECT id_taller FROM taller WHERE nombre = 'Taller de Musica'),
 (SELECT id_barrio FROM barrio WHERE nombre = 'Barrio Villa Zabala'),
 'Muestra musical', 'Presentacion abierta a familias.', '2026-11-20', 'programada'),
((SELECT id_taller FROM taller WHERE nombre = 'Taller de Arte y Murales'),
 (SELECT id_barrio FROM barrio WHERE nombre = 'Barrio Docente'),
 'Mural comunitario', 'Pintada colectiva en la pared de la plaza.', '2026-10-10', 'realizada'),
((SELECT id_taller FROM taller WHERE nombre = 'Apoyo Escolar'),
 (SELECT id_barrio FROM barrio WHERE nombre = 'Barrio Las Margaritas'),
 'Jornada de repaso', 'Repaso previo a examenes de diciembre.', '2026-11-27', 'programada');

-- ==========================================
-- INSCRIPCION  (registradas por administradores)
-- ==========================================
INSERT INTO inscripcion (id_alumno, id_taller, fecha_solicitud, estado, comentario, fecha_respuesta) VALUES
((SELECT id_alumno FROM alumno WHERE dni = '45123456'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-03-05 10:00', 'aceptada',  NULL, '2026-03-05 10:00'),
((SELECT id_alumno FROM alumno WHERE dni = '45123456'), (SELECT id_taller FROM taller WHERE nombre = 'Apoyo Escolar'),            '2026-03-06 11:30', 'aceptada',  'Necesita refuerzo en matematica.', '2026-03-06 11:30'),
((SELECT id_alumno FROM alumno WHERE dni = '46234567'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Musica'),         '2026-03-07 09:15', 'aceptada',  NULL, '2026-03-07 09:15'),
((SELECT id_alumno FROM alumno WHERE dni = '44345678'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-03-08 15:00', 'aceptada',  NULL, '2026-03-08 15:00'),
((SELECT id_alumno FROM alumno WHERE dni = '45456789'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Arte y Murales'), '2026-03-09 16:45', 'aceptada',  NULL, '2026-03-09 16:45'),
((SELECT id_alumno FROM alumno WHERE dni = '43567890'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Fotografia'),     '2026-03-10 12:00', 'rechazada', 'El taller esta inactivo.', '2026-03-11 09:00'),
((SELECT id_alumno FROM alumno WHERE dni = '46678901'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Musica'),         '2026-04-01 10:20', 'pendiente', 'A la espera de documentacion.', NULL),
((SELECT id_alumno FROM alumno WHERE dni = '45789012'), (SELECT id_taller FROM taller WHERE nombre = 'Apoyo Escolar'),            '2026-04-02 14:10', 'aceptada',  NULL, '2026-04-02 14:10');

-- ==========================================
-- ASISTENCIA  (solo alumnos con inscripcion aceptada)
-- ==========================================
INSERT INTO asistencia (id_alumno, id_taller, fecha, presente) VALUES
((SELECT id_alumno FROM alumno WHERE dni = '45123456'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-10-05', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '45123456'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-10-12', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '45123456'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-10-19', FALSE),
((SELECT id_alumno FROM alumno WHERE dni = '44345678'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-10-05', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '44345678'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-10-12', FALSE),
((SELECT id_alumno FROM alumno WHERE dni = '44345678'), (SELECT id_taller FROM taller WHERE nombre = 'Futbol Recreativo'),        '2026-10-19', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '46234567'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Musica'),         '2026-10-06', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '46234567'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Musica'),         '2026-10-13', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '45456789'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Arte y Murales'), '2026-10-07', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '45456789'), (SELECT id_taller FROM taller WHERE nombre = 'Taller de Arte y Murales'), '2026-10-14', FALSE),
((SELECT id_alumno FROM alumno WHERE dni = '45123456'), (SELECT id_taller FROM taller WHERE nombre = 'Apoyo Escolar'),            '2026-10-08', TRUE),
((SELECT id_alumno FROM alumno WHERE dni = '45789012'), (SELECT id_taller FROM taller WHERE nombre = 'Apoyo Escolar'),            '2026-10-08', TRUE);

-- ==========================================
-- SEGUIMIENTO  (el personal se identifica por su dni)
-- ==========================================
INSERT INTO seguimiento (id_personal, id_alumno, fecha, observacion) VALUES
((SELECT id_personal FROM personal WHERE dni = '29333444'),
 (SELECT id_alumno FROM alumno WHERE dni = '45123456'), '2026-09-10', 'Mejora la participacion en grupo; se reforzara el apoyo escolar.'),
((SELECT id_personal FROM personal WHERE dni = '30111222'),
 (SELECT id_alumno FROM alumno WHERE dni = '44345678'), '2026-09-24', 'Faltas reiteradas en las ultimas semanas; se contacta a la familia.'),
((SELECT id_personal FROM personal WHERE dni = '31222333'),
 (SELECT id_alumno FROM alumno WHERE dni = '46234567'), '2026-10-01', 'Muy buen desempeno en musica; se propone para la muestra de cierre.'),
((SELECT id_personal FROM personal WHERE dni = '29333444'),
 (SELECT id_alumno FROM alumno WHERE dni = '45456789'), '2026-10-15', 'Entrevista inicial realizada. Sin observaciones relevantes.');

-- ==========================================
-- RED SOCIAL
-- ==========================================
INSERT INTO red_social (id_sede, tipo, url, estado) VALUES
((SELECT id_sede FROM sede WHERE nombre = 'Sede Quequen'),        'Instagram', 'https://instagram.com/envion.quequen.test', 'activa'),
((SELECT id_sede FROM sede WHERE nombre = 'Sede Quequen'),        'Facebook',  'https://facebook.com/envion.quequen.test',  'activa'),
((SELECT id_sede FROM sede WHERE nombre = 'Sede Barrio Cultura'), 'Instagram', 'https://instagram.com/barriocultura.test',  'activa'),
((SELECT id_sede FROM sede WHERE nombre = 'Sede Barrio Cultura'), 'YouTube',   'https://youtube.com/@barriocultura-test',   'inactiva');

COMMIT;
