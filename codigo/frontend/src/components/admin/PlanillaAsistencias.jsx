import { useCallback, useEffect, useMemo, useState } from "react";
import { pedir, ErrorDeSesion } from "./pedir";
import "../../styles/PlanillaAsistencias.css";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function diasDelMes(anio, mes) {
  return new Date(anio, mes, 0).getDate();
}

function claveMarca(idAlumno, fecha) {
  return `${idAlumno}|${fecha}`;
}

function fechaDelDia(anio, mes, dia) {
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
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

// Convierte las asistencias que devuelve la API en el mapa que usa la grilla.
function marcasDesdePlanilla(planilla) {
  const resultado = {};

  for (const alumno of planilla?.alumnos ?? []) {
    for (const [fecha, presente] of Object.entries(alumno.asistencias ?? {})) {
      resultado[claveMarca(alumno.id_alumno, fecha)] = presente ? "P" : "A";
    }
  }

  return resultado;
}

function mismasMarcas(primero, segundo) {
  const clavesPrimero = Object.keys(primero);
  const clavesSegundo = Object.keys(segundo);

  if (clavesPrimero.length !== clavesSegundo.length) return false;

  return clavesPrimero.every((clave) => primero[clave] === segundo[clave]);
}

// El cuerpo solo incluye celdas con marca. Una celda vacía no viaja y el
// backend borra la fila correspondiente al reemplazar el mes.
function cuerpoDeMarcas(marcas) {
  return {
    marcas: Object.entries(marcas).map(([clave, valor]) => {
      const [idAlumno, fecha] = clave.split("|");
      return {
        id_alumno: Number(idAlumno),
        fecha,
        presente: valor === "P",
      };
    }),
  };
}

function SelectorPeriodo({ anio, mes, anios, alCambiarAnio, alCambiarMes, deshabilitado }) {
  return (
    <div className="planilla-periodo">
      <label className="planilla-periodo__campo">
        <span>Mes</span>
        <select
          value={mes}
          onChange={(e) => alCambiarMes(Number(e.target.value))}
          disabled={deshabilitado}
        >
          {MESES.map((nombre, indice) => (
            <option key={nombre} value={indice + 1}>
              {nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="planilla-periodo__campo">
        <span>Año</span>
        <select
          value={anio}
          onChange={(e) => alCambiarAnio(Number(e.target.value))}
          disabled={deshabilitado}
        >
          {anios.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function PlanillaAsistencias({ token, avisar, alFallarSesion }) {
  const [anio, setAnio] = useState(() => new Date().getFullYear());
  const [mes, setMes] = useState(() => new Date().getMonth() + 1);

  const [talleres, setTalleres] = useState([]);
  const [cargandoTalleres, setCargandoTalleres] = useState(true);
  const [errorTalleres, setErrorTalleres] = useState("");

  const [taller, setTaller] = useState(null);
  const [planilla, setPlanilla] = useState(null);
  const [marcas, setMarcas] = useState({});
  const [cargandoPlanilla, setCargandoPlanilla] = useState(false);
  const [errorPlanilla, setErrorPlanilla] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [hayCambios, setHayCambios] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");

  const anios = useMemo(() => {
    const actual = new Date().getFullYear();
    const lista = [];

    for (let opcion = actual + 1; opcion >= 2000; opcion -= 1) {
      lista.push(opcion);
    }

    if (!lista.includes(anio)) {
      lista.push(anio);
      lista.sort((a, b) => b - a);
    }

    return lista;
  }, [anio]);

  const manejarSesion = useCallback(
    (error) => {
      if (error instanceof ErrorDeSesion && typeof alFallarSesion === "function") {
        alFallarSesion(error);
        return true;
      }

      return false;
    },
    [alFallarSesion]
  );

  const cargarTalleres = useCallback(async () => {
    setCargandoTalleres(true);
    setErrorTalleres("");

    try {
      const filas = await pedir("talleres", { token });
      setTalleres(Array.isArray(filas) ? filas : []);
    } catch (error) {
      if (manejarSesion(error)) return;
      setErrorTalleres(error.message || "No se pudieron cargar los talleres.");
    } finally {
      setCargandoTalleres(false);
    }
  }, [token, manejarSesion]);

  const cargarPlanilla = useCallback(
    async (idTaller, anioConsulta, mesConsulta) => {
      setCargandoPlanilla(true);
      setErrorPlanilla("");
      setMensaje("");
      setErrorGuardado("");

      try {
        const datos = await pedir(
          `asistencias/planilla/${idTaller}/${anioConsulta}/${mesConsulta}`,
          { token }
        );

        setPlanilla(datos);
        setMarcas(marcasDesdePlanilla(datos));
        setHayCambios(false);
      } catch (error) {
        if (manejarSesion(error)) return;
        setPlanilla(null);
        setMarcas({});
        setHayCambios(false);
        setErrorPlanilla(error.message || "No se pudo cargar la planilla.");
      } finally {
        setCargandoPlanilla(false);
      }
    },
    [token, manejarSesion]
  );

  useEffect(() => {
    cargarTalleres();
  }, [cargarTalleres]);

  function abrirTaller(nuevoTaller) {
    setTaller(nuevoTaller);
    setPlanilla(null);
    setMarcas({});
    setHayCambios(false);
    cargarPlanilla(nuevoTaller.id_taller, anio, mes);
  }

  function volverATalleres() {
    if (
      hayCambios &&
      !window.confirm("Hay cambios sin guardar. ¿Querés volver a la selección de talleres?")
    ) {
      return;
    }

    setTaller(null);
    setPlanilla(null);
    setMarcas({});
    setHayCambios(false);
    setMensaje("");
    setErrorGuardado("");
    setErrorPlanilla("");
  }

  function cambiarPeriodo(nuevoAnio, nuevoMes) {
    if (nuevoAnio === anio && nuevoMes === mes) return;

    if (
      hayCambios &&
      !window.confirm("Hay cambios sin guardar. ¿Querés consultar otro período y descartarlos?")
    ) {
      return;
    }

    setAnio(nuevoAnio);
    setMes(nuevoMes);

    if (taller) {
      cargarPlanilla(taller.id_taller, nuevoAnio, nuevoMes);
    }
  }

  function alternarMarca(idAlumno, fecha) {
    const clave = claveMarca(idAlumno, fecha);
    const copia = { ...marcas };
    const nueva = siguienteMarca(copia[clave]);

    if (nueva) copia[clave] = nueva;
    else delete copia[clave];

    setMarcas(copia);
    setHayCambios(!mismasMarcas(copia, marcasDesdePlanilla(planilla)));
    setMensaje("");
    setErrorGuardado("");
  }

  async function guardarCambios() {
    if (!taller || guardando || !hayCambios) return;

    setGuardando(true);
    setMensaje("");
    setErrorGuardado("");

    try {
      const datos = await pedir(
        `asistencias/planilla/${taller.id_taller}/${anio}/${mes}`,
        {
          metodo: "PUT",
          cuerpo: cuerpoDeMarcas(marcas),
          token,
        }
      );

      setPlanilla(datos);
      setMarcas(marcasDesdePlanilla(datos));
      setHayCambios(false);
      setMensaje("Cambios guardados correctamente.");

      if (typeof avisar === "function") {
        avisar("Planilla guardada.", "exito");
      }
    } catch (error) {
      if (manejarSesion(error)) return;
      setErrorGuardado(error.message || "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }

  const selectorPeriodo = (
    <SelectorPeriodo
      anio={anio}
      mes={mes}
      anios={anios}
      alCambiarAnio={(nuevoAnio) => cambiarPeriodo(nuevoAnio, mes)}
      alCambiarMes={(nuevoMes) => cambiarPeriodo(anio, nuevoMes)}
      deshabilitado={guardando || cargandoPlanilla}
    />
  );

  if (!taller) {
    return (
      <section className="planilla-seleccion" aria-labelledby="planilla-seleccion-titulo">
        <div className="planilla-seleccion__encabezado">
          <h3 id="planilla-seleccion-titulo">Planillas mensuales</h3>
          <p>Elegí un taller y el período para abrir su planilla de asistencia.</p>
        </div>

        {selectorPeriodo}

        {cargandoTalleres && (
          <p className="planilla-estado" role="status">
            Cargando talleres…
          </p>
        )}

        {!cargandoTalleres && errorTalleres && (
          <div className="planilla-alerta planilla-alerta--error" role="alert">
            <p>{errorTalleres}</p>
            <button
              type="button"
              className="admin-boton admin-boton--secundario admin-boton--chico"
              onClick={cargarTalleres}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargandoTalleres && !errorTalleres && talleres.length === 0 && (
          <p className="planilla-estado">Todavía no hay talleres cargados.</p>
        )}

        {!cargandoTalleres && !errorTalleres && talleres.length > 0 && (
          <div className="planilla-talleres">
            {talleres.map((opcion) => (
              <button
                key={opcion.id_taller}
                type="button"
                className="planilla-taller"
                onClick={() => abrirTaller(opcion)}
              >
                <span className="planilla-taller__nombre">{opcion.nombre}</span>

                <span className="planilla-taller__detalle">
                  {opcion.dia ? `${opcion.dia} · ` : ""}
                  {MESES[mes - 1]} de {anio}
                </span>

                {opcion.estado === "inactivo" && (
                  <span className="planilla-taller__estado">Taller inactivo</span>
                )}

                <span className="planilla-taller__accion">Abrir planilla →</span>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  }

  const dias = planilla?.dias ?? diasDelMes(anio, mes);
  const alumnos = planilla?.alumnos ?? [];

  return (
    <section className="planilla-vista" aria-labelledby="planilla-titulo">
      <div className="planilla-barra">
        <button
          type="button"
          className="admin-boton admin-boton--secundario admin-boton--chico"
          onClick={volverATalleres}
        >
          ← Volver a talleres
        </button>

        {selectorPeriodo}
      </div>

      <header className="planilla-encabezado">
        <div>
          <p className="planilla-encabezado__etiqueta">Registro de asistencia</p>
          <h3 id="planilla-titulo">{taller.nombre}</h3>
          <p className="planilla-encabezado__periodo">
            {MESES[mes - 1]} de {anio}
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

      {cargandoPlanilla && (
        <p className="planilla-estado" role="status">
          Cargando planilla…
        </p>
      )}

      {!cargandoPlanilla && errorPlanilla && (
        <div className="planilla-alerta planilla-alerta--error" role="alert">
          <p>{errorPlanilla}</p>
          <button
            type="button"
            className="admin-boton admin-boton--secundario admin-boton--chico"
            onClick={() => cargarPlanilla(taller.id_taller, anio, mes)}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargandoPlanilla && !errorPlanilla && (
        <>
          <div className="planilla-guardado">
            <div className="planilla-guardado__mensajes">
              {mensaje && (
                <p className="planilla-alerta planilla-alerta--exito" role="status">
                  {mensaje}
                </p>
              )}

              {errorGuardado && (
                <p className="planilla-alerta planilla-alerta--error" role="alert">
                  {errorGuardado}
                </p>
              )}

              {!mensaje && !errorGuardado && hayCambios && (
                <p className="planilla-nota">Hay cambios sin guardar.</p>
              )}
            </div>

            <button
              type="button"
              className="admin-boton"
              onClick={guardarCambios}
              disabled={!hayCambios || guardando}
            >
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>

          {alumnos.length === 0 ? (
            <p className="planilla-estado">
              No hay alumnos con inscripción aceptada ni asistencias registradas en este mes.
            </p>
          ) : (
            <div className="planilla-contenedor">
              <table className="planilla-tabla">
                <caption className="admin-solo-lectores">
                  Planilla de asistencia de {taller.nombre}, {MESES[mes - 1].toLowerCase()} de{" "}
                  {anio}.
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
                  {alumnos.map((alumno) => (
                    <tr key={alumno.id_alumno}>
                      <th scope="row" className="planilla-columna-nombre">
                        {alumno.apellido}, {alumno.nombre}
                      </th>

                      {Array.from({ length: dias }, (_, indice) => indice + 1).map((dia) => {
                        const fecha = fechaDelDia(anio, mes, dia);
                        const marca = marcas[claveMarca(alumno.id_alumno, fecha)] ?? "";
                        const estado = textoEstado(marca);

                        return (
                          <td key={dia} className="planilla-celda-contenedor">
                            <button
                              type="button"
                              className={`planilla-celda${
                                marca ? ` planilla-celda--${estado}` : ""
                              }`}
                              onClick={() => alternarMarca(alumno.id_alumno, fecha)}
                              disabled={guardando}
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
          )}
        </>
      )}
    </section>
  );
}

export default PlanillaAsistencias;
