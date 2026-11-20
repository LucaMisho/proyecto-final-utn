import Reveal from "./Reveal";
import "../../styles/Novedades.css";

function Novedades() {
  const novedades = [
    {
      imagen: "/novedad1.png",
      fecha: "10 nov",
      categoria: "Actividades",
      titulo: "Nueva jornada de talleres en Barrio Cultura",
      descripcion:
        "Sumate este sábado a las actividades al aire libre.",
      destacada: true,
    },
    {
      imagen: "/novedad2.jpeg",
      fecha: "08 nov",
      categoria: "Talleres",
      titulo: "Nuevas propuestas para aprender",
      descripcion:
        "Conocé las actividades y talleres disponibles en nuestros barrios.",
    },
    {
      imagen: "/novedad3.jpeg",
      fecha: "05 nov",
      categoria: "Comunidad",
      titulo: "Seguimos creciendo juntos",
      descripcion:
        "Compartimos experiencias y momentos con nuestra comunidad.",
    },
  ];

  return (
    <section className="novedades banda banda--celeste" id="novedades">
      <Reveal className="novedades-encabezado">
        <div>
          <h2>Novedades</h2>
          <p className="novedades-subtitulo">
            Lo último de nuestros barrios
          </p>
        </div>

        <a href="#todas-las-novedades" className="novedades-ver-todas">
          Ver todas →
        </a>
      </Reveal>

      <div className="novedades-contenido">
        {/* Novedad principal */}
        <Reveal
          as="article"
          className="novedad-card novedad-destacada"
        >
          <img
            src={novedades[0].imagen}
            alt="Actividades de Barrio Cultura"
            className="novedad-imagen"
          />

          <div className="novedad-info">
            <div className="novedad-meta">
              <span className="novedad-categoria">
                {novedades[0].categoria}
              </span>
              <span className="novedad-fecha">
                {novedades[0].fecha}
              </span>
            </div>

            <h3>{novedades[0].titulo}</h3>
            <p>{novedades[0].descripcion}</p>

            <a href="#novedad-detalle">Conocer más →</a>
          </div>
        </Reveal>

        {/* Novedades secundarias */}
        <div className="novedades-secundarias">
          {novedades.slice(1).map((novedad, index) => (
            <Reveal
              as="article"
              className="novedad-card"
              delay={index + 1}
              key={index}
            >
              <img
                src={novedad.imagen}
                alt={novedad.titulo}
                className="novedad-imagen"
              />

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
        </div>
      </div>
    </section>
  );
}

export default Novedades;
