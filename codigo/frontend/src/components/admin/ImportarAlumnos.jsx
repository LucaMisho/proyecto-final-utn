import { useState } from "react";
import readXlsxFile from "read-excel-file";
import { validarEdadMinima } from "../../utils/edad"; // ajustá la ruta

const MAX_FILAS = 500;

const SCHEMA = {
  Nombre: { prop: "nombre", type: String, required: true },
  Apellido: { prop: "apellido", type: String, required: true },
  DNI: { prop: "dni", type: String, required: true },
  "Fecha de nacimiento": { prop: "fecha_nacimiento", type: Date },
  Teléfono: { prop: "telefono", type: String },
  Colegio: { prop: "colegio", type: String },
  Beca: { prop: "tiene_beca", type: (v) => String(v).trim().toLowerCase() === "sí" },
  "Estudios completos": {
    prop: "estudios_completos",
    type: (v) => String(v).trim().toLowerCase() === "sí",
  },
};

// Date de Excel -> "AAAA-MM-DD" (con campos locales para evitar el desfase de zona horaria)
function formatearFecha(fecha) {
  if (!(fecha instanceof Date)) return null;
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${m}-${d}`;
}

function ImportarAlumnos({ alConfirmar }) {
  const [validas, setValidas] = useState([]);
  const [problemas, setProblemas] = useState([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function elegir(e) {
    const archivo = e.target.files?.[0];
    setError("");
    setValidas([]);
    setProblemas([]);
    if (!archivo) return;

    try {
      const { rows, errors } = await readXlsxFile(archivo, { schema: SCHEMA });

      if (rows.length > MAX_FILAS) {
        setError(`La planilla tiene más de ${MAX_FILAS} filas.`);
        return;
      }

      const ok = [];
      const mal = errors.map((er) => ({
        fila: er.row,
        motivo: `${er.column}: ${er.error === "required" ? "campo obligatorio" : "valor inválido"}`,
      }));

      rows.forEach((r, i) => {
        const fila = i + 2; // +1 por el encabezado, +1 porque Excel cuenta desde 1
        const alumno = { ...r, fecha_nacimiento: formatearFecha(r.fecha_nacimiento) };
        const motivo = validarEdadMinima(alumno.fecha_nacimiento);

        if (motivo) mal.push({ fila, motivo });
        else ok.push(alumno);
      });

      setValidas(ok);
      setProblemas(mal.sort((a, b) => a.fila - b.fila));
    } catch {
      setError("No se pudo leer el archivo. Tiene que ser un .xlsx con los encabezados esperados.");
    }
  }

  async function confirmar() {
    setEnviando(true);
    try {
      await alConfirmar(validas);
      setValidas([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={elegir} />
      {error && <p role="alert">{error}</p>}

      {problemas.length > 0 && (
        <ul>
          {problemas.map((p, i) => (
            <li key={i}>Fila {p.fila}: {p.motivo}</li>
          ))}
        </ul>
      )}

      {validas.length > 0 && (
        <>
          <p>{validas.length} alumnos listos para importar.</p>
          {/* acá mostrás la vista previa con tu tabla */}
          <button onClick={confirmar} disabled={enviando}>
            {enviando ? "Importando..." : "Importar"}
          </button>
        </>
      )}
    </div>
  );
}

export default ImportarAlumnos;