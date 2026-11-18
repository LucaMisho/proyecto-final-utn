import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  async function manejarLogin(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !clave) {
      setError("Completá el usuario y la contraseña.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
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
          datos.mensaje || datos.error || "Usuario o contraseña incorrectos."
        );
      }

      if (!datos.token || !datos.usuario) {
        throw new Error(
          "El servidor no devolvió los datos de inicio de sesión."
        );
      }

      localStorage.setItem("token", datos.token);
      localStorage.setItem("usuario", JSON.stringify(datos.usuario));

      // Se muestra el mensaje de éxito y recién después se redirige.
      // El botón queda deshabilitado (cargando sigue en true) hasta navegar.
      setExito(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      setError(error.message || "No se pudo conectar con el servidor.");
      setCargando(false);
    }
  }

  return (
    <main className="login-pagina">
      <section className="login-contenedor">
        <Link to="/" className="login-volver">
          ← Volver al inicio
        </Link>

        <div className="login-encabezado">
          <img src="/logo.png" alt="Logo Barrio Cultura" />

          <h1>¡Bienvenido!</h1>

          <p>Ingresá a tu cuenta para acceder a Barrio Cultura.</p>
        </div>

        <form className="login-formulario" onSubmit={manejarLogin}>
          {/* Mensaje que puede llegar desde Registro con navigate("/login", { state: { mensaje } }) */}
          {state?.mensaje && !exito && (
            <p className="login-exito" role="status">
              <IconoCheck />
              {state.mensaje}
            </p>
          )}

          <div className="login-campo">
            <label htmlFor="username">Nombre de usuario</label>

            <input
              id="username"
              type="text"
              placeholder="Ingresá tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={cargando}
            />
          </div>

          <div className="login-campo">
            <label htmlFor="clave">Contraseña</label>

            <div className="login-campo-password">
              <input
                id="clave"
                type={verClave ? "text" : "password"}
                placeholder="Ingresá tu contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoComplete="current-password"
                disabled={cargando}
              />

              <button
                type="button"
                className="login-ver"
                onClick={() => setVerClave(!verClave)}
                aria-label={
                  verClave ? "Ocultar contraseña" : "Mostrar contraseña"
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

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {exito && (
            <p className="login-exito" role="status">
              <IconoCheck />
              ¡Listo! Iniciaste sesión. Te llevamos al inicio…
            </p>
          )}

          <button type="submit" disabled={cargando}>
            {cargando && !exito && (
              <span className="login-spinner" aria-hidden="true" />
            )}
            {exito ? "Ingresaste" : cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="login-pie">
          ¿Todavía no tenés una cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </section>
    </main>
  );
}

function IconoCheck() {
  return <span className="login-icono login-icono-check" aria-hidden="true" />;
}

export default Login;
