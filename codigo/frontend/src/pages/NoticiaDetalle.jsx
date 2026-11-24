import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../config/api";
import useTitulo from "../hooks/useTitulo";
import { formatearFecha } from "../utils/fecha";
import "../styles/NoticiaDetalle.css";
import { normalizarNoticia, limpiarTexto } from "../utils/noticias";
import DOMPurify from "dompurify";

const FORMATO_FECHA = { day: "numeric", month: "long", year: "numeric" };

// ¿El contenido trae etiquetas HTML? (noticias nuevas, cargadas con el editor)
const TIENE_HTML = /<\/?[a-z][\s\S]*?>/i;

export default function NoticiaDetalle() {
  const { id } = useParams();

  const [noticia, setNoticia] = useState(null);
  const [otras, setOtras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [noExiste, setNoExiste] = useState(false);

  useTitulo(noticia ? noticia.titulo : "Noticia");

  // Cuerpo de la noticia:
  // - si viene con HTML: se sanitiza y se muestra con formato
  // - si es texto plano (noticias viejas): se muestra por párrafos como antes
  const cuerpo = useMemo(() => {
    const original = noticia?.contenido;
    if (!original) return { html: "", parrafos: [] };

    const texto = String(original);

    if (TIENE_HTML.test(texto)) {
      // Los &nbsp; impiden que el navegador corte la línea: se pasan a espacios comunes
      const sinNbsp = texto.replace(/&nbsp;|\u00a0/g, " ");
      return { html: DOMPurify.sanitize(sinNbsp), parrafos: [] };
    }

    return {
      html: "",
      parrafos: limpiarTexto(texto)
        .split(/\n+/)
        .filter((parrafo) => parrafo.trim() !== ""),
    };
  }, [noticia]);

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

  // "Seguir leyendo": secundario, si falla no afecta a la noticia
  useEffect(() => {
    let activo = true;

    fetch(`${API}/noticias`)
      .then((r) => (r.ok ? r.json() : []))
      .then((datos) => {
        if (!activo || !Array.isArray(datos)) return;
        setOtras(
          datos
            .map(normalizarNoticia)
            .filter((n) => String(n.id) !== String(id))
            .slice(0, 6)
        );
      })
      .catch(() => {});

    return () => {
      activo = false;
    };
  }, [id]);

  return (
    <section className="noticia-detalle-pagina banda banda--durazno banda--parallax">
      {!noticia && (
        <Link to="/noticias" className="noticia-detalle-volver noticia-detalle-volver--suelto">
          ← Volver a noticias
        </Link>
      )}

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
          <header className="noticia-detalle-portada">
            {noticia.imagen && (
              <>
                <img src={noticia.imagen} alt="" aria-hidden="true" className="noticia-detalle-fondo" />
                <img src={noticia.imagen} alt={noticia.titulo} className="noticia-detalle-imagen" />
              </>
            )}
            <div className="noticia-detalle-portada-texto">
              <Link to="/noticias" className="noticia-detalle-volver">
                ← Volver a noticias
              </Link>
              {noticia.fecha && (
                <time
                  className="noticia-detalle-fecha"
                  dateTime={String(noticia.fecha).slice(0, 10)}
                >
                  {formatearFecha(noticia.fecha, FORMATO_FECHA)}
                </time>
              )}
              <h1>{noticia.titulo}</h1>
            </div>
          </header>

          {cuerpo.html ? (
            <div
              className="noticia-detalle-cuerpo noticia-detalle-texto"
              dangerouslySetInnerHTML={{ __html: cuerpo.html }}
            />
          ) : (
            <div className="noticia-detalle-cuerpo">
              {cuerpo.parrafos.map((parrafo, i) => (
                <p key={i} className="noticia-detalle-texto">
                  {parrafo}
                </p>
              ))}
            </div>
          )}
        </article>
      )}

      {noticia && otras.length > 0 && (
        <section className="noticia-detalle-mas">
          <h2>Seguir leyendo</h2>
          <div className="noticia-detalle-grilla">
            {otras.map((n) => (
              <Link key={n.id} to={`/noticias/${n.id}`} className="noticia-detalle-item">
                {n.imagen && <img src={n.imagen} alt="" />}
                {n.fecha && (
                  <time dateTime={String(n.fecha).slice(0, 10)}>
                    {formatearFecha(n.fecha, FORMATO_FECHA)}
                  </time>
                )}
                <h3>{n.titulo}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}