import "../styles/Footer.css";
import cerrarMenu from "./Header";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">

        {/* Identidad */}
        <div className="footer-identidad">
          <h2>Envión Quequén</h2>
          <span>Barrio Cultura</span>

          <p>
            Un espacio de encuentro, participación y
            crecimiento para nuestra comunidad.
          </p>
        </div>

        {/* Navegación */}
        <div className="footer-enlaces">
          <h3>Navegación</h3>

          <a href="/" onClick={cerrarMenu}>Inicio</a>
          <a href="#quienes-somos">Quiénes somos</a>
          <a href="/#novedades">Novedades</a>
          <a href="/#noticias">Noticias</a>
          <a href="/#sugerencias">Sugerencias</a>
          <a href="/#contacto">Contacto</a>
        </div>

        {/* Redes sociales */}
        <div className="footer-redes">
          <h3>Seguinos y contactanos</h3>

          <p>
            Encontrá nuestras actividades y novedades
            en nuestras redes sociales.
          </p>

          <div className="footer-redes-iconos">

            <a
              href="https://www.instagram.com/barrioculturanecochea/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>

            <a
              href="https://www.facebook.com/people/CIC-Barrio-Norte-Necochea/100067140305835/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <i className="bi bi-facebook"></i>
            </a>

            <a
              href="mailto:"
              aria-label="Gmail"
              title="Gmail"
            >
              <i className="bi bi-envelope-fill"></i>
            </a>

          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-final">
        <p>
          © {new Date().getFullYear()} Envión Quequén - Barrio Cultura.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

