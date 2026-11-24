import { useEffect, useState } from "react";
import Dialogo from "./Dialogo";
import { ETIQUETAS, RECURSOS } from "./configuracion";
import CampoEnriquecido from "./CampoEnriquecido";

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

function CampoArchivo({ id, archivo, actual, descripcionId, alElegir, alRechazar }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!archivo) {
      setUrl("");
      return undefined;
    }
    const nueva = URL.createObjectURL(archivo);
    setUrl(nueva);
    return () => URL.revokeObjectURL(nueva);
  }, [archivo]);

  function elegir(e) {
    const elegido = e.target.files?.[0];

    if (!elegido) {
      alElegir("");
      return;
    }
    if (!TIPOS_IMAGEN.includes(elegido.type)) {
      alRechazar("La imagen tiene que ser JPG, PNG o WebP.");
      e.target.value = "";
      return;
    }
    if (elegido.size > MAX_MB * 1024 * 1024) {
      alRechazar(`La imagen pesa más de ${MAX_MB} MB.`);
      e.target.value = "";
      return;
    }
    alElegir(elegido);
  }

  const mostrada = url || actual;

  return (
    <>
      {mostrada && (
        <img src={mostrada} alt="Vista previa de la imagen" className="admin-vista-previa" />
      )}
      <input
        id={id}
        type="file"
        accept={TIPOS_IMAGEN.join(",")}
        aria-describedby={descripcionId}
        onChange={elegir}
      />
    </>
  );
}

function valorInicial(campo, fila, iniciales) {
  if (campo.limpiarHtml) return limpiarTexto(String(v));
  if (campo.tipo === "archivo") return "";

  if (!fila) return iniciales?.[campo.clave] ?? campo.inicial ?? (campo.tipo === "casilla" ? false : "");

  const v = fila[campo.clave];

  if (campo.tipo === "clave") return "";
  if (campo.tipo === "casilla") return Boolean(v);
  if (v === null || v === undefined) return "";
  if (campo.tipo === "hora") return String(v).slice(0, 5);
  if (campo.tipo === "fecha") return String(v).slice(0, 10);
  return String(v);
}

