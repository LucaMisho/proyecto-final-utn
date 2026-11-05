//buscador.repositorio.js
const pool = require("./conexion"); 

async function buscar(q) {
    //${q} permite encontrar coincidencias aunque el nombre este en medio de la descripcion o del nombre
    const texto = `%${q}%`;

    //Promise.all ejecuta las promesas en paralelo
    //ILIKE busca el texto sin distinguir minusculas, ni mayusculas
    const [talleres, noticias, actividades, barrios] = await Promise.all([
        pool.query(
            `SELECT id_taller, nombre, descripcion
             FROM taller
             WHERE nombre ILIKE $1 OR descripcion ILIKE $1`,
            [texto]
        ),

        pool.query(
            `SELECT id_noticia, titulo, contenido, fecha_publicacion, imagen, estado
             FROM noticia
             WHERE estado = 'activa' AND (titulo ILIKE $1 OR contenido ILIKE $1)`,
            [texto]
        ),

        pool.query(
            `SELECT id_actividad, id_taller, id_barrio, nombre, descripcion, fecha, estado
             FROM actividad
             WHERE nombre ILIKE $1 OR descripcion ILIKE $1`,
            [texto]
        ),

        pool.query(
            `SELECT id_barrio, nombre, descripcion
             FROM barrio
             WHERE nombre ILIKE $1 OR descripcion ILIKE $1`,
            [texto]
        )
    ]);

    return {
        talleres: talleres.rows,
        noticias: noticias.rows,
        actividades: actividades.rows,
        barrios: barrios.rows
    };
}

module.exports = {
    buscar
};
