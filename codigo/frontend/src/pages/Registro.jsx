import API from "../config/api";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/Registro.css";
import logo from "../assets/logo.png";

const LARGO_MINIMO_CLAVE = 8;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MENSAJE_LOGIN = "Cuenta creada. Ya podés iniciar sesión.";

function Registro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [repetirClave, setRepetirClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [mostrarTerminos, setMostrarTerminos] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Aviso tipo ventana: { tipo: "exito" | "error", titulo, texto }
  const [aviso, setAviso] = useState(null);
  const exito = aviso?.tipo === "exito";

  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Cerrar el modal con Escape y controlar el foco.
  useEffect(() => {
    if (!mostrarTerminos) return;

    modalRef.current?.focus();

    function cerrarConEscape(e) {
      if (e.key === "Escape") {
        setMostrarTerminos(false);
      }
    }

    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [mostrarTerminos]);

  // Si el registro fue exitoso, redirige al login después de unos segundos.
  useEffect(() => {
    if (!exito) return undefined;

    const t = setTimeout(() => {
      navigate("/login", { state: { mensaje: MENSAJE_LOGIN } });
    }, 3000);

    return () => clearTimeout(t);
  }, [exito, navigate]);

  function cerrarAviso() {
    if (exito) {
      navigate("/login", { state: { mensaje: MENSAJE_LOGIN } });
    } else {
      setAviso(null);
    }
  }

  function validar() {
    if (!username.trim() || !email.trim() || !clave || !repetirClave) {
      return "Completá todos los campos.";
    }

    if (username.trim().length < 3) {
      return "El nombre de usuario debe tener al menos 3 caracteres.";
    }

    if (!EMAIL_VALIDO.test(email.trim())) {
      return "Ingresá un correo electrónico válido.";
    }

    if (clave.length < LARGO_MINIMO_CLAVE) {
      return `La contraseña debe tener al menos ${LARGO_MINIMO_CLAVE} caracteres.`;
    }

    if (clave !== repetirClave) {
      return "Las contraseñas no coinciden.";
    }

    if (!terminos) {
      return "Tenés que aceptar los términos y condiciones para crear la cuenta.";
    }

    return "";
  }

  async function manejarRegistro(e) {
    e.preventDefault();
    setError("");

    const mensajeError = validar();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(`${API}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          contrasena: clave,
        }),
      });

      const texto = await respuesta.text();
      let datos = {};

      try {
        datos = texto ? JSON.parse(texto) : {};
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || datos.error || "No se pudo crear la cuenta."
        );
      }

      setAviso({
        tipo: "exito",
        titulo: "¡Registro exitoso!",
        texto:
          "Tu cuenta fue creada correctamente. Te llevamos al inicio de sesión…",
      });
    } catch (error) {
      setAviso({
        tipo: "error",
        titulo: "Error",
        texto: error.message || "No se pudo conectar con el servidor.",
      });
      setCargando(false);
    }
  }

  return (
    <main className="login-pagina registro-pagina">
      <section className="login-layout registro-layout">

        {/* PANEL IZQUIERDO */}
        <aside className="login-visual registro-visual">
          <Link to="/" className="login-volver">
            ← Volver al inicio
          </Link>

          <div className="login-visual-contenido">
            <img src={logo} alt="Logo Barrio Cultura" />

            <span className="login-visual-linea"></span>

            <h2>¡Sumate a Barrio Cultura!</h2>

            <p>
              Formá parte de una comunidad que conecta personas,
              barrios y oportunidades para crecer juntos.
            </p>
          </div>

          <span className="login-visual-pie">
            Barrio Cultura · Envión Quequén
          </span>
        </aside>

        {/* PANEL DERECHO */}
        <div className="login-contenedor registro-contenedor">
          <div className="registro-contenido">

            <div className="login-encabezado">
              <img src={logo} alt="Logo Barrio Cultura" />

              <h1>Crear cuenta</h1>

              <p>Completá tus datos para registrarte.</p>
            </div>

            <form
              className="login-formulario registro-formulario"
              onSubmit={manejarRegistro}
            >
              <div className="login-campo">
                <label htmlFor="username">Nombre de usuario</label>

                <input
                  id="username"
                  type="text"
                  placeholder="Elegí un nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={cargando}
                />
              </div>

              <div className="login-campo">
                <label htmlFor="email">Correo electrónico</label>

                <input
                  id="email"
                  type="email"
                  placeholder="nombre@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={cargando}
                />
              </div>

              <div className="login-campo">
                <label htmlFor="clave">Contraseña</label>

                <div className="login-campo-password">
                  <input
                    id="clave"
                    type={verClave ? "text" : "password"}
                    placeholder={`Mínimo ${LARGO_MINIMO_CLAVE} caracteres`}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    autoComplete="new-password"
                    disabled={cargando}
                  />

                  <button
                    type="button"
                    className="login-ver"
                    onClick={() => setVerClave(!verClave)}
                    aria-label={
                      verClave ? "Ocultar contraseñas" : "Mostrar contraseñas"
                    }
                  >
                    <span
                      className={`login-icono ${
                        verClave
                          ? "login-icono-ojo-tachado"
                          : "login-icono-ojo"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <div className="login-campo">
                <label htmlFor="repetirClave">Repetir contraseña</label>

                <input
                  id="repetirClave"
                  type={verClave ? "text" : "password"}
                  placeholder="Escribila de nuevo"
                  value={repetirClave}
                  onChange={(e) => setRepetirClave(e.target.value)}
                  autoComplete="new-password"
                  disabled={cargando}
                />
              </div>

              {/* TÉRMINOS Y CONDICIONES */}
              <div className="login-terminos">
                <input
                  id="terminos"
                  type="checkbox"
                  checked={terminos}
                  onChange={(e) => setTerminos(e.target.checked)}
                  disabled={cargando}
                />

                <label htmlFor="terminos">
                  Acepto los{" "}
                  <button
                    type="button"
                    className="registro-link-terminos"
                    onClick={() => setMostrarTerminos(true)}
                  >
                    términos y condiciones
                  </button>
                </label>
              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" disabled={cargando}>
                {cargando && !exito && (
                  <span className="login-spinner" aria-hidden="true" />
                )}

                {exito
                  ? "Cuenta creada"
                  : cargando
                    ? "Creando cuenta..."
                    : "Crear cuenta"}
              </button>
            </form>

            <p className="login-pie">
              ¿Ya tenés una cuenta?{" "}
              <Link to="/login">Iniciá sesión</Link>
            </p>

          </div>
        </div>
      </section>

      {/* AVISO TIPO VENTANA (ÉXITO / ERROR) */}
      {aviso && (
        <div
          className="registro-aviso-overlay"
          role="alertdialog"
          aria-live="assertive"
          aria-labelledby="registro-aviso-titulo"
        >
          <div
            className={`registro-aviso ${
              aviso.tipo === "error" ? "registro-aviso--error" : ""
            }`}
          >
            <div className="registro-aviso-barra">
              <div className="registro-aviso-botones">
                <span
                  className="registro-aviso-boton registro-aviso-min"
                  aria-hidden="true"
                />
                <span
                  className="registro-aviso-boton registro-aviso-max"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="registro-aviso-boton registro-aviso-cerrar"
                  onClick={cerrarAviso}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="registro-aviso-cuerpo">
              <span className="registro-aviso-icono" aria-hidden="true" />

              <h2 id="registro-aviso-titulo">{aviso.titulo}</h2>

              <p>{aviso.texto}</p>

              <button
                type="button"
                className="registro-aviso-accion"
                onClick={cerrarAviso}
              >
                {exito ? "Iniciar sesión ahora" : "Entendido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VENTANA EMERGENTE DE TÉRMINOS */}
      {mostrarTerminos && (
        <div
          className="terminos-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setMostrarTerminos(false);
            }
          }}
        >
          <section
            className="terminos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terminos-titulo"
            tabIndex={-1}
            ref={modalRef}
          >
            <div className="terminos-modal-encabezado">
              <div>
                <span className="terminos-etiqueta">
                  BARRIO CULTURA Y ENVIÓN-QUEQUÉN
                </span>

                <h2 id="terminos-titulo">Términos y condiciones</h2>
              </div>

              <button
                type="button"
                className="terminos-cerrar"
                onClick={() => setMostrarTerminos(false)}
                aria-label="Cerrar términos y condiciones"
              >
                ×
              </button>
            </div>

            <div className="terminos-modal-contenido">
              <p className="terminos-version">
                Versión 1.0 · Vigencia: 23/11/2026
              </p>

              <p>
                Antes de crear tu cuenta, es importante que conozcas las
                condiciones de uso de este sitio y cómo tratamos tus datos
                personales.
              </p>

              <h3>1. Quiénes somos</h3>
              <p>
                Este sitio pertenece al programa Envión Quequén y Barrio
                Cultura (Necochea). Los responsables del sitio y del
                tratamiento de los datos personales son los coordinadores del
                programa: Jacqueline Franqui y Gastón Cabello, con domicilio
                en calle 545 esquina 554, Quequén, y contacto en
                envionnecochea@yahoo.com.ar
              </p>

              <h3>2. Para qué sirve el sitio</h3>
              <p>
                El sitio informa sobre los talleres, actividades, novedades y
                noticias del programa. Permite que las personas registradas
                envíen sugerencias y gestionen su perfil, y que el personal
                autorizado administre los contenidos y los registros del
                programa.
              </p>
              <p>
                Usar el sitio no implica inscribirse en un taller, obtener
                una vacante ni recibir ningún beneficio. Las inscripciones las
                carga el personal del programa.
              </p>

              <h3>3. Tu cuenta</h3>
              <p>
                Podés navegar el sitio sin cuenta. Para enviar sugerencias
                necesitás registrarte con un nombre de usuario, un correo
                electrónico y una contraseña.
              </p>
              <ul>
                <li>
                  La cuenta es personal. No compartas tus credenciales ni
                  dejes la sesión abierta en dispositivos compartidos.
                </li>
                <li>
                  Tu contraseña se guarda cifrada y nadie del programa puede
                  verla.
                </li>
                <li>
                  Si perdés el acceso o sospechás que alguien usó tu cuenta,
                  escribinos a envionbarriocultura@gmail.com.
                </li>
                <li>
                  Tu cuenta no te da acceso a datos de otras personas ni
                  puede darte permisos de administración. Esos permisos los
                  asigna el programa por un procedimiento interno.
                </li>
              </ul>

              <h3>4. Uso correcto del sitio</h3>
              <p>Te pedimos que:</p>
              <ul>
                <li>Proporciones datos verdaderos al registrarte.</li>
                <li>
                  Escribas las sugerencias con respeto, sin ofensas,
                  discriminación ni contenido ilegal.
                </li>
                <li>
                  No incluyas datos personales de terceros, y menos de niñas,
                  niños o adolescentes.
                </li>
                <li>
                  No intentes acceder a información o funciones que no te
                  corresponden, ni dañar o sobrecargar el sitio.
                </li>
              </ul>
              <p>
                Si se detecta un uso indebido, el programa puede limitar o
                suspender la cuenta de forma proporcionada. Se te informará
                el motivo y podrás pedir que se revise la decisión.
              </p>

              <h3>5. Personal autorizado</h3>
              <p>
                El personal ingresa solo con su propia cuenta y dentro de los
                permisos de su rol. Debe:
              </p>
              <ul>
                <li>
                  Consultar o modificar datos solamente cuando sea necesario
                  para sus tareas.
                </li>
                <li>
                  Mantener la confidencialidad, también después de dejar de
                  colaborar con el programa.
                </li>
                <li>
                  No compartir usuarios, contraseñas, listados ni capturas
                  por canales no autorizados, ni usar los datos para fines
                  personales.
                </li>
                <li>
                  Avisar de inmediato a envionnecochea@yahoo.com.ar ante
                  cualquier acceso indebido, error o pérdida de información.
                </li>
              </ul>
              <p>
                El programa dará de baja los permisos cuando cambie la
                función de la persona o termine su colaboración.
              </p>

              <h3>6. Datos personales que tratamos</h3>
              <p>
                <strong>Qué datos.</strong> Nombre de usuario, correo
                electrónico y contraseña (cifrada), y el contenido y la fecha
                de tus sugerencias. El personal, además, carga datos de los
                participantes de los talleres (por ejemplo, inscripciones,
                asistencias y seguimientos), que solo ve quien tiene permiso
                para hacerlo.
              </p>
              <p>
                <strong>Para qué.</strong> Para crear y mantener tu cuenta,
                recibir y responder tus sugerencias, y organizar las
                actividades del programa. No los usamos para publicidad ni
                para fines distintos de estos.
              </p>
              <p>
                <strong>Quién puede verlos.</strong> El personal autorizado,
                según su rol. No vendemos ni cedemos tus datos a terceros.
              </p>
              <p>
                <strong>Servicios técnicos que usamos.</strong> El sitio
                funciona con proveedores que alojan la aplicación, la base de
                datos y las imágenes: Vercel, Render, Neon y Cloudinary.
                Procesan la información por cuenta del programa, y algunos
                pueden tener servidores fuera de Argentina.
              </p>
              <p>
                <strong>Datos sensibles.</strong> El sitio no solicita datos
                de salud ni otros datos sensibles, y nadie está obligado a
                darlos. Si en el futuro hiciera falta tratarlos, se informará
                por separado y se pedirá la autorización que corresponda.
              </p>

              <h3>7. Niñas, niños y adolescentes</h3>
              <p>
                El programa trabaja con menores, por eso el sitio los protege
                especialmente: respeta su interés superior, su privacidad y
                su dignidad.
              </p>
              <ul>
                <li>
                  Los registros de participantes solo los carga y consulta el
                  personal autorizado.
                </li>
                <li>
                  No publicamos fotos, videos ni voces identificables de
                  niñas, niños o adolescentes sin una autorización específica
                  de quien ejerce la responsabilidad parental. Esa
                  autorización es independiente de estos términos, y
                  participar en el programa no depende de darla.
                </li>
                <li>
                  Si una persona menor de edad se registra, le recomendamos
                  hacerlo con el acompañamiento de una persona adulta
                  responsable.
                </li>
              </ul>

              <h3>8. Seguridad</h3>
              <p>
                Aplicamos medidas razonables para proteger la información:
                contraseñas cifradas, acceso por roles, sesiones con token y
                conexión segura. Ningún sistema es infalible. Si ocurre un
                incidente, el programa lo documentará, tomará medidas para
                reducir sus efectos y avisará a las personas afectadas y a
                las autoridades cuando corresponda.
              </p>

              <h3>9. Tus derechos</h3>
              <p>
                Podés pedir acceso, rectificación, actualización y supresión
                de tus datos escribiendo a envionnecochea@yahoo.com.ar. Para
                protegerte, vamos a verificar tu identidad antes de
                responder. Si no recibís una respuesta adecuada, podés
                reclamar ante la Agencia de Acceso a la Información Pública,
                autoridad de control de la Ley 25.326, o recurrir a las vías
                judiciales que correspondan.
              </p>

              <h3>10. Cuánto tiempo guardamos los datos</h3>
              <p>
                Guardamos los datos de tu cuenta mientras la mantengas
                activa. Si pedís eliminarla, borraremos tus datos, salvo los
                que debamos conservar por una obligación legal. Los registros
                del programa se conservan en un plazo de 30 días.
              </p>

              <h3>11. Disponibilidad del sitio</h3>
              <p>
                Hacemos lo posible por mantener el sitio disponible, pero
                puede interrumpirse por mantenimiento, fallas técnicas o
                motivos de seguridad. Si pasa, podés contactarnos por
                envionnecochea@yahoo.com.ar.
              </p>

              <h3>12. Cambios y contacto</h3>
              <p>
                Si modificamos estos términos, publicaremos la nueva versión
                en el sitio con su fecha de vigencia. Si el cambio afecta el
                tratamiento de tus datos, te lo vamos a informar antes de
                aplicarlo.
              </p>
              <p>
                Consultas generales y de privacidad:
                envionnecochea@yahoo.com.ar.
              </p>
            </div>

            <div className="terminos-modal-pie">
              <button
                type="button"
                className="terminos-btn-cerrar"
                onClick={() => setMostrarTerminos(false)}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Registro;