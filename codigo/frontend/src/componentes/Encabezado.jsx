import { useState } from "react";
import "./Encabezado.css";

function Encabezado() { /* Componente de encabezado */
    const [menuAbierto, setMenuAbierto] = useState(false); /* Estado para el menú de navegación */
 
    return (
    <header className="encabezado">
      <div className="encabezado-superior">

        <div className="identidad">
          <div className="logo-barrio">Barrio Cultura</div>
          <div className="logo-envion">Envión Quequén</div>
        </div>

        <a href="/admin" className="acceso-admin">
          Acceso administrador
        </a>

        <button
        className="boton-menu"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
        >
            {menuAbierto ? "X" : "☰"}
        </button>

      </div>

      <nav
        id="menu-principal"
        className={`menu-navegacion ${menuAbierto ? "menu-abierto" : ""}`}
        aria-label="Navegación principal"
        >
        {/* Enlaces de navegación */}
        <a href="#inicio" onClick={() => setMenuAbierto(false)}>Inicio</a>
        <a href="#quienes-somos" onClick={() => setMenuAbierto(false)}>Quiénes somos</a>
        <a href="#noticias" onClick={() => setMenuAbierto(false)}>Noticias</a>
        <a href="#talleres" onClick={() => setMenuAbierto(false)}>Talleres</a>
        <a href="#sugerencias" onClick={() => setMenuAbierto(false)}>Sugerencias</a>
        <a href="#contacto" onClick={() => setMenuAbierto(false)}>Contacto</a>
      </nav>
    </header>
  );
}

export default Encabezado;
