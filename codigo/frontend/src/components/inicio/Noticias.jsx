import { Link } from "react-router-dom";
import useListado from "../../hooks/useListado";
import { normalizarNoticia } from "../../utils/noticias";
import NoticiasLista from "./NoticiasLista";
import Reveal from "./Reveal";
import "../../styles/Noticias.css";

function Noticias() {
  const { items, cargando, error, recargar } = useListado("/noticias", 3);
  const noticias = items.map(normalizarNoticia);

  return (
    <section className="noticias" id="noticias">

      {/* FONDO GEOMÉTRICO ANIMADO */}
      <div className="noticias-fondo-3d" aria-hidden="true">
        <span className="figura figura-esfera figura-1"></span>
        <span className="figura figura-cubo figura-2"></span>
        <span className="figura figura-anillo figura-3"></span>
        <span className="figura figura-esfera figura-4"></span>
        <span className="figura figura-cubo figura-5"></span>
        <span className="figura figura-anillo figura-6"></span>
      </div>

      {/* ENCABEZADO */}
      <Reveal className="noticias-encabezado">
        <span className="noticias-etiqueta">
          BARRIO CULTURA · ENVIÓN-QUEQUÉN
        </span>

        <h2>Noticias</h2>

        <p className="noticias-subtitulo">
          Enterate de lo que sucede en nuestra comunidad.
        </p>
      </Reveal>

      {/* LISTADO */}
      <NoticiasLista
        noticias={noticias}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
      />

      {/* PIE */}
      <Reveal className="noticias-pie">
        <Link to="/noticias" className="noticias-ver-todas">
          Explorar todas las noticias
          <span> →</span>
        </Link>
      </Reveal>

    </section>
  );
}

export default Noticias;