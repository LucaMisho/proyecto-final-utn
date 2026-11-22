
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSesion } from "../contexto/Sesion";
import logo from "../assets/logo.png";
import SearchBar from "../components/inicio/SearchBar";
import "../styles/Header.css";

const SECCIONES = ["novedades", "noticias", "contacto"];

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("");

  const { usuario } = useSesion();
  const { pathname } = useLocation();

  const enInicio = pathname === "/";

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function irAlInicio() {
    cerrarMenu();
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    if (!enInicio) {
      setSeccionActiva("");
      return undefined;
    }

    const visibles = new Set();

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            visibles.add(entrada.target.id);
          } else {
            visibles.delete(entrada.target.id);
          }
        });

        const activa = SECCIONES.find((id) => visibles.has(id)) || "";
        setSeccionActiva(activa);
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    SECCIONES.forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) observador.observe(elemento);
    });

    return () => observador.disconnect();
  }, [enInicio]);

  function propiedadesDe(id) {
    return seccionActiva === id
      ? { className: "activo", "aria-current": "location" }
      : {};
  }

  const inicioActivo = enInicio && seccionActiva === "";

  return (
    <header className="header">

      {/* Logo */}
      <Link
        to="/"
        className="header-logo"
        onClick={irAlInicio}
        aria-label="Ir al inicio"
      >
        <img src={logo} alt="Logo Barrio Cultura" />
      </Link>

      {/* Nombre del proyecto */}
      <div className="header-titulo">
        <span>Barrio Cultura</span>
        <span>Envión - Quequén</span>
      </div>


      {/* Navegación */}
      <nav
        className={`menu-navegacion ${menuAbierto ? "abierto" : ""}`}
        aria-label="Principal"
      >
        <Link
          to="/"
          onClick={irAlInicio}
          className={inicioActivo ? "activo" : undefined}
          aria-current={inicioActivo ? "page" : undefined}
        >
          Inicio
        </Link>

        <Link to="/talleres" onClick={cerrarMenu}>
          Talleres
        </Link>

        <a href="/#novedades" onClick={cerrarMenu} {...propiedadesDe("novedades")}>
          Novedades
        </a>

        <a href="/#noticias" onClick={cerrarMenu} {...propiedadesDe("noticias")}>
          Noticias
        </a>

        <a href="/#contacto" onClick={cerrarMenu} {...propiedadesDe("contacto")}>
          Contacto
        </a>
      </nav>


      {/* Buscador compacto (lupa que se expande) */}
      <SearchBar />

      {/* Inicio de sesión o perfil */}
      {usuario ? (
        <Link
          to="/perfil"
          className="header-login"
          aria-label={`Mi perfil, ${usuario.username}`}
          title="Mi perfil"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
          </svg>
        </Link>
      ) : (
        <Link
          to="/login"
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
        </Link>
      )}

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
