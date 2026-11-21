import { formatearFecha } from "../../utils/fecha";      // nuevo
import Reveal from "./Reveal";

function NovedadTarjeta({ novedad, delay }) {
  return (
    <Reveal as="article" className="novedad-card" delay={delay}>
      <div className={`novedad-media ${novedad.imagen ? "" : "novedad-media--vacia"}`}>
        {novedad.imagen && (
          <img
            src={novedad.imagen}
            alt={novedad.titulo}
            className="novedad-imagen"
            loading="lazy"
          />
        )}
      </div>

      <div className="novedad-info">
        <div className="novedad-meta">
          <span className="novedad-categoria">{novedad.categoria}</span>
          <span className="novedad-fecha">{formatearFecha(novedad.fecha)}</span>
        </div>

        <h3>{novedad.titulo}</h3>
        <p>{novedad.descripcion}</p>

        <a href="#novedad-detalle">Conocer más →</a>
      </div>
    </Reveal>
  );
}

export default function NovedadesLista({ novedades, cargando, error, onReintentar }) {
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
        <p className="novedades-estado">Todavía no hay novedades.</p>
      )}

      <div className="novedades-contenido">
        {novedades.map((novedad, index) => (
          <NovedadTarjeta
            key={novedad.id_novedad}
            novedad={novedad}
            delay={index % 3}
          />
        ))}
      </div>
    </>
  );
}