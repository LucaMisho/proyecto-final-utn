import { useRef, useState } from "react";
import "../../styles/SearchBar.css";

function SearchBar() {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const inputRef = useRef(null);

  // Si está cerrado, la lupa solo abre el campo; si está abierto, envía la búsqueda
  function manejarLupa(e) {
    if (!abierto) {
      e.preventDefault();
      setAbierto(true);
      inputRef.current?.focus();
    }
  }

  function manejarEnvio(e) {
    if (!texto.trim()) {
      e.preventDefault();
    }
  }

  // Se cierra al perder el foco, siempre que no haya texto escrito
  function manejarBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget) && !texto.trim()) {
      setAbierto(false);
    }
  }

  function manejarTecla(e) {
    if (e.key === "Escape") {
      setTexto("");
      setAbierto(false);
    }
  }

  return (
    <div className={`busqueda ${abierto ? "busqueda--abierta" : ""}`}>
      <form
        className="busqueda-form"
        onSubmit={manejarEnvio}
        onBlur={manejarBlur}
        role="search"
      >
        <button
          type="submit"
          aria-label="Buscar"
          aria-expanded={abierto}
          onClick={manejarLupa}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar..."
          aria-label="Buscar en Barrio Cultura"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={manejarTecla}
          tabIndex={abierto ? 0 : -1}
        />
      </form>
    </div>
  );
}

export default SearchBar;
