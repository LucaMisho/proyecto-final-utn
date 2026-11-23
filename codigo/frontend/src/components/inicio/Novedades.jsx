import { Link } from "react-router-dom";
import useNovedades from "../../hooks/useNovedades";
import NovedadesLista from "./NovedadesLista";
import Reveal from "./Reveal";
import "../../styles/Novedades.css";

function Novedades() {
  const { novedades, cargando, error, recargar } = useNovedades(3);

  return (
    <section className="novedades banda banda--celeste banda--parallax" id="novedades">
    
 {/* ENCABEZADO */}
      <Reveal className="novedades-encabezado">
        <span className="noticias-etiqueta">
          BARRIO CULTURA · ENVIÓN-QUEQUÉN
        </span>

        <h2>Novedades</h2>

        <p className="noticias-subtitulo">
          Lo último de nuestros barrios.
        </p>
      </Reveal>

      <NovedadesLista
        novedades={novedades}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
      />

      <div className="novedades-pie">
        <Link to="/novedades" className="novedades-ver-todas">
          Ver todas las novedades →
        </Link>
      </div>

    </section>
  );
}

export default Novedades;