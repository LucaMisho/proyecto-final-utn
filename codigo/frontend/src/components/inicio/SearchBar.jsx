import "../../styles/SearchBar.css";

function SearchBar() {
  return (
    <div className="busqueda">
      <form className="busqueda-form">
        <button type="submit" aria-label="Buscar">
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
          type="search"
          placeholder="Buscar..."
          aria-label="Buscar en Barrio Cultura"
        />
      </form>
    </div>
  );
}

export default SearchBar;
