// Middleware para manejar errores y rutas no encontradas

// La función rutaNoEncontrada se ejecuta cuando no se encuentra una ruta coincidente 
// y devuelve un error 404 (Not Found) con un mensaje adecuado.
function rutaNoEncontrada(req, res, next) {
    res.status(404).json({
        mensaje: 'La ruta solicitada no existe'
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

    res.status(err.satatus || err.statusCode || 500).json({
        error: err.status && err.status < 500
        ? err.message : 'Error interno del servidor'
    });
}

module.exports = {
    rutaNoEncontrada,
    manejarErrores
};