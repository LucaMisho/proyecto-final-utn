import { Link } from "react-router-dom";
import useNovedades from "../../hooks/useNovedades";
import NovedadesLista from "./NovedadesLista";
import Reveal from "./Reveal";
import "../../styles/Novedades.css";

function Novedades() {
  const { novedades, cargando, error, recargar } = useNovedades(3);

  return (
    <section className="novedades banda banda--celeste banda--parallax" id="novedades">
      <Reveal className="novedades-encabezado">
         <div>
        <h2>Novedades</h2>
        <p className="novedades-subtitulo">Lo último de nuestros barrios</p>
        </div>
      </Reveal>

<<<<<<< HEAD
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
=======
      <div className="novedades-contenido">
        {novedades.map((novedad, index) => (
          <Reveal
            as="article"
            className="novedad-card"
            delay={index}
            key={index}
          >
            <div className="novedad-media">
              <img
                src={novedad.imagen}
                alt={novedad.titulo}
                className="novedad-imagen"
                loading="lazy"
              />
            </div>

            <div className="novedad-info">
              <div className="novedad-meta">
                <span className="novedad-categoria">
                  {novedad.categoria}
                </span>
                <span className="novedad-fecha">
                  {novedad.fecha}
                </span>
              </div>

              <h3>{novedad.titulo}</h3>
              <p>{novedad.descripcion}</p>

              <a href="#novedad-detalle">Conocer más →</a>
            </div>
          </Reveal>
        ))}
>>>>>>> 1239fbefcbdb8750fa98aaac735f7c93c0d3b87c
      </div>

    </section>
  );
}

export default Novedades;