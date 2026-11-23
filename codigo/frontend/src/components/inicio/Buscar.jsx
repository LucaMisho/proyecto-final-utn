import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../../styles/Buscar.css";

const API = import.meta.env.VITE_API_URL;

const formatearFecha = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    : null;

const SECCIONES = [
  { clave: "novedades", titulo: "Novedades", id: "id_novedad", texto: "titulo", detalle: "descripcion", ruta: "/novedades",
    meta: (i) => [i.categoria, formatearFecha(i.fecha)] },
  { clave: "noticias", titulo: "Noticias", id: "id_noticia", texto: "titulo", detalle: "contenido", ruta: "/noticias",
    meta: (i) => [formatearFecha(i.fecha_publicacion)] },
  { clave: "talleres", titulo: "Talleres", id: "id_taller", texto: "nombre", detalle: "descripcion", ruta: "/talleres",
    meta: () => [] },
  { clave: "actividades", titulo: "Actividades", id: "id_actividad", texto: "nombre", detalle: "descripcion", ruta: "/actividades",
    meta: (i) => [formatearFecha(i.fecha)] },
  { clave: "barrios", titulo: "Barrios", id: "id_barrio", texto: "nombre", detalle: "descripcion", ruta: "/barrios",
    meta: () => [] },
];

function resaltar(texto, q) {
  if (!texto || !q) return texto;
  const escapado = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const partes = String(texto).split(new RegExp(`(${escapado})`, "gi"));
  return partes.map((parte, i) =>
    parte.toLowerCase() === q.toLowerCase() ? <mark key={i}>{parte}</mark> : parte
  );
}

function Buscar() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (q.length < 2) {
    setDatos(null);
    setError(null);
    setCargando(false);
    return;
  }
  // ...el resto queda igual
    setCargando(true);
    setError(null);
    fetch(`${API}/buscar?q=${encodeURIComponent(q)}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setDatos)
      .catch(() => setError("No se pudo realizar la búsqueda. Probá de nuevo en un momento."))
      .finally(() => setCargando(false));
  }, [q]);

  const secciones = datos ? SECCIONES.filter((s) => datos[s.clave]?.length > 0) : [];
  const total = secciones.reduce((suma, s) => suma + datos[s.clave].length, 0);

  return (
    <main className="buscar">
      <header className="buscar-encabezado">
        <span className="buscar-etiqueta">BARRIO CULTURA · ENVIÓN-QUEQUÉN</span>
        <h1>{q.length >= 2 ? <>Resultados para “{q}”</> : "Buscar"}</h1>
        <p className="buscar-estado" aria-live="polite">
          {cargando && "Buscando…"}
          {!cargando && datos && total > 0 && `${total} ${total === 1 ? "resultado" : "resultados"}`}
        </p>
      </header>

      <div className="buscar-contenido">
        {q.length < 2 && <p className="buscar-mensaje">Escribí al menos 2 letras para buscar.</p>}

        {error && (
          <p className="buscar-mensaje buscar-mensaje--error" role="alert">{error}</p>
        )}

        {datos && total === 0 && !cargando && (
          <div className="buscar-vacio">
            <p>No encontramos nada para “{q}”.</p>
            <p>Revisá la ortografía o probá con otra palabra.</p>
            <Link to="/" className="buscar-volver">Volver al inicio</Link>
          </div>
        )}

        {secciones.map(({ clave, titulo, id, texto, detalle, ruta, meta }) => (
          <section key={clave} className="buscar-seccion">
            <h2>
              {titulo} <span className="buscar-contador">{datos[clave].length}</span>
            </h2>
            <ul className="buscar-grilla">
              {datos[clave].map((item) => {
                const datosMeta = meta(item).filter(Boolean);
                return (
                  <li key={item[id]} className="buscar-tarjeta">
                    {datosMeta.length > 0 && (
                      <p className="buscar-meta">{datosMeta.join(" · ")}</p>
                    )}
                    <h3>
                      <Link to={ruta}>{resaltar(item[texto], q)}</Link>
                    </h3>
                    <p className="buscar-detalle">{resaltar(item[detalle], q)}</p>
                    <Link to={ruta} className="buscar-ver">Ver más →</Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Buscar;