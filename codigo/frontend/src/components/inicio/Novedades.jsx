import { Link } from "react-router-dom";
import useNovedades from "../../hooks/useNovedades";
import NovedadesLista from "./NovedadesLista";
import Reveal from "./Reveal";
import "../../styles/Novedades.css";
import { Link } from "react-router-dom"; 

function Novedades() {
<<<<<<< HEAD
  const { novedades, cargando, error, recargar } = useNovedades(3);
=======
  const novedades = [
    {
      imagen: "/novedad1.png",
      fecha: "10 nov",
      categoria: "Actividades",
      titulo: "Nueva jornada de talleres en Barrio Cultura",
      descripcion:
        "Sumate este sábado a las actividades al aire libre.",
        ruta: "/actividades",
    },
    {
      imagen: "/novedad2.jpeg",
      fecha: "08 nov",
      categoria: "Talleres",
      titulo: "Nuevas propuestas para aprender",
      descripcion:
        "Conocé las actividades y talleres disponibles en nuestros barrios.",
        ruta: "/talleres",
    },
    {
      imagen: "/novedad3.jpeg",
      fecha: "05 nov",
      categoria: "Comunidad",
      titulo: "Seguimos creciendo juntos",
      descripcion:
        "Compartimos experiencias y momentos con nuestra comunidad.",
        ruta: "/comunidad",
    },
  ];
>>>>>>> cande-rama

  return (
    <section className="novedades banda banda--celeste banda--parallax" id="novedades">
    
 {/* ENCABEZADO */}
      <Reveal className="novedades-encabezado">
        <span className="noticias-etiqueta">
          BARRIO CULTURA · ENVIÓN-QUEQUÉN
        </span>

<<<<<<< HEAD
        <h2>Novedades</h2>

        <p className="noticias-subtitulo">
          Lo último de nuestros barrios.
        </p>
=======
       <Link to="/actividades" className="novedades-ver-todas">
          Ver todas →
        </Link>
>>>>>>> cande-rama
      </Reveal>

      <NovedadesLista
        novedades={novedades}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
      />

<<<<<<< HEAD
      <div className="novedades-pie">
        <Link to="/novedades" className="novedades-ver-todas">
          Ver todas las novedades →
        </Link>
=======
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

              <Link to={novedad.ruta}>Conocer más →</Link>
            </div>
          </Reveal>
        ))}
>>>>>>> cande-rama
      </div>

    </section>
  );
}

export default Novedades;