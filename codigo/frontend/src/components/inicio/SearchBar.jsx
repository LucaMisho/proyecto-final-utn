import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/SearchBar.css";

const API = import.meta.env.VITE_API_URL;

const SECCIONES = [
  { clave: "novedades", etiqueta: "Novedad", id: "id_novedad", campo: "titulo", ruta: "/novedades" },
  { clave: "noticias", etiqueta: "Noticia", id: "id_noticia", campo: "titulo", ruta: "/noticias" },
  { clave: "talleres", etiqueta: "Taller", id: "id_taller", campo: "nombre", ruta: "/talleres" },
  { clave: "actividades", etiqueta: "Actividad", id: "id_actividad", campo: "nombre", ruta: "/actividades" },
  { clave: "barrios", etiqueta: "Barrio", id: "id_barrio", campo: "nombre", ruta: "/barrios" },
];

function SearchBar() {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const consulta = texto.trim();
    if (!consulta) {
      setSugerencias([]);
      setCargando(false);
      return;
    }

    const controlador = new AbortController();
    const espera = setTimeout(() => {
      setCargando(true);
      fetch(`${API}/buscador?q=${encodeURIComponent(consulta)}`, {
        signal: controlador.signal,
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((datos) => {
          const lista = SECCIONES.flatMap((s) =>
            (datos[s.clave] || []).map((item) => ({
              key: `${s.clave}-${item[s.id]}`,
              etiqueta: s.etiqueta,
              titulo: item[s.campo],
              ruta: s.ruta,
            }))
          );
          setSugerencias(lista.slice(0, 6));
          setCargando(false);
        })
        .catch((e) => {
          if (e.name !== "AbortError") {
            setSugerencias([]);
            setCargando(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(espera);
      controlador.abort();
    };
  }, [texto]);

  function manejarLupa(e) {
    if (!abierto) {
      e.preventDefault();
      setAbierto(true);
      inputRef.current?.focus();
    }
  }

  function manejarEnvio(e) {
    e.preventDefault();
    const consulta = texto.trim();
    if (!consulta) return;
    setMostrar(false);
    navigate(`/buscar?q=${encodeURIComponent(consulta)}`);
  }

  function manejarBlur(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setMostrar(false);
    if (!texto.trim()) setAbierto(false);
  }

  function manejarTecla(e) {
    if (e.key === "Escape") {
      setTexto("");
      setMostrar(false);
      setAbierto(false);
    }
  }

  const hayLista = abierto && mostrar && texto.trim() !== "";

  return (
    <div
      className={`busqueda ${abierto ? "busqueda--abierta" : ""}`}
      onBlur={manejarBlur}
    >
      <form className="busqueda-form" onSubmit={manejarEnvio} role="search">
        <button
          type="submit"
          aria-label="Buscar"
          aria-expanded={abierto}
          onClick={manejarLupa}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="search"
          name="q"
          placeholder="Buscar..."
          aria-label="Buscar en Barrio Cultura"
          autoComplete="off"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setMostrar(true);
          }}
          onFocus={() => setMostrar(true)}
          onKeyDown={manejarTecla}
          tabIndex={abierto ? 0 : -1}
        />
      </form>

      {hayLista && (
        <ul className="busqueda-sugerencias" aria-live="polite">
          {cargando && sugerencias.length === 0 && (
            <li className="busqueda-estado">BuscandoÔÇª</li>
          )}
          {!cargando && sugerencias.length === 0 && (
            <li className="busqueda-estado">Sin resultados</li>
          )}
          {sugerencias.map((s) => (
            <li key={s.key}>
              <Link to={s.ruta} onClick={() => setMostrar(false)}>
                <span className="busqueda-tipo">{s.etiqueta}</span>
                {s.titulo}
              </Link>
            </li>
          ))}
          {sugerencias.length > 0 && (
            <li>
              <Link
                to={`/buscar?q=${encodeURIComponent(texto.trim())}`}
                className="busqueda-todo"
                onClick={() => setMostrar(false)}
              >
                Ver todos los resultados ÔåÆ
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
