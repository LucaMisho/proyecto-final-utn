import { useState } from "react";
import Reveal from "./Reveal";
import "../../styles/Sugerencias.css";


const LIMITE = 500;

function Sugerencias({ onEnviar }) {
  const [texto, setTexto] = useState("");

  function manejarEnvio(e) {
    e.preventDefault();
    if (!texto.trim()) return;

    // Acá va la lógica de envío que ya tengas (fetch a /sugerencias, etc.)
    if (onEnviar) onEnviar(texto.trim());
    setTexto("");
  }

  return (
    <section className="sugerencias banda banda--rosa" id="sugerencias">
      <div className="sugerencias-contenedor">

        {/* Columna de texto */}
        <Reveal className="sugerencias-texto">
          <div className="sugerencias-icono" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
              <path d="M9 11h6M9 14h4" />
            </svg>
          </div>

          <span className="sugerencias-etiqueta">Participá y compartí</span>
          <h2>¡Tu opinión nos importa!</h2>
          <p>
            Queremos seguir creciendo junto a nuestra comunidad.
            Compartí tus ideas, propuestas o sugerencias para
            mejorar nuestros espacios y actividades.
          </p>
        </Reveal>

        {/* Columna del formulario */}
        <Reveal delay={2}>
          <form className="sugerencias-form" onSubmit={manejarEnvio}>
            <label htmlFor="sugerencia">Dejanos tu sugerencia</label>

            <textarea
              id="sugerencia"
              placeholder="Escribí tu idea o propuesta..."
              maxLength={LIMITE}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />

            <div className="sugerencias-pie">
              <span className="sugerencias-contador">
                {texto.length}/{LIMITE}
              </span>

              <button type="submit" disabled={!texto.trim()}>
                Enviar sugerencia
              </button>
            </div>
          </form>
        </Reveal>

      </div>
    </section>
  );
}

export default Sugerencias;
