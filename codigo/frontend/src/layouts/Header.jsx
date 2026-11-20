import { useState } from "react";
import logo from "../assets/logo.png";
import SearchBar from "../components/inicio/SearchBar";
import "../styles/Header.css";

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <header className="header">

      {/* Logo */}
      <a href="/" className="header-logo" onClick={cerrarMenu}>
        <img src={logo} alt="Logo Barrio Cultura" />
      </a>

      {/* Nombre del proyecto */}
      <div className="header-titulo">
        <span>Barrio Cultura</span>
        <span>Envión - Quequén</span>
      </div>

      {/* Navegación */}
      <nav
        className={`menu-navegacion ${menuAbierto ? "abierto" : ""}`}
      >
        <a href="/" onClick={cerrarMenu}>Inicio</a>
        <a href="/talleres" onClick={cerrarMenu}>Talleres</a>
        <a href="/#novedades" onClick={cerrarMenu}>Novedades</a>
        <a href="/#noticias" onClick={cerrarMenu}>Noticias</a>
        <a href="/#contacto" onClick={cerrarMenu}>Contacto</a>
      </nav>

      {/* Buscador compacto (lupa que se expande) */}
      <SearchBar />

      {/* Inicio de sesión */}
      <a
        href="/login"
        className="header-login"
        aria-label="Iniciar sesión"
        title="Iniciar sesión"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
        </svg>
      </a>

      {/* Botón hamburguesa: solamente móvil */}
      <button
        className="header-menu"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </header>
  );
}

export default Header;
