// Middleware para manejar errores y rutas no encontradas
const {
    ErrorDeDatos,
    ErrorDeCredenciales,
    ErrorSinPermiso,
    ErrorNoEncontrado,
    ErrorDeNegocio
} = require("../services/errores");

// La función rutaNoEncontrada se ejecuta cuando no se encuentra una ruta coincidente 
// y devuelve un error 404 (Not Found) con un mensaje adecuado.
function rutaNoEncontrada(req, res, next) {
    res.status(404).json({
        error: 'La ruta solicitada no existe'
    });
}

// La función manejarErrores se encarga de capturar y manejar errores en la aplicación.
// Si ocurre un error, se registra en la consola y se devuelve una respuesta
// con el código de estado correspondiente y un mensaje de error.
function manejarErrores(err, req, res, next) {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || err.statusCode || 500).json({
        error: err.status && err.status < 500
        ? err.message : 'Error interno del servidor'
    });
}

// Traduce un error de un servicio o de la base de datos a la respuesta HTTP.
// Los errores que no se reconocen se muestran en consola y se responden como 500 sin detalles.
function responderError(res, error) {
    if (error instanceof ErrorDeDatos) return res.status(400).json({ error: error.message });
    if (error instanceof ErrorDeCredenciales) return res.status(401).json({ error: error.message });
    if (error instanceof ErrorSinPermiso) return res.status(403).json({ error: error.message });
    if (error instanceof ErrorNoEncontrado) return res.status(404).json({ error: error.message });
    if (error instanceof ErrorDeNegocio) return res.status(409).json({ error: error.message });

    const restriccion = error.constraint || "";

    // 23505: valor repetido en una columna única
    if (error.code === "23505") {
        let mensaje = "Ya existe un registro con esos datos";
        if (restriccion.includes("username")) mensaje = "Ya existe un usuario con ese nombre de usuario";
        else if (restriccion.includes("email")) mensaje = "Ya existe una cuenta con ese email";
        else if (restriccion.includes("dni")) mensaje = "Ya existe una persona con ese DNI";
        else if (restriccion.includes("inscripcion")) mensaje = "Ese alumno ya está inscripto en ese taller";
        else if (restriccion.includes("asistencia")) mensaje = "Ya hay una asistencia de ese alumno en ese taller y fecha";
        else if (restriccion.includes("personal")) mensaje = "Ese usuario ya figura como personal";
        return res.status(409).json({ error: mensaje });
    }

    // 23503: clave foránea. Si el dato referenciado no existe es un error del pedido (400);
    // si se intenta borrar algo que tiene datos relacionados es un conflicto (409).
    if (error.code === "23503") {
        if (String(error.detail || "").includes("is not present")) {
            return res.status(400).json({ error: "Hace referencia a un registro que no existe" });
        }
        return res.status(409).json({ error: "No se puede borrar porque tiene datos relacionados" });
    }

    // Falta un dato obligatorio, no cumple una restricción, formato inválido o demasiado largo
    if (["23502", "23514", "22P02", "22007", "22008", "22003", "22001"].includes(error.code)) {
        return res.status(400).json({ error: "Algún dato falta, es demasiado largo o no tiene un valor válido" });
    }

    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = {
    rutaNoEncontrada,
    manejarErrores,
    responderError
};