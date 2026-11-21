import API from "../config/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSesion } from "../contexto/Sesion";
import { useAvisos } from "../contexto/Avisos";
import useTitulo from "../hooks/useTitulo";
import "../styles/Perfil.css";

export default function Perfil() {
  useTitulo("Mi perfil");

  const { usuario, token, cerrarSesion } = useSesion();
  const { avisar } = useAvisos();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const saliendo = useRef(false);

  const [sugerencias, setSugerencias] = useState([]);
  const [errorSugerencias, setErrorSugerencias] = useState("");
  const [cargandoSugerencias, setCargandoSugerencias] = useState(true);

  const cargarPerfil = useCallback(async () => {
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/perfil`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (respuesta.status === 401) {
        cerrarSesion();
        avisar("Tu sesión venció. Iniciá sesión de nuevo.", "error");
        navigate("/login");
        return;
      }

      const texto = await respuesta.text();
      let datos = {};

      try {
        datos = texto ? JSON.parse(texto) : {};
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo cargar tu perfil.");
      }

      setPerfil(datos);
    } catch (e) {
      setError(e.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [token, cerrarSesion, avisar, navigate]);

  const cargarSugerencias = useCallback(async () => {
    setErrorSugerencias("");
    setCargandoSugerencias(true);

    try {
      const respuesta = await fetch(`${API}/perfil/sugerencias`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (respuesta.status === 401) {
        cerrarSesion();
        avisar("Tu sesión venció. Iniciá sesión de nuevo.", "error");
        navigate("/login");
        return;
      }

      const texto = await respuesta.text();
      let datos = [];

      try {
        datos = texto ? JSON.parse(texto) : [];
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudieron cargar tus sugerencias.");
      }

      setSugerencias(Array.isArray(datos) ? datos : []);
    } catch (e) {
      console.error("Error al cargar sugerencias:", e);
      setErrorSugerencias(e.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargandoSugerencias(false);
    }
  }, [token, cerrarSesion, avisar, navigate]);

  useEffect(() => {
    if (token) {
      cargarPerfil();
      cargarSugerencias();
    }
  }, [token, cargarPerfil, cargarSugerencias]);

  // Sin sesión no hay perfil: se lleva al login (salvo que se esté cerrando la sesión)
  if (!usuario && saliendo.current) {
    return null;
  }

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ mensaje: "Iniciá sesión para ver tu perfil." }}
      />
    );
  }

  function salir() {
    saliendo.current = true;
    cerrarSesion();
    avisar("Cerraste sesión.", "exito");
    navigate("/");
  }

  const nombre = perfil?.username || usuario.username;

  return (
    <section className="perfil-pagina">
      <h1>Mi perfil</h1>

      {cargando && (
        <p className="perfil-estado" role="status">
          Cargando tu perfil...
        </p>
      )}

      {error && (
        <div className="perfil-estado perfil-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={cargarPerfil}>
            Reintentar
          </button>
        </div>
      )}

      {perfil && (
        <>
          <div className="perfil-tarjeta perfil-cabecera">
            <div className="perfil-avatar" aria-hidden="true">
              {nombre.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="perfil-nombre">{nombre}</p>
              <p className="perfil-correo">{perfil.email}</p>
            </div>
          </div>

          <div className="perfil-tarjeta">
            <h2>Mis datos</h2>

            <dl className="perfil-datos">
              <dt>Nombre de usuario</dt>
              <dd>{perfil.username}</dd>

              <dt>Correo electrónico</dt>
              <dd>{perfil.email}</dd>

              <dt>Contraseña</dt>
              <dd aria-label="Contraseña oculta">••••••••</dd>
            </dl>
          </div>

          <div className="perfil-tarjeta">
            <h2>Mis sugerencias</h2>

            {cargandoSugerencias && (
              <p className="perfil-vacio" role="status">
                Cargando tus sugerencias...
              </p>
            )}

            {errorSugerencias && (
              <div className="perfil-error-interno" role="alert">
                <p>{errorSugerencias}</p>
                <button type="button" onClick={cargarSugerencias}>
                  Reintentar
                </button>
              </div>
            )}

            {!cargandoSugerencias &&
              !errorSugerencias &&
              sugerencias.length === 0 && (
                <p className="perfil-vacio">
                  Todavía no enviaste ninguna sugerencia.
                </p>
              )}

            {sugerencias.length > 0 && (
              <ul className="perfil-sugerencias">
                {sugerencias.map((s) => {
                  const estado = String(s.estado).toLowerCase();

                  return (
                    <li key={s.id_sugerencia} className="perfil-sugerencia">
                      <p className="perfil-sugerencia-texto">{s.mensaje}</p>

                      <div className="perfil-sugerencia-pie">
                        <span className="perfil-sugerencia-fecha">
                          {new Date(s.fecha).toLocaleDateString("es-AR")}
                        </span>

                        <span
                          className={`perfil-estado-chip perfil-estado-chip--${estado}`}
                        >
                          {estado === "pendiente" ? "Pendiente" : "Recibida"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {usuario.rol === "ADMINISTRADOR" && (
        <Link to="/admin" className="perfil-salir perfil-admin">
          Panel de administración
        </Link>
      )}

      <button type="button" className="perfil-salir" onClick={salir}>
        Cerrar sesión
      </button>
    </section>
  );
}