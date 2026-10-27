const noticiaRepositorio = require("../data/noticias.repositorio");
const { ErrorNoEncontrado, ErrorDeDatos } = require("./errores");

//listarNoticias()
async function listarNoticias() {
    return noticiaRepositorio.listarNoticias();
}

//obtenerNoticiaPorId()
async function obtenerNoticia(id) {
    const noticia = await noticiaRepositorio.obtenerNoticiaPorId(id);

    if (!noticia) {
        throw new ErrorNoEncontrado("Noticia no encontrada");
    }

    return noticia;
}

//crearNoticia()
async function crearNoticia(datos) {
    for (const campo of ["titulo", "contenido"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return noticiaRepositorio.crearNoticia(datos);
}

//actualizarNoticia
async function actualizarNoticia(id, datos) {
    const noticia = await noticiaRepositorio.obtenerNoticiaPorId(id);

    if (!noticia) {
        throw new ErrorNoEncontrado("Noticia no encontrada");
    }

    for (const campo of ["titulo", "contenido"]) {
        if (datos[campo] === undefined || datos[campo] === null || String(datos[campo]).trim() === "") {
            throw new ErrorDeDatos(`El campo ${campo} es obligatorio`);
        }
    }

    return noticiaRepositorio.actualizarNoticia(id, datos);
}

//borrarNoticia()
async function borrarNoticia(id) {
    const noticia = await noticiaRepositorio.obtenerNoticiaPorId(id);

    if (!noticia) {
        throw new ErrorNoEncontrado("Noticia no encontrada");
    }

    return noticiaRepositorio.eliminarNoticia(id);
}

module.exports = {
    listarNoticias,
    obtenerNoticia,
    crearNoticia,
    actualizarNoticia,
    borrarNoticia
};
