
import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/fecha";
import Reveal from "./Reveal";

const RUTAS_POR_CATEGORIA = {
  actividades: "/actividades",
  talleres: "/talleres",
  comunidad: "/comunidad",
};

export function claveDeCategoria(categoria) {
  return String(categoria ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function rutaDe(categoria) {
  return RUTAS_POR_CATEGORIA[claveDeCategoria(categoria)] ?? "/novedades";
}

function NovedadTarjeta({ novedad, delay }) {
  return (
    <Reveal as="article" className="novedad-card" delay={delay}>
      <div
        className={`novedad-media ${
          novedad.imagen ? "" : "novedad-media--vacia"
        }`}
      >
        {novedad.imagen ? (
          <img
            src={novedad.imagen}
            alt={novedad.titulo}
            className="novedad-imagen"
            loading="lazy"
          />
        ) : (
          <span className="novedad-placeholder">
            BARRIO CULTURA
          </span>
        )}

        <span className="novedad-categoria">
          {novedad.categoria || "Comunidad"}
        </span>
      </div>

      <div className="novedad-info">
        {novedad.fecha && (
          <time
            className="novedad-fecha"
            dateTime={String(novedad.fecha).slice(0, 10)}
          >
            {formatearFecha(novedad.fecha)}
          </time>
        )}

        <h3>{novedad.titulo}</h3>

        <p>{novedad.descripcion}</p>

        <Link to={rutaDe(novedad.categoria)} className="novedad-enlace">
          Conocer más <span>→</span>
        </Link>
      </div>
    </Reveal>
  );
}

export default function NovedadesLista({
  novedades,
  cargando = true,
  error,
  onReintentar,
  mensajeVacio = "Todavía no hay novedades.",
}) {
  return (
    <>
     {cargando && (
  <div className="novedades-contenido" role="status" aria-live="polite">
    <span className="sr-only">Cargando novedades...</span>
    {[1, 2, 3].map((n) => (
      <div className="skeleton-card" key={n} aria-hidden="true">
        <div className="skeleton skeleton-imagen"></div>
        <div className="skeleton skeleton-linea skeleton-linea--corta"></div>
        <div className="skeleton skeleton-linea skeleton-linea--titulo"></div>
        <div className="skeleton skeleton-linea"></div>
      </div>
    ))};
  </div>
)}

      {error && (
        <div className="novedades-estado novedades-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onReintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && novedades.length === 0 && (
        <p className="novedades-estado">
          {mensajeVacio}
        </p>
      )}

      {!cargando && !error && novedades.length > 0 && (
        <div className="novedades-contenido">
          {novedades.map((novedad, index) => (
            <NovedadTarjeta
              key={novedad.id_novedad}
              novedad={novedad}
              delay={index % 3}
            />
          ))}
        </div>
      )}
    </>
  );
}
