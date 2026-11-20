import { useSesion } from "../../contexto/Sesion";
import "../../styles/Bienvenida.css";

function Bienvenida() {
  const { usuario } = useSesion();

  return (
    <section className="bienvenida">
      <div className="bienvenida-contenido">

        <h1>
          {usuario
            ? `¡Bienvenido, ${usuario.username}!`
            : "¡Hola, bienvenido!"}
        </h1>

        <p>
          Conocé Barrio Cultura, un espacio para descubrir
          actividades, talleres y propuestas de nuestra comunidad.
        </p>

        <a href="#quienes-somos" className="btn-conocer">
          Conocer más
        </a>

      </div>
    </section>
  );
}

export default Bienvenida;
