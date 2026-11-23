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

  return (
    <main className="pagina-actividades">
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

      {!cargando && !error && actividades.length === 0 && (
        <p className="actividades-mensaje">
          Próximamente compartiremos nuevas actividades.
        </p>
      )}

      {!cargando && !error && actividades.length > 0 && (
        <section className="actividades-listado">
          {actividades.map((actividad) => (
            <article
              className="actividad-card"
              key={actividad.id_actividad}
            >
              <span className="actividad-fecha">
                {mostrarFecha(actividad.fecha)}
              </span>

              <h2>{actividad.nombre}</h2>

              {actividad.descripcion && (
                <p>{actividad.descripcion}</p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Actividades;
