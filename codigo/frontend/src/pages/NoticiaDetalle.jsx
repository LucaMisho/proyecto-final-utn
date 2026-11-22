import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../config/api";
import useTitulo from "../hooks/useTitulo";
import { formatearFecha } from "../utils/fecha";
import { normalizarNoticia } from "../utils/noticias";
import "../styles/NoticiaDetalle.css";

export default function NoticiaDetalle() {
  const { id } = useParams();

  const [noticia, setNoticia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [noExiste, setNoExiste] = useState(false);

  useTitulo(noticia ? noticia.titulo : "Noticia");

  const cargar = useCallback(async () => {
    setError("");
    setNoExiste(false);
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/noticias/${encodeURIComponent(id)}`);

      // 404: no existe. 400: el id no es un número válido
      if (respuesta.status === 404 || respuesta.status === 400) {
        setNoticia(null);
        setNoExiste(true);
        return;
      }

      const texto = await respuesta.text();
      let datos = {};

      try {
        datos = texto ? JSON.parse(texto) : {};
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo cargar la noticia.");
      }

      const fila = Array.isArray(datos) ? datos[0] : datos;

      if (!fila) {
        setNoticia(null);
        setNoExiste(true);
        return;
      }

      setNoticia(normalizarNoticia(fila));
    } catch (e) {
      setError(e.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
    window.scrollTo(0, 0);
  }, [cargar]);

  return (
    <section className="noticia-detalle-pagina banda banda--durazno banda--parallax">
      <Link to="/noticias" className="noticia-detalle-volver">
        ← Volver a noticias
      </Link>

      {cargando && (
        <p className="noticia-detalle-estado" role="status">
          Cargando noticia...
        </p>
      )}

      {error && (
        <div className="noticia-detalle-estado noticia-detalle-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      {noExiste && (
        <div className="noticia-detalle-estado" role="alert">
          <p>No encontramos esa noticia. Puede que haya sido eliminada.</p>
          <Link to="/noticias" className="noticia-detalle-boton">
            Ver todas las noticias
          </Link>
        </div>
      )}

      {noticia && (
        <article className="noticia-detalle">
          {noticia.imagen && (
            <img
              src={noticia.imagen}
              alt={noticia.titulo}
              className="noticia-detalle-imagen"
            />
          )}

          <div className="noticia-detalle-cuerpo">
            {noticia.fecha && (
              <time
                className="noticia-detalle-fecha"
                dateTime={String(noticia.fecha).slice(0, 10)}
              >
                {formatearFecha(noticia.fecha, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}

            <h1>{noticia.titulo}</h1>
            <p className="noticia-detalle-texto">{noticia.contenido}</p>
          </div>
        </article>
      )}
    </section>
  );
}