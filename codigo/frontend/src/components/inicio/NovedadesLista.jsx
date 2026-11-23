import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/fecha";
import Reveal from "./Reveal";

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

        <Link to="/novedades" className="novedad-enlace">
          Conocer más <span>→</span>
        </Link>
      </div>
    </Reveal>
  );
}

export default function NovedadesLista({
  novedades,
  cargando,
  error,
  onReintentar,
}) {
  return (
    <>
      {cargando && (
        <p className="novedades-estado" role="status">
          Cargando novedades...
        </p>
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
          Todavía no hay novedades.
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
