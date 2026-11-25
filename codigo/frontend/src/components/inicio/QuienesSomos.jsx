import { Link } from "react-router-dom";
import "../../styles/QuienesSomos.css";

function QuienesSomos() {
  return (
    <section className="quienes-somos banda banda--rosa" id="quienes-somos">
      <div className="quienes-somos-contenido">
        <span className="quienes-somos-etiqueta">
          CONOCÉ NUESTRO ESPACIO
        </span>

        <h2>¿Quiénes somos?</h2>

        <p>
          Somos Envión Quequén y Barrio Cultura, un espacio
          de encuentro, participación y acompañamiento para
          nuestra comunidad.
        </p>

        <p>
          A través de diferentes talleres, actividades y
          propuestas, buscamos generar oportunidades de
          aprendizaje, expresión e integración, fortaleciendo
          los vínculos y la participación en los barrios.
        </p>

        <Link to="/talleres" className="quienes-somos-boton">
          Conocé nuestros talleres
        </Link>
      </div>

      <div className="quienes-somos-imagen">
        <img
          src="/quienes-somos.jpg"
          alt="Actividades y encuentros de la comunidad"
          width="1000"
          height="640"

        />
      </div>
    </section>
  );
}

export default QuienesSomos;