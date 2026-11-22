import { useEffect, useState } from "react";
import Reveal from "../components/inicio/Reveal";
import Skeleton from "../components/inicio/Skeleton";
import Icono from "../components/talleres/Icono";
import TarjetaTaller from "../components/talleres/TarjetaTaller";
import ModalTaller from "../components/talleres/ModalTaller";
import { normalizar } from "../components/talleres/Utilidades.js";
import "../styles/Talleres.css";

// Ajustá esta línea a la variable que ya usás en el Login
const API = import.meta.env.VITE_API_URL;

function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const respuesta = await fetch(`${API}/talleres`);
        if (!respuesta.ok) throw new Error("Error al cargar talleres");
        const datos = await respuesta.json();
        if (!cancelado) setTalleres(datos);

        // Los barrios son un dato extra: si fallan, igual se muestran los talleres
        try {
          const respuestaBarrios = await fetch(`${API}/barrios`);
          if (respuestaBarrios.ok && !cancelado) {
            setBarrios(await respuestaBarrios.json());
          }
        } catch {
          /* sin barrios */
        }
      } catch {
        if (!cancelado) setError(true);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  function nombreBarrio(idBarrio) {
    // Ajustá "nombre" si la columna del barrio se llama distinto
    const barrio = barrios.find((b) => b.id_barrio === idBarrio);
    return barrio ? barrio.nombre : "";
  }

  const filtrados = talleres.filter((taller) => {
    const texto = normalizar(
      `${taller.nombre} ${taller.descripcion} ${taller.dia} ${nombreBarrio(
        taller.id_barrio
      )}`
    );
    return texto.includes(normalizar(busqueda.trim()));
  });

  function contenido() {
    if (cargando) {
      return (
        <div className="talleres-lista">
          <Skeleton cantidad={3} />
        </div>
      );
    }

    if (error) {
      return (
        <p className="talleres-mensaje">
          No pudimos cargar los talleres. Intentá de nuevo más tarde.
        </p>
      );
    }

    if (talleres.length === 0) {
      return (
        <p className="talleres-mensaje">
          Todavía no hay talleres publicados.
        </p>
      );
    }

    if (filtrados.length === 0) {
      return (
        <p className="talleres-mensaje">
          No encontramos talleres que coincidan con tu búsqueda.
        </p>
      );
    }

    return (
      <div className="talleres-lista">
        {filtrados.map((taller, index) => (
          <TarjetaTaller
            key={taller.id_taller ?? taller.id ?? taller.nombre}
            taller={taller}
            barrio={nombreBarrio(taller.id_barrio)}
            delay={(index % 3) + 1}
            onVer={setSeleccionado}
          />
        ))}
      </div>
    );
  }

      return (
        <section className="talleres banda banda--rosa" id="talleres">
         <div className="talleres-fondo" aria-hidden="true">
           {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="talleres-flota" />
            ))}
      </div>

 
      <Reveal className="talleres-encabezado">
        <h1>Conocé nuestros Talleres</h1>

        <label className="talleres-buscador">
          <Icono nombre="buscar" />
          <input
            type="search"
            placeholder="Buscar talleres..."
            aria-label="Buscar talleres"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </Reveal>

      {contenido()}

      {seleccionado && (
        <ModalTaller
          taller={seleccionado}
          barrio={nombreBarrio(seleccionado.id_barrio)}
          alCerrar={() => setSeleccionado(null)}
        />
      )}
    </section>
  );
}

export default Talleres;