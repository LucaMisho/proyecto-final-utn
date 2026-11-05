// Errores que lanzan los servicios. El controlador los traduce a un código de estado.
class ErrorDeDatos extends Error {}         // 400: faltan datos o están mal armados
class ErrorDeCredenciales extends Error {}  // 401: usuario o contraseña incorrectos
class ErrorSinPermiso extends Error {}      // 403: se sabe quién es, pero no puede hacerlo
class ErrorNoEncontrado extends Error {}    // 404: el recurso no existe
class ErrorDeNegocio extends Error {}       // 409: choca con datos que ya existen

module.exports = {
    ErrorDeDatos,
    ErrorDeCredenciales,
    ErrorSinPermiso,
    ErrorNoEncontrado,
    ErrorDeNegocio
};
