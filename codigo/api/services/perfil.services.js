const bcrypt = require("bcryptjs"); 

// Error con código HTTP, para que el controller sepa qué responder
const crearError = (status, mensaje) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

const obtenerPerfil = async (id_usuario) => {
  const usuario = await usuarioRepository.obtenerUsuarioPorId(id_usuario);
  if (!usuario) {
    throw crearError(404, "Usuario no encontrado");
  }
  const { contraseña, ...perfil } = usuario; // nunca devolver la contraseña
  return perfil;
};

const actualizarPerfil = async (id_usuario, { username, email, password }) => {
  if (!username && !email && !password) {
    throw crearError(400, "No se enviaron datos para actualizar");
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    throw crearError(400, "Email inválido");
  }
  if (password && password.length < 8) {
    throw crearError(400, "La contraseña debe tener al menos 8 caracteres");
  }

  if (username) {
    const existente = await usuarioRepository.buscarPorUsername(username);
    if (existente && existente.id_usuario !== id_usuario) {
      throw crearError(409, "El nombre de usuario ya está en uso");
    }
  }

  const claveHash = password ? await bcrypt.hash(password, 10) : undefined;

  try {
    return await usuarioRepository.actualizarPerfil(id_usuario, {
      username,
      email,
      claveHash
    });
  } catch (error) {
    if (error.code === "23505") { // UNIQUE de PostgreSQL (email repetido)
      throw crearError(409, "El email ya está en uso");
    }
    throw error;
  }
};

module.exports = { obtenerPerfil, actualizarPerfil };