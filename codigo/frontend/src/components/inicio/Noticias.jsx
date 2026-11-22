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
    <section className="noticias banda banda--durazno banda--parallax" id="noticias">
      <Reveal className="noticias-encabezado">
        <h2>Últimas noticias</h2>
        <p className="noticias-subtitulo">
          Enterate de las novedades de nuestra comunidad.
        </p>
      </Reveal>

      <NoticiasLista
        noticias={noticias}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
      />

      <div className="noticias-pie">
        <Link to="/noticias" className="noticias-ver-todas">
          Ver todas las noticias →
        </Link>
      </div>
    </section>
  );
}

export default Noticias;