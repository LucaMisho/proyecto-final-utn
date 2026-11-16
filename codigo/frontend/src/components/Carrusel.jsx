
import { useState, useEffect } from "react";
import "./Carrusel.css";

const diapositivas = [
  {
    id: 1,
    imagen: "/carrusel1.jpeg",
    titulo: "Barrio Cultura",
    subtitulo: "Espacios para compartir, aprender y crecer.",
    boton: "Conocé nuestras actividades",
    enlace: "#novedades"
  },
  {
    id: 2,
    imagen: "/carrusel2.jpeg",
    titulo: "Talleres para la comunidad",
    subtitulo: "Descubrí nuevas propuestas en nuestros barrios.",
    boton: "Ver talleres",
    enlace: "#talleres"
  },
  {
    id: 3,
    imagen: "/carrusel3.jpeg",
    titulo: "Crecer juntos",
    subtitulo: "Construimos oportunidades a través de la cultura.",
    boton: "Conocé más",
    enlace: "#noticias"
  }
];

function Carrusel() {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setActual((anterior) => (anterior + 1) % diapositivas.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const anterior = () => {
    setActual((actual - 1 + diapositivas.length) % diapositivas.length);
  };

  const siguiente = () => {
    setActual((actual + 1) % diapositivas.length);
  };

  const diapositiva = diapositivas[actual];

  return (
    <section className="carrusel" aria-label="Contenido destacado">

      <div className="carrusel-banner">

        <img
          src={diapositiva.imagen}
          alt={diapositiva.titulo}
          className="carrusel-fondo"
        />

        <div className="carrusel-panel">
          <h2>{diapositiva.titulo}</h2>
          <p>{diapositiva.subtitulo}</p>
        </div>

        <a href={diapositiva.enlace} className="carrusel-boton">
          {diapositiva.boton} →
        </a>

        <button
          className="carrusel-flecha anterior"
          onClick={anterior}
          aria-label="Imagen anterior"
        >
          &#10094;
        </button>

        <button
          className="carrusel-flecha siguiente"
          onClick={siguiente}
          aria-label="Imagen siguiente"
        >
          &#10095;
        </button>

      </div>

      <div className="carrusel-indicadores">
        {diapositivas.map((item, indice) => (
          <button
            key={item.id}
            className={actual === indice ? "indicador activo" : "indicador"}
            onClick={() => setActual(indice)}
            aria-label={`Ir a la imagen ${indice + 1}`}
            aria-current={actual === indice ? "true" : undefined}
          />
        ))}
      </div>

    </section>
  );
}

export default Carrusel;