function FormularioAdmin({ recurso, fila, datos, iniciales, alGuardar, alCerrar }) {
  const editando = Boolean(fila);

  const [valores, setValores] = useState(() =>
    Object.fromEntries(recurso.campos.map((c) => [c.clave, valorInicial(c, fila, iniciales)]))
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [avisoConfirmado, setAvisoConfirmado] = useState("");

  const idBase = `campo-${recurso.clave}`;

  function cambiar(clave, valor) {
    setValores((v) => {
      const nuevos = { ...v, [clave]: valor };

      recurso.campos.forEach((c) => {
        if (c.soloInscriptosDe === clave && !alumnosInscriptos(c, nuevos).some((a) => String(a.id_alumno) === String(nuevos[c.clave]))) {
          nuevos[c.clave] = "";
        }
      });

      return nuevos;
    });
    setAvisoConfirmado("");
  }

  function alumnosInscriptos(campo, actuales) {
    const idTaller = actuales[campo.soloInscriptosDe];
    if (!idTaller) return [];

    const inscriptos = new Set(
      (datos.inscripciones?.filas ?? [])
        .filter((i) => String(i.id_taller) === String(idTaller) && i.estado === "aceptada")
        .map((i) => String(i.id_alumno))
    );

    return (datos.alumnos?.filas ?? []).filter((a) => inscriptos.has(String(a.id_alumno)));
  }

  function faltantes() {
    return recurso.campos.filter((c) => {
      const obligatorio = c.requerido || (c.requeridoAlCrear && !editando);
      if (!obligatorio) return false;
      const v = valores[c.clave];
      return typeof v === "string" ? v.trim() === "" : false;
    });
  }

  function armarCuerpo() {
    const cuerpo = {};

    recurso.campos.forEach((c) => {
      if (c.tipo === "archivo") return;
      const v = valores[c.clave];

      if (c.tipo === "casilla") cuerpo[c.clave] = Boolean(v);
      else if (c.tipo === "numero") cuerpo[c.clave] = v === "" ? null : Number(v);
      else if (c.tipo === "relacion") cuerpo[c.clave] = v === "" ? null : Number(v);
      else if (c.tipo === "clave") {
        if (v !== "") cuerpo.contrasena = v;
      } else {
        const texto = String(v).trim();
        cuerpo[c.clave] = texto === "" ? null : texto;
      }
    });

    (recurso.conservar || []).forEach((clave) => {
      cuerpo[clave] = fila[clave];
    });

    const final = recurso.alGuardar ? recurso.alGuardar(cuerpo, fila) : cuerpo;

    // Sin archivo nuevo se envía JSON como siempre; con archivo, FormData
    const archivos = recurso.campos.filter(
      (c) => c.tipo === "archivo" && valores[c.clave] instanceof File
    );
    if (archivos.length === 0) return final;

    const formData = new FormData();
    Object.entries(final).forEach(([clave, valor]) => {
      if (valor !== null && valor !== undefined) formData.append(clave, valor);
    });
    archivos.forEach((c) => formData.append(c.clave, valores[c.clave]));
    return formData;
  }

  async function enviar(e) {
    e.preventDefault();
    if (guardando) return;

    const sinCompletar = faltantes();
    if (sinCompletar.length > 0) {
      setError(
        `Completá los campos obligatorios: ${sinCompletar
          .map((c) => c.etiqueta)
          .join(", ")}.`
      );
      document.getElementById(`${idBase}-${sinCompletar[0].clave}`)?.focus();
      return;
    }

    const menorAlMinimo = recurso.campos.find(
      (c) =>
        c.minimo !== undefined &&
        valores[c.clave] !== "" &&
        Number(valores[c.clave]) < c.minimo
    );
    if (menorAlMinimo) {
      setError(`${menorAlMinimo.etiqueta} tiene que ser ${menorAlMinimo.minimo} o más.`);
      document.getElementById(`${idBase}-${menorAlMinimo.clave}`)?.focus();
      return;
    }

    const aviso = recurso.avisoAntesDeGuardar?.(valores, datos);
    if (aviso && aviso !== avisoConfirmado) {
      setError(aviso);
      setAvisoConfirmado(aviso);
      return;
    }

    setError("");
    setGuardando(true);

    try {
      await alGuardar(armarCuerpo());
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  function renderCampo(c) {
    const id = `${idBase}-${c.clave}`;
    const valor = valores[c.clave];
    const obligatorio = c.requerido || (c.requeridoAlCrear && !editando);
    const comunes = {
      id,
      required: obligatorio,
      "aria-required": obligatorio || undefined,
      "aria-describedby": c.ayuda ? `${id}-ayuda` : undefined,
    };

    if (c.tipo === "casilla") {
      return (
        <label className="admin-casilla" key={c.clave}>
          <input
            type="checkbox"
            id={id}
            checked={valor}
            onChange={(e) => cambiar(c.clave, e.target.checked)}
          />
          {c.etiqueta}
        </label>
      );
    }

    let control;

    if (c.tipo === "enriquecido") {
      control = (
       <CampoEnriquecido id={id} valor={valor} alCambiar={(html) => cambiar(c.clave, html)} />
        
       );
      } else if (c.tipo === "opciones") {
      control = (
        <select {...comunes} value={valor} onChange={(e) => cambiar(c.clave, e.target.value)}>
          {c.opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    } else if (c.tipo === "relacion") {
      const claveId = RECURSOS.find((x) => x.clave === c.relacion).id;
      const resto = c.soloInscriptosDe ? alumnosInscriptos(c, valores) : datos[c.relacion]?.filas || [];
      const sinTaller = c.soloInscriptosDe && !valores[c.soloInscriptosDe];
      control = (
        <select {...comunes} value={valor} onChange={(e) => cambiar(c.clave, e.target.value)}>
          <option value="">
            {sinTaller
              ? "Elegí primero el taller"
              : c.soloInscriptosDe && resto.length === 0
                ? "Este taller no tiene alumnos inscriptos"
                : "Elegí una opción"}
          </option>
          {resto.map((r) => (
            <option key={r[claveId]} value={r[claveId]}>
              {ETIQUETAS[c.relacion](r)}
            </option>
          ))}
        </select>
      );
    } else if (c.tipo === "archivo") {
      control = (
        <CampoArchivo
          id={id}
          archivo={valor}
          actual={fila?.[c.clave] || ""}
          descripcionId={c.ayuda ? `${id}-ayuda` : undefined}
          alElegir={(archivo) => {
            setError("");
            cambiar(c.clave, archivo);
          }}
          alRechazar={setError}
        />
      );
    } else {
      const tipoInput = {
        texto: "text",
        email: "email",
        clave: "password",
        numero: "number",
        fecha: "date",
        hora: "time",
      }[c.tipo];

      control = (
        <input
          {...comunes}
          type={tipoInput}
          value={valor}
          min={c.minimo}
          autoComplete={c.tipo === "clave" ? "new-password" : "off"}
          onChange={(e) => cambiar(c.clave, e.target.value)}
        />
      );
    }

    return (
      <div className="admin-campo" key={c.clave}>
        <label htmlFor={id}>
          {c.etiqueta}
          {obligatorio && <span aria-hidden="true"> *</span>}
        </label>
        {control}
        {c.ayuda && (
          <small id={`${id}-ayuda`} className="admin-ayuda">
            {c.ayuda}
          </small>
        )}
      </div>
    );
  }

  return (
    <Dialogo
      id={`${idBase}-dialogo`}
      titulo={editando ? `Editar ${recurso.singular}` : `Agregar ${recurso.singular}`}
      alCerrar={alCerrar}
    >
      <form onSubmit={enviar} noValidate>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        {recurso.campos.map(renderCampo)}

        <div className="admin-botones">
          <button type="button" className="admin-boton admin-boton--secundario" onClick={alCerrar}>
            Cancelar
          </button>
          <button type="submit" className="admin-boton" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}

export default FormularioAdmin;