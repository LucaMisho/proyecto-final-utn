import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function manejarLogin(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !clave) {
      setError("Completá el usuario y la contraseña.");
      return;
    }

    try {
      setCargando(true);

          const respuesta = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: username.trim(),
                contrasena: clave,
              }),
            }
          );

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
      throw new Error("El servidor no devolvió los datos de inicio de sesión.");
    }

      localStorage.setItem("token", datos.token);
      localStorage.setItem("usuario", JSON.stringify(datos.usuario));

      navigate("/");
    } catch (error) {
      setError(error.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-pagina">
      <section className="login-contenedor">

        <a href="/" className="login-volver">
          ← Volver al inicio
        </a>

        <div className="login-encabezado">
          <img src="/logo.png" alt="Logo Barrio Cultura" />

          <h1>¡Bienvenido!</h1>

          <p>
            Ingresá a tu cuenta para acceder a Barrio Cultura.
          </p>
        </div>

        <form className="login-formulario" onSubmit={manejarLogin}>
          <div className="login-campo">
            <label htmlFor="username">Nombre de usuario</label>

            <input
              id="username"
              type="text"
              placeholder="Ingresá tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-campo">
            <label htmlFor="clave">Contraseña</label>

            <input
              id="clave"
              type="password"
              placeholder="Ingresá tu contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="login-pie">
          ¿Todavía no tenés una cuenta?
          {" "}
          <Link to="/registro">Registrate</Link>
        </p>

      </section>
    </main>
  );
}

export default Login;
