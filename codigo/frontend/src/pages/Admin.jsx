import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSesion } from "../contexto/Sesion";
import { useAvisos } from "../contexto/Avisos";
import useTitulo from "../hooks/useTitulo";
import TablaAdmin from "../components/admin/TablaAdmin";
import { RECURSOS, ETIQUETAS } from "../components/admin/configuracion";
import { pedir, ErrorDeSesion } from "../components/admin/pedir";
import "../styles/Admin.css";

const ESTADO_INICIAL = { filas: [], cargando: true, error: "" };

function Admin() {
  useTitulo("Administración");

  const { usuario, token, cerrarSesion } = useSesion();
  const { avisar } = useAvisos();
  const navigate = useNavigate();

  const [activa, setActiva] = useState(RECURSOS[0].clave);
  const [datos, setDatos] = useState(() =>
    Object.fromEntries(RECURSOS.map((r) => [r.clave, ESTADO_INICIAL]))
  );
  const botones = useRef({});

  const esAdministrador = usuario?.rol === "ADMINISTRADOR";

  const fallarSesion = useCallback(
    (error) => {
      cerrarSesion();
      avisar(error.message, "error");
      navigate("/login");
    },
    [cerrarSesion, avisar, navigate]
  );

  const cargar = useCallback(
    async (clave) => {
      const recurso = RECURSOS.find((r) => r.clave === clave);

      setDatos((d) => ({ ...d, [clave]: { ...d[clave], cargando: true, error: "" } }));

      try {
        const filas = await pedir(recurso.ruta, { token });
        setDatos((d) => ({
          ...d,
          [clave]: { filas: Array.isArray(filas) ? filas : [], cargando: false, error: "" },
        }));
      } catch (error) {
        if (error instanceof ErrorDeSesion) {
          fallarSesion(error);
          return;
        }
        setDatos((d) => ({
          ...d,
          [clave]: { filas: [], cargando: false, error: error.message },
        }));
      }
    },
    [token, fallarSesion]
  );

  useEffect(() => {
    if (!esAdministrador) return;
    RECURSOS.forEach((r) => cargar(r.clave));
  }, [esAdministrador, cargar]);

  function alCambiar(clave) {
    cargar(clave);
    // Las vacantes de un taller dependen de sus inscripciones
    if (clave === "inscripciones") cargar("talleres");
  }

  function etiquetaDe(relacion, id) {
    const recurso = RECURSOS.find((r) => r.clave === relacion);
    const fila = datos[relacion].filas.find((f) => f[recurso.id] === id);
    return fila ? ETIQUETAS[relacion](fila) : `Nº ${id}`;
  }

  function moverPestana(e, indice) {
    const ultimo = RECURSOS.length - 1;
    let destino = null;

    if (e.key === "ArrowRight") destino = indice === ultimo ? 0 : indice + 1;
    else if (e.key === "ArrowLeft") destino = indice === 0 ? ultimo : indice - 1;
    else if (e.key === "Home") destino = 0;
    else if (e.key === "End") destino = ultimo;

    if (destino === null) return;

    e.preventDefault();
    const clave = RECURSOS[destino].clave;
    setActiva(clave);
    botones.current[clave]?.focus();
  }

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ mensaje: "Iniciá sesión para entrar al panel de administración." }}
      />
    );
  }

  if (!esAdministrador) {
    return (
      <section className="admin-pagina">
        <h1>Administración</h1>
        <p className="admin-mensaje" role="alert">
          No tenés permiso para ver esta página.
        </p>
        <Link to="/" className="admin-boton">
          Volver al inicio
        </Link>
      </section>
    );
  }

  const recursoActivo = RECURSOS.find((r) => r.clave === activa);

  return (
    <section className="admin-pagina">
      <h1>Panel de administración</h1>

      <div className="admin-pestanas" role="tablist" aria-label="Secciones de administración">
        {RECURSOS.map((r, indice) => (
          <button
            key={r.clave}
            type="button"
            role="tab"
            id={`pestana-${r.clave}`}
            aria-selected={activa === r.clave}
            aria-controls={`panel-${r.clave}`}
            tabIndex={activa === r.clave ? 0 : -1}
            className={activa === r.clave ? "activa" : undefined}
            ref={(el) => {
              botones.current[r.clave] = el;
            }}
            onClick={() => setActiva(r.clave)}
            onKeyDown={(e) => moverPestana(e, indice)}
          >
            {r.titulo}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activa}`}
        aria-labelledby={`pestana-${activa}`}
        className="admin-panel"
      >
        <h2 tabIndex={-1}>{recursoActivo.titulo}</h2>

        <TablaAdmin
          key={activa}
          recurso={recursoActivo}
          estado={datos[activa]}
          datos={datos}
          etiquetaDe={etiquetaDe}
          sesion={usuario}
          token={token}
          avisar={avisar}
          alCambiar={alCambiar}
          alFallarSesion={fallarSesion}
          alReintentar={cargar}
        />
      </div>
    </section>
  );
}

export default Admin;
