import API from "../config/api";
import { useState, useEffect, useRef } from "react";
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
  const [mostrarTerminos, setMostrarTerminos] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Cerrar el modal con Escape y controlar el foco.
  useEffect(() => {
    if (!mostrarTerminos) return;

    modalRef.current?.focus();

    function cerrarConEscape(e) {
      if (e.key === "Escape") {
        setMostrarTerminos(false);
      }
    }

    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [mostrarTerminos]);

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
      <section className="login-layout registro-layout">

        {/* PANEL IZQUIERDO */}
        <aside className="login-visual registro-visual">
          <Link to="/" className="login-volver">
            ← Volver al inicio
          </Link>

          <div className="login-visual-contenido">
            <img src={logo} alt="Logo Barrio Cultura" />

            <span className="login-visual-linea"></span>

            <h2>¡Sumate a Barrio Cultura!</h2>

            <p>
              Formá parte de una comunidad que conecta personas,
              barrios y oportunidades para crecer juntos.
            </p>
          </div>

          <span className="login-visual-pie">
            Barrio Cultura · Envión Quequén
          </span>
        </aside>

        {/* PANEL DERECHO */}
        <div className="login-contenedor registro-contenedor">
          <div className="registro-contenido">

            <div className="login-encabezado">
              <img src={logo} alt="Logo Barrio Cultura" />

              <h1>Crear cuenta</h1>

              <p>Completá tus datos para registrarte.</p>
            </div>

            <form
              className="login-formulario registro-formulario"
              onSubmit={manejarRegistro}
            >
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
                        verClave
                          ? "login-icono-ojo-tachado"
                          : "login-icono-ojo"
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

              {/* TÉRMINOS Y CONDICIONES */}
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
                  <button
                    type="button"
                    className="registro-link-terminos"
                    onClick={() => setMostrarTerminos(true)}
                  >
                    términos y condiciones
                  </button>
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
              ¿Ya tenés una cuenta?{" "}
              <Link to="/login">Iniciá sesión</Link>
            </p>

          </div>
        </div>
      </section>

      {/* VENTANA EMERGENTE */}
      {mostrarTerminos && (
        <div
          className="terminos-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setMostrarTerminos(false);
            }
          }}
        >
          <section
            className="terminos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terminos-titulo"
            tabIndex={-1}
            ref={modalRef}
          >
            <div className="terminos-modal-encabezado">
              <div>
                <span className="terminos-etiqueta">
                  BARRIO CULTURA
                </span>

                <h2 id="terminos-titulo">
                  Términos y condiciones
                </h2>
              </div>

              <button
                type="button"
                className="terminos-cerrar"
                onClick={() => setMostrarTerminos(false)}
                aria-label="Cerrar términos y condiciones"
              >
                ×
              </button>
            </div>

            <div className="terminos-modal-contenido">
              <p>
                Antes de crear tu cuenta, es importante que conozcas
                las condiciones de uso de Barrio Cultura y Envión-Quequén.
              </p>

              <h3>1. Uso de la plataforma</h3>
              <p>
                La plataforma Barrio Cultura tiene como finalidad facilitar
                el acceso a información sobre actividades, talleres y
                propuestas comunitarias.
              </p>

              <h3>2. Datos de usuario</h3>
              <p>
                El usuario se compromete a proporcionar información correcta
                y a mantener la confidencialidad de sus credenciales de acceso.
              </p>

              <h3>3. Uso responsable</h3>
              <p>
                Los usuarios deben utilizar la plataforma de manera
                respetuosa y responsable, evitando acciones que perjudiquen
                a otras personas o al funcionamiento del sitio.
              </p>

              <h3>4. Privacidad</h3>
              <p>
                La información proporcionada será utilizada conforme a las
                políticas de privacidad aplicables y a la finalidad de
                la plataforma.
              </p>
            </div>

            <div className="terminos-modal-pie">
              <button
                type="button"
                className="terminos-btn-cerrar"
                onClick={() => setMostrarTerminos(false)}
              >
                Volver al registro
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Registro;
