import "./Noticias.css";

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
    <section className="noticias" id="noticias">
      <div className="noticias-encabezado">
        <div>
          <h2>Últimas noticias</h2>
          <p className="noticias-subtitulo">
            Enterate de las novedades de nuestra comunidad.
          </p>
        </div>
      </div>

      <div className="noticias-lista">
        {noticias.map((noticia) => (
          <article className="noticia-card" key={noticia.id}>
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
          </article>
        ))}
      </div>
    </section>
  );
}

export default Noticias;

