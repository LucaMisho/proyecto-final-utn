import { useState } from "react";
import "../../styles/PlanillaAsistencias.css";

// Datos ficticios solo para la demostración visual. No se consultan ni se envían a la API.
const TALLER_DEMO = { id: "arte", nombre: "Arte" };

const PERIODO_DEMO = { anio: 2026, mes: 11, nombre: "Noviembre" };

const ALUMNOS_DEMO = [
  { id: 1, apellido: "Acosta", nombre: "Camila" },
  { id: 2, apellido: "Benitez", nombre: "Tomas" },
  { id: 3, apellido: "Castro", nombre: "Martina" },
  { id: 4, apellido: "Diaz", nombre: "Lautaro" },
  { id: 5, apellido: "Ferreyra", nombre: "Julieta" },
  { id: 6, apellido: "Gimenez", nombre: "Nahuel" },
  { id: 7, apellido: "Lopez", nombre: "Valentina" },
  { id: 8, apellido: "Sosa", nombre: "Bautista" },
];

// Algunas marcas de ejemplo para mostrar los estados P y A desde el inicio.
const MARCAS_INICIALES = {
  "1-3": "P",
  "1-5": "A",
  "1-10": "P",
  "2-4": "P",
  "2-11": "A",
  "3-6": "P",
};

function diasDelMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}

function claveMarca(idAlumno, dia) {
  return `${idAlumno}-${dia}`;
}

function siguienteMarca(actual) {
  if (actual === "P") return "A";
  if (actual === "A") return "";
  return "P";
}

function textoEstado(marca) {
  if (marca === "P") return "presente";
  if (marca === "A") return "ausente";
  return "sin marcar";
}

function PlanillaAsistencias() {
  const [tallerAbierto, setTallerAbierto] = useState(null);
  const [marcas, setMarcas] = useState(MARCAS_INICIALES);

  const dias = diasDelMes(PERIODO_DEMO.anio, PERIODO_DEMO.mes);

  function alternarMarca(idAlumno, dia) {
    const clave = claveMarca(idAlumno, dia);

    setMarcas((actuales) => {
      const copia = { ...actuales };
      const nueva = siguienteMarca(actuales[clave]);

      if (nueva) copia[clave] = nueva;
      else delete copia[clave];

      return copia;
    });
  }

  if (!tallerAbierto) {
    return (
      <section className="planilla-seleccion" aria-labelledby="planilla-seleccion-titulo">
        <div className="planilla-seleccion__encabezado">
          <h3 id="planilla-seleccion-titulo">Planillas mensuales</h3>
          <p>Elegí un taller para abrir su planilla de asistencia.</p>
        </div>

        <button
          type="button"
          className="planilla-taller"
          onClick={() => setTallerAbierto(TALLER_DEMO)}
        >
          <span className="planilla-taller__nombre">{TALLER_DEMO.nombre}</span>
          <span className="planilla-taller__detalle">Planilla de noviembre de 2026</span>
          <span className="planilla-taller__accion">Abrir planilla →</span>
        </button>

        <p className="planilla-nota">
          Versión de demostración con datos ficticios. No consulta la API ni guarda cambios.
        </p>
      </section>
    );
  }

  return (
    <section className="planilla-vista" aria-labelledby="planilla-titulo">
      <div className="planilla-barra">
        <button
          type="button"
          className="admin-boton admin-boton--secundario admin-boton--chico"
          onClick={() => setTallerAbierto(null)}
        >
          ← Volver a talleres
        </button>
      </div>

      <header className="planilla-encabezado">
        <div>
          <p className="planilla-encabezado__etiqueta">Registro de asistencia</p>
          <h3 id="planilla-titulo">{tallerAbierto.nombre}</h3>
          <p className="planilla-encabezado__periodo">
            {PERIODO_DEMO.nombre} de {PERIODO_DEMO.anio}
          </p>
        </div>

        <ul className="planilla-leyenda" aria-label="Referencias de la planilla">
          <li>
            <span className="planilla-muestra planilla-muestra--presente">P</span> Presente
          </li>
          <li>
            <span className="planilla-muestra planilla-muestra--ausente">A</span> Ausente
          </li>
          <li>
            <span className="planilla-muestra">—</span> Sin marcar
          </li>
        </ul>
      </header>

      <div className="planilla-contenedor">
        <table className="planilla-tabla">
          <caption className="admin-solo-lectores">
            Planilla de asistencia de {tallerAbierto.nombre}, {PERIODO_DEMO.nombre.toLowerCase()} de{" "}
            {PERIODO_DEMO.anio}.
          </caption>

          <thead>
            <tr>
              <th scope="col" className="planilla-columna-nombre">
                Apellido y nombre
              </th>
              {Array.from({ length: dias }, (_, indice) => indice + 1).map((dia) => (
                <th key={dia} scope="col" className="planilla-columna-dia">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ALUMNOS_DEMO.map((alumno) => (
              <tr key={alumno.id}>
                <th scope="row" className="planilla-columna-nombre">
                  {alumno.apellido}, {alumno.nombre}
                </th>

                {Array.from({ length: dias }, (_, indice) => indice + 1).map((dia) => {
                  const marca = marcas[claveMarca(alumno.id, dia)] ?? "";
                  const estado = textoEstado(marca);

                  return (
                    <td key={dia} className="planilla-celda-contenedor">
                      <button
                        type="button"
                        className={`planilla-celda${marca ? ` planilla-celda--${estado}` : ""}`}
                        onClick={() => alternarMarca(alumno.id, dia)}
                        aria-label={`${alumno.apellido}, ${alumno.nombre}, día ${dia}: ${estado}. Cambiar marca`}
                        title={`Día ${dia}: ${estado}`}
                      >
                        {marca}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="planilla-nota">
        Demostración visual: las marcas se guardan solo en esta pantalla y no se envían a la API.
      </p>
    </section>
  );
}

export default PlanillaAsistencias;
