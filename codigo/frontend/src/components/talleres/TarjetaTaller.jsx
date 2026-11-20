import Reveal from "../inicio/Reveal";
import Icono from "./Icono";
import { estaDisponible, textoHorario } from "./utilidades";

function TarjetaTaller({ taller, barrio, delay, onVer }) {
  const disponible = estaDisponible(taller.estado);
  // Si agregás una columna de imagen a la tabla talleres, se usa acá
  const imagen = taller.imagen || taller.imagen_url;
  const inicial = (taller.nombre || "T").charAt(0).toUpperCase();

  return (
    <Reveal as="article" className="taller-card" delay={delay}>
      {imagen ? (
        <img
          src={imagen}
          alt=""
          className="taller-imagen"
          loading="lazy"
        />
      ) : (
        <div className="taller-imagen taller-imagen--vacia" aria-hidden="true">
          {inicial}
        </div>
      )}

      <h3>{taller.nombre}</h3>

      <span
        className={`taller-estado ${
          disponible ? "taller-estado--disponible" : "taller-estado--inactivo"
        }`}
      >
        {disponible ? "Disponible" : "Inactivo"}
      </span>

      <ul className="taller-meta">
        {barrio && (
          <li>
            <Icono nombre="pin" />
            <span>{barrio}</span>
          </li>
        )}
        <li>
          <Icono nombre="calendario" />
          <span>{taller.dia}</span>
        </li>
        <li>
          <Icono nombre="reloj" />
          <span>{textoHorario(taller)}</span>
        </li>
        {taller.cupo ? (
          <li>
            <Icono nombre="personas" />
            <span>Cupo: {taller.cupo} lugares</span>
          </li>
        ) : null}
      </ul>

      <button
        type="button"
        className="taller-boton"
        disabled={!disponible}
        onClick={() => onVer(taller)}
      >
        {disponible ? "Ver taller" : "Deshabilitado"}
      </button>
    </Reveal>
  );
}

export default TarjetaTaller;