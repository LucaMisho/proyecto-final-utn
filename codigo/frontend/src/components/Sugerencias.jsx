import "../styles/Sugerencias.css";

function Sugerencias() {
  return (
    <section className="sugerencias" id="sugerencias">
      <div className="sugerencias-contenido">
        <span className="sugerencias-etiqueta">
          PARTICIPÁ Y COMPARTÍ
        </span>

        <h2>¡Tu opinión nos importa!</h2>

        <p>
          Queremos seguir creciendo junto a nuestra comunidad.
          Compartí tus ideas, propuestas o sugerencias para
          mejorar nuestros espacios y actividades.
        </p>

        <form className="sugerencias-formulario">
          <label htmlFor="sugerencia">Dejanos tu sugerencia</label>

          <textarea
            id="sugerencia"
            placeholder="Escribí tu idea o propuesta..."
            rows="5"
          />

          <button type="button">
            Enviar sugerencia
          </button>
        </form>
      </div>
    </section>
  );
}

export default Sugerencias;
