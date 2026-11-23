import { useEffect } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo";
import useListado from "../hooks/useListado";
import { normalizarNoticia } from "../utils/noticias";
import NoticiasLista from "../components/inicio/NoticiasLista";
import "../styles/Noticias.css";

export default function TodasNoticias() {
  useTitulo("Noticias");

  const { items, cargando, error, recargar } = useListado("/noticias");
  const noticias = items.map(normalizarNoticia);

  // Al llegar desde el Inicio, la página arranca arriba de todo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="noticias noticias-pagina banda banda--durazno banda--parallax">
      <div className="noticias-encabezado">
        <h2>Todas las noticias</h2>
        <p className="noticias-subtitulo">
          Enterate de las novedades de nuestra comunidad.
        </p>
      </div>

      <NoticiasLista
        noticias={noticias}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
      />

      <div className="noticias-pie">
        <Link to="/" className="noticias-ver-todas">
          ← Volver al inicio
        </Link>
      </div>
    </section>
  );
}