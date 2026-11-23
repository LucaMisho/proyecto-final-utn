
import { useEffect, useState } from "react";
import Reveal from "../components/inicio/Reveal";
import API from "../config/api";
import "../styles/Actividades.css";

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargarActividades() {
      try {
        const respuesta = await fetch(`${API}/actividades`);

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las actividades");
        }

        const datos = await respuesta.json();
        setActividades(datos);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setCargando(false);
      }
    }

    cargarActividades();
  }, []);

  function mostrarFecha(fecha) {
    if (!fecha) return "";

    const [anio, mes, dia] = fecha.substring(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
  }

  const hoy = new Date().toLocaleDateString("en-CA");
  const visibles = actividades.filter((a) => a.estado !== "cancelada" && a.estado !== "inactiva");
  const proximas = visibles
    .filter((a) => a.estado !== "realizada" && String(a.fecha).slice(0, 10) >= hoy)
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const pasadas = visibles
    .filter((a) => !proximas.includes(a))
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));

  function tarjeta(actividad) {
    return (
      <article className="actividad-card" key={actividad.id_actividad}>
        <span className="actividad-fecha">{mostrarFecha(actividad.fecha)}</span>

        <h3>{actividad.nombre}</h3>

        {actividad.descripcion && <p>{actividad.descripcion}</p>}
      </article>
    );
  }

  return (
    <section className="pagina-actividades">
      <Reveal className="actividades-encabezado">
        <h1>Actividades</h1>
        <p>
          Conocé las novedades, propuestas y acontecimientos
          de nuestra comunidad.
        </p>
      </Reveal>

      {cargando && <p>Cargando actividades...</p>}

      {error && (
        <p className="actividades-mensaje">
          No se pudieron cargar las actividades. Intentá nuevamente más tarde.
        </p>
      )}

      {!cargando && !error && visibles.length === 0 && (
        <p className="actividades-mensaje">
          Próximamente compartiremos nuevas actividades.
        </p>
      )}

      {!cargando && !error && visibles.length > 0 && (
        <>
          <section className="actividades-listado" aria-labelledby="actividades-proximas">
            <h2 id="actividades-proximas">Próximas actividades</h2>

            {proximas.length === 0 ? (
              <p className="actividades-mensaje">
                Por ahora no hay actividades programadas. Mirá las anteriores más abajo.
              </p>
            ) : (
              proximas.map(tarjeta)
            )}
          </section>

          {pasadas.length > 0 && (
            <details className="actividades-realizadas">
              <summary>Actividades anteriores ({pasadas.length})</summary>
              <section className="actividades-listado">{pasadas.map(tarjeta)}</section>
            </details>
          )}
        </>
      )}
    </section>
  );
}

export default Actividades;
