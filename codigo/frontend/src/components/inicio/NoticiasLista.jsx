import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/fecha";
import { aTextoPlano } from "../../utils/noticias";
import Reveal from "./Reveal";

export default function NoticiasLista({
  noticias,
  cargando,
  error,
  onReintentar
}) {
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
        <p className="noticias-estado">
          Todavía no hay noticias.
        </p>
      )}

      {!cargando && !error && noticias.length > 0 && (
        <div className="noticias-lista">

          {noticias.map((noticia, index) => (
            <Reveal
              as="article"
              className={`noticia-card ${
                index === 0
                  ? "noticia-card--principal"
                  : "noticia-card--secundaria"
              }`}
              delay={index % 3}
              key={noticia.id}
            >

              {/* IMAGEN */}
              <div
                className={`noticia-imagen-contenedor ${
                  noticia.imagen
                    ? ""
                    : "noticia-imagen-contenedor--vacia"
                }`}
              >
                {noticia.imagen ? (
                  <img
                    src={noticia.imagen}
                    alt={noticia.titulo}
                    className="noticia-imagen"
                    loading="lazy"
                  />
                ) : (
                  <span className="noticia-imagen-placeholder">
                    BARRIO CULTURA
                  </span>
                )}

                {index === 0 && (
                  <span className="noticia-destacada">
                    Noticia destacada
                  </span>
                )}
              </div>

              {/* INFORMACIÓN */}
              <div className="noticia-info">

                <div className="noticia-meta">
                  <span className="noticia-tipo">
                    {noticia.tipo}
                  </span>

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

                <p className="noticia-extracto">
                  {aTextoPlano(noticia.descripcion)}
                </p>

                <Link to={`/noticias/${noticia.id}`}>
                  Leer noticia <span>→</span>
                </Link>

              </div>

            </Reveal>
          ))}

        </div>
      )}
    </>
  );
}