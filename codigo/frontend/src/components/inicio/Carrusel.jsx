import { useState, useEffect } from "react";
import "../../styles/Carrusel.css";

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

function prefiereMenosMovimiento() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function Carrusel() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(prefiereMenosMovimiento);
  const [encima, setEncima] = useState(false);

  const enMovimiento = !pausado && !encima;

  useEffect(() => {
    if (!enMovimiento) return undefined;

    const intervalo = setInterval(() => {
      setActual((anterior) => (anterior + 1) % diapositivas.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [enMovimiento]);

  const anterior = () => {
    setActual((actual - 1 + diapositivas.length) % diapositivas.length);
  };

  const siguiente = () => {
    setActual((actual + 1) % diapositivas.length);
  };

  return (
    <section
      className="carrusel"
      aria-label="Contenido destacado"
      aria-roledescription="carrusel"
    >

      <div
        className="carrusel-banner"
        onMouseEnter={() => setEncima(true)}
        onMouseLeave={() => setEncima(false)}
        onFocus={() => setEncima(true)}
        onBlur={() => setEncima(false)}
      >

        <div
          className="carrusel-diapositivas"
          aria-live={enMovimiento ? "off" : "polite"}
        >
          {diapositivas.map((item, indice) => (
            <div
              key={item.id}
              className={
                actual === indice
                  ? "carrusel-diapositiva visible"
                  : "carrusel-diapositiva"
              }
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${indice + 1} de ${diapositivas.length}`}
              aria-hidden={actual === indice ? undefined : "true"}
            >
              <img
                src={item.imagen}
                alt={item.titulo}
                className="carrusel-fondo"
              />

              <div className="carrusel-panel">
                <h2>{item.titulo}</h2>
                <p>{item.subtitulo}</p>
              </div>

              <a
                href={item.enlace}
                className="carrusel-boton"
                tabIndex={actual === indice ? undefined : -1}
              >
                {item.boton} →
              </a>
            </div>
          ))}
        </div>

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

        <button
          className="carrusel-pausa"
          onClick={() => setPausado(!pausado)}
          aria-label={
            pausado
              ? "Reanudar el cambio automático de imágenes"
              : "Pausar el cambio automático de imágenes"
          }
        >
          <span aria-hidden="true">{pausado ? "▶" : "❚❚"}</span>
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
