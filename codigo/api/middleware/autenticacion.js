const jwt = require('jsonwebtoken');

// Middleware para autenticar el token JWT y autorizar roles de usuario
const autenticarToken = (req, res, next) => {
    const encabezado = req.headers['authorization'];

    if (!encabezado || !encabezado.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'Se requiere iniciar sesión' 
        });
    }

    const token = encabezado.split(' ')[1]; 

    try {
        const datosUsuario = jwt.verify( //jwt.verify() verifica que el token es válido y no ha expirado, y decodifica los datos del usuario
            token, 
            process.env.JWT_SECRETO
        );

        req.usuario = datosUsuario; // Almacena los datos del usuario en la solicitud para su uso posterior
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido o vencido'
        });
    }
}

//autorizarRol permite restringir una ruta a determinados roles de usuario. 
// Se pasa un array de roles permitidos y se verifica si el rol del usuario coincide con alguno de ellos. Si no coincide, se devuelve un error 403 (Forbidden).
function autorizarRol( ...rolesPermitidos) {
    return function  (req, res, next) {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: 'No tienes permisos para realizar esta acción'
            });
        }

        next(); //permite que la solicitud continúe si el usuario tiene el rol permitido
    };
}

module.exports = {
    autenticarToken,
    autorizarRol
};



