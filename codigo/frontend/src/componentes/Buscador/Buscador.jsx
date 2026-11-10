
import "./Buscador.css";

function Buscador() {
  return (
    <section className="buscador">
      <form
        className="formulario-busqueda"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          placeholder="Buscar talleres, actividades, noticias..."
          aria-label="Buscar talleres, actividades y noticias"
        />

        <button type="submit" aria-label="Buscar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </form>
    </section>
  );
}

export default Buscador;
