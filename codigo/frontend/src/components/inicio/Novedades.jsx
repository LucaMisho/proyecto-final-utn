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
        <span className="novedades-etiqueta">
          BARRIO CULTURA · ENVIÓN-QUEQUÉN
        </span>

        <h2>Novedades</h2>

        <p className="novedades-subtitulo">
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

      <p className="seccion-descripcion">
       Acá encontrás lo último que pasa en Envión Quequén y Barrio Cultura:
       nuevos talleres, jornadas y propuestas para sumarte. Avisos cortos
       para estar siempre al día.
      </p>
      
    </section>
    
  );
}

export default Novedades;