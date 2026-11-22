import Reveal from "../inicio/Reveal";
import Icono from "./Icono";
import { estaDisponible, textoHorario } from "./Utilidades.js";

function TarjetaTaller({ taller, barrio, delay, onVer }) {
  const disponible = estaDisponible(taller.estado);
  const imagen = taller.imagen || taller.imagen_url;
  const inicial = (taller.nombre || "T").charAt(0).toUpperCase();

  return (
    <Reveal as="article" className="taller-card" delay={delay}>
      <div className="taller-media">
        {imagen ? (
          <img
            src={imagen}
            alt=""
            className="taller-imagen"
            loading="lazy"
          />
        ) : (
          <div
            className="taller-imagen--vacia"
            aria-hidden="true"
          >
            {inicial}
          </div>
        )}

        <span
          className={`taller-estado ${
            disponible
              ? "taller-estado--disponible"
              : "taller-estado--inactivo"
          }`}
        >
          {disponible ? "Disponible" : "Inactivo"}
        </span>
      </div>

      <div className="taller-info">
        <h3>{taller.nombre}</h3>

        <ul className="taller-meta">
          {barrio && (
            <li>
              <Icono nombre="pin" />
              <span>{barrio}</span>
            </li>
          )}

          {taller.dia && (
            <li>
              <Icono nombre="calendario" />
              <span>{taller.dia}</span>
            </li>
          )}

          <li>
            <Icono nombre="reloj" />
            <span>{textoHorario(taller)}</span>
          </li>

          {taller.cupo && (
            <li>
              <Icono nombre="personas" />
              <span>Cupo: {taller.cupo} lugares</span>
            </li>
          )}
        </ul>

        <button
          type="button"
          className="taller-boton"
          disabled={!disponible}
          onClick={() => onVer(taller)}
        >
          {disponible ? "Ver taller" : "No disponible"}
          {disponible && <span aria-hidden="true"> →</span>}
        </button>
      </div>
    </Reveal>
  );
}

export default TarjetaTaller;
