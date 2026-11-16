const bcrypt = require("bcryptjs");
const usuariosRepositorio = require("../data/usuarios.repositorio");


const verPerfil = async (req, res) => {
  try {
    const usuario = await usuariosRepositorio.obtenerUsuarioPorId(req.usuario.id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const { contrasena, ...perfil } = usuario;
    res.status(200).json(perfil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return res.status(400).json({ error: "No se enviaron datos para actualizar" });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }
    if (password && password.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    if (username) {
      const existente = await usuariosRepositorio.buscarPorUsername(username);
      if (existente && existente.id_usuario !== req.usuario.id_usuario) {
        return res.status(409).json({ error: "El nombre de usuario ya está en uso" });
      }
    }

    const claveHash = password ? await bcrypt.hash(password, 10) : undefined;

    const actualizado = await usuariosRepositorio.actualizarPerfil(
      req.usuario.id_usuario,
      { username, email, claveHash }
    );
    res.status(200).json(actualizado);
  } catch (error) {
    if (error.code === "23505") { // violación de UNIQUE en PostgreSQL (email repetido)
      return res.status(409).json({ error: "El email ya está en uso" });
    }
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { verPerfil, actualizarPerfil };