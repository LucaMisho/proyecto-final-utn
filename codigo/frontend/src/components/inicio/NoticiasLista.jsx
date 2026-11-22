import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/fecha";
import Reveal from "./Reveal";

export default function NoticiasLista({ noticias, cargando, error, onReintentar }) {
  return (
    <>
      {cargando && (
        <p className="noticias-estado" role="status">
          Cargando noticias...
        </p>
      )}

      {error && (
        <div className="noticias-estado noticias-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onReintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && noticias.length === 0 && (
        <p className="noticias-estado">Todavía no hay noticias.</p>
      )}

      <div className="noticias-lista">
        {noticias.map((noticia, index) => (
          <Reveal
            as="article"
            className="noticia-card"
            delay={index % 3}
            key={noticia.id}
          >
            <div
              className={`noticia-imagen-contenedor ${noticia.imagen ? "" : "noticia-imagen-contenedor--vacia"}`}
            >
              {noticia.imagen && (
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="noticia-imagen"
                  loading="lazy"
                />
              )}
            </div>

            <div className="noticia-info">
              <div className="noticia-meta">
                <span className="noticia-tipo">{noticia.tipo}</span>
                {noticia.fecha && (
                  <time
                    className="noticia-fecha"
                    dateTime={String(noticia.fecha).slice(0, 10)}
                  >
                    {formatearFecha(noticia.fecha)}
                  </time>
                )}
              </div>

              <h3>{noticia.titulo}</h3>
              <p>{noticia.descripcion}</p>

              <Link to={`/noticias/${noticia.id}`}>Leer noticia →</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}