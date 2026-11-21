import Reveal from "./Reveal";
import Deslizador from "./Deslizador";
import "../../styles/Noticias.css";

function Noticias() {
  const noticias = [
    {
      id: 1,
      tipo: "Comunidad",
      titulo: "Actividades en nuestra comunidad",
      descripcion:
        "Conocé las últimas actividades y propuestas de Barrio Cultura.",
      imagen: "/noticia1.png",
      alt: "Actividades de Barrio Cultura"
    },
    {
      id: 2,
      tipo: "Talleres",
      titulo: "Nuevos talleres disponibles",
      descripcion:
        "Descubrí los talleres y espacios de aprendizaje que tenemos para vos.",
      imagen: "/noticia2.png",
      alt: "Talleres de Barrio Cultura"
    }
  ];

  return (
    <section className="noticias banda banda--durazno banda--parallax" id="noticias">
      <Reveal className="noticias-encabezado">
        <div>
          <h2>Últimas noticias</h2>
          <p className="noticias-subtitulo">
            Enterate de las novedades de nuestra comunidad.
          </p>
        </div>
      </Reveal>

      <Deslizador etiqueta="Últimas noticias">
        {noticias.map((noticia, index) => (
          <Reveal
            as="article"
            className="noticia-card"
            delay={index + 1}
            key={noticia.id}
          >
            <div className="noticia-imagen-contenedor">
              <img
                src={noticia.imagen}
                alt={noticia.alt}
                className="noticia-imagen"
              />
            </div>

            <div className="noticia-info">
              <span className="noticia-tipo">{noticia.tipo}</span>

              <h3>{noticia.titulo}</h3>

              <p>{noticia.descripcion}</p>
            </div>
          </Reveal>
        ))}
      </Deslizador>
    </section>
  );
}

export default Noticias;

