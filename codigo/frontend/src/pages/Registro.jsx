import API from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Registro.css";
import logo from "../assets/logo.png";

const LARGO_MINIMO_CLAVE = 8;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Registro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [repetirClave, setRepetirClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);


  const navigate = useNavigate();

  function validar() {
    if (!username.trim() || !email.trim() || !clave || !repetirClave) {
      return "Completá todos los campos.";
    }

    if (username.trim().length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres.";
    }

    if (!EMAIL_VALIDO.test(email.trim())) {
      return "Ingresá un correo electrónico válido.";
    }

    if (clave.length < LARGO_MINIMO_CLAVE) {
      return `La contraseña debe tener al menos ${LARGO_MINIMO_CLAVE} caracteres.`;
    }

    if (clave !== repetirClave) {
      return "Las contraseñas no coinciden.";
    }

    if (!terminos) {
      return "Tenés que aceptar los términos y condiciones para crear la cuenta.";
    }

    return "";
  }

  async function manejarRegistro(e) {
    e.preventDefault();
    setError("");

    const mensajeError = validar();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(`${API}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          contrasena: clave,
        }),
      });

      const texto = await respuesta.text();

      let datos = {};

      try {
        datos = texto ? JSON.parse(texto) : {};
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || datos.error || "No se pudo crear la cuenta."
        );
      }

      // Se muestra el mensaje de éxito y después se lleva al login.
      // cargando sigue en true para que el botón no se pueda volver a pulsar.
      setExito(true);
      setTimeout(() => {
        navigate("/login", {
          state: { mensaje: "Cuenta creada. Ya podés iniciar sesión." },
        });
      }, 1200);
    } catch (error) {
      setError(error.message || "No se pudo conectar con el servidor.");
      setCargando(false);
    }
  }

  return (
    <main className="login-pagina registro-pagina">
      <section className="login-contenedor registro-contenedor">
        <aside className="registro-lateral">
          <h2>Sumate a Barrio Cultura</h2>

          <p>Con tu cuenta podés enviar sugerencias al equipo del programa.</p>

          <p className="registro-lateral-pie">
            ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </aside>

        <div className="registro-contenido">
          <Link to="/" className="login-volver">
            ← Volver al inicio
          </Link>

          <div className="login-encabezado">
            <img src={logo} alt="Logo Barrio Cultura" />

            <h1>Crear cuenta</h1>

            <p>Completá tus datos para registrarte.</p>
          </div>

          <form className="login-formulario" onSubmit={manejarRegistro}>
            <div className="login-campo">
              <label htmlFor="username">Nombre de usuario</label>

              <input
                id="username"
                type="text"
                placeholder="Elegí un nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={cargando}
              />
            </div>

            <div className="login-campo">
              <label htmlFor="email">Correo electrónico</label>

              <input
                id="email"
                type="email"
                placeholder="nombre@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={cargando}
              />
            </div>

            <div className="login-campo">
              <label htmlFor="clave">Contraseña</label>

              <div className="login-campo-password">
                <input
                  id="clave"
                  type={verClave ? "text" : "password"}
                  placeholder={`Mínimo ${LARGO_MINIMO_CLAVE} caracteres`}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  autoComplete="new-password"
                  disabled={cargando}
                />

                <button
                  type="button"
                  className="login-ver"
                  onClick={() => setVerClave(!verClave)}
                  aria-label={
                    verClave ? "Ocultar contraseñas" : "Mostrar contraseñas"
                  }
                >
                  <span
                    className={`login-icono ${
                      verClave ? "login-icono-ojo-tachado" : "login-icono-ojo"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div className="login-campo">
              <label htmlFor="repetirClave">Repetir contraseña</label>

              <input
                id="repetirClave"
                type={verClave ? "text" : "password"}
                placeholder="Escribila de nuevo"
                value={repetirClave}
                onChange={(e) => setRepetirClave(e.target.value)}
                autoComplete="new-password"
                disabled={cargando}
              />
            </div>

            <div className="login-terminos">
              <input
                id="terminos"
                type="checkbox"
                checked={terminos}
                onChange={(e) => setTerminos(e.target.checked)}
                disabled={cargando}
              />

              <label htmlFor="terminos">
                Acepto los{" "}
                <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                  términos y condiciones
                </Link>
              </label>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {exito && (
              <p className="login-exito" role="status">
                <span
                  className="login-icono login-icono-check"
                  aria-hidden="true"
                />
                ¡Listo! Tu cuenta fue creada. Te llevamos al inicio de sesión…
              </p>
            )}

            <button type="submit" disabled={cargando}>
              {cargando && !exito && (
                <span className="login-spinner" aria-hidden="true" />
              )}
              {exito
                ? "Cuenta creada"
                : cargando
                ? "Creando cuenta..."
                : "Crear cuenta"}
            </button>
          </form>

          <p className="login-pie">
            ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Registro;