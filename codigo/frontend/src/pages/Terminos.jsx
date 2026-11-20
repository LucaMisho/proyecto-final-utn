import "../styles/Terminos.css";

const ULTIMA_ACTUALIZACION = "18 de noviembre de 2026";

// El texto vive en este arreglo para poder editarlo sin tocar el diseño.
// Buscá "COMPLETAR" (Ctrl + Shift + F) para encontrar lo que falta definir.
const secciones = [
  {
    titulo: "Quiénes somos",
    parrafos: [
      "Este sitio está dedicado a Barrio Cultura y al programa Envión-Quequén. Los responsables del sitio y del tratamiento de los datos son los coordinadores del programa. Pertenece al Programa Envión, dependiente del Ministerio de Desarrollo de la Comunidad de la provincia de Buenos Aires, gestionada de manera articulada con la Municipalidad de Necochea.",
    ],
  },
  {
    titulo: "Aceptación de los términos",
    parrafos: [
      "Al crear una cuenta y marcar la casilla de aceptación, declarás que leíste estos términos y que estás de acuerdo con ellos. Si no estás de acuerdo, no uses el registro.",
      "Podés navegar la parte pública del sitio sin crear una cuenta.",
    ],
  },
  {
    titulo: "Cuenta y registro",
    parrafos: [
      "Para registrarte necesitás un nombre de usuario, un correo electrónico y una contraseña.",
    ],
    lista: [
      "Los datos que cargues tienen que ser verdaderos y estar actualizados.",
      "Sos responsable de mantener tu contraseña en secreto y de lo que se haga con tu cuenta.",
      "Si sospechás que alguien usa tu cuenta, avisanos por el medio de contacto de este documento.",
      "[COMPLETAR: edad mínima para registrarse y, si el programa incluye a menores de 18 años, cómo se obtiene la autorización de su madre, padre o tutor].",
    ],
  },
  {
    titulo: "Uso permitido",
    parrafos: [
      "Te comprometés a usar el sitio de forma respetuosa y legal. No está permitido:",
    ],
    lista: [
      "Hacerte pasar por otra persona.",
      "Enviar contenido ofensivo, discriminatorio o violento, o que afecte a otras personas, en especial a niñas, niños y adolescentes.",
      "Intentar entrar a cuentas ajenas o a partes del sistema que no te corresponden.",
      "Usar el sitio para publicidad, spam o fines comerciales ajenos al programa.",
    ],
  },
  {
    titulo: "Sugerencias y contenido que enviás",
    parrafos: [
      "Con tu cuenta podés enviar sugerencias al equipo del programa. Sos responsable de lo que escribís.",
      "El equipo puede leer, responder, moderar o eliminar las sugerencias, y usarlas para mejorar el programa y sus actividades. Las sugerencias no se publican en el sitio.",
    ],
  },
  {
    titulo: "Datos personales",
    parrafos: [
      "Al registrarte recopilamos tu nombre de usuario, tu correo electrónico y tu contraseña, y guardamos las sugerencias que envíes.",
      "Usamos estos datos para crear y administrar tu cuenta, permitirte iniciar sesión, recibir tus sugerencias y comunicarnos con vos sobre tu cuenta.",
      "Tu contraseña se guarda protegida, de modo que nadie del equipo puede verla. [COMPLETAR: confirmar que el backend guarda la contraseña con hash].",
      "No vendemos tus datos ni los cedemos a terceros, salvo que una ley o una orden judicial lo exija.",
      "Tenés derecho a acceder a tus datos, rectificarlos, actualizarlos y pedir que se eliminen. Para hacerlo, escribinos a [COMPLETAR: correo de contacto].",
      "La Ley 25.326 de Protección de los Datos Personales establece que podés ejercer el derecho de acceso a tus datos en forma gratuita a intervalos no inferiores a seis meses, salvo que acredites un interés legítimo. La Agencia de Acceso a la Información Pública es el órgano de control de esa ley y atiende las denuncias y los reclamos de quienes consideren afectados sus derechos.",
    ],
  },
  {
    titulo: "Seguridad",
    parrafos: [
      "Tomamos medidas razonables para proteger tus datos, pero ningún sistema es completamente seguro.",
    ],
  },
  {
    titulo: "Baja y suspensión de cuentas",
    parrafos: [
      "Podés pedir que eliminemos tu cuenta en cualquier momento escribiendo al contacto indicado en este documento.",
      "El equipo puede suspender o eliminar cuentas que incumplan estos términos.",
    ],
  },
  {
    titulo: "Disponibilidad y responsabilidad",
    parrafos: [
      "Hacemos lo posible para que el sitio funcione de forma continua, pero puede haber interrupciones por mantenimiento o por fallas. [COMPLETAR: si el sitio es un prototipo o un proyecto académico, aclararlo acá].",
      "No nos hacemos responsables por los daños que resulten del mal uso de tu cuenta o de interrupciones fuera de nuestro control.",
    ],
  },
  {
    titulo: "Cambios en estos términos",
    parrafos: [
      "Podemos actualizar estos términos. La versión vigente está siempre en esta página, con la fecha de la última actualización. Si seguís usando tu cuenta después de un cambio, entendemos que lo aceptás.",
    ],
  },
  {
    titulo: "Ley aplicable y jurisdicción",
    parrafos: [
      "Estos términos se rigen por las leyes de la República Argentina. Ante cualquier conflicto, serán competentes los tribunales de [COMPLETAR: departamento judicial o ciudad].",
    ],
  },
  {
    titulo: "Contacto",
    parrafos: [
      "Para hacer consultas, ejercer tus derechos sobre tus datos o pedir la baja de tu cuenta, escribinos a [COMPLETAR: correo de contacto].",
    ],
  },
];

function Terminos() {
  return (
    <section className="terminos-pagina">
      <article className="terminos-contenido">
        <h1>Términos y condiciones</h1>

        <p className="terminos-fecha">
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>

        {secciones.map((seccion, indice) => (
          <section key={seccion.titulo} className="terminos-seccion">
            <h2>
              {indice + 1}. {seccion.titulo}
            </h2>

            {seccion.parrafos.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}

            {seccion.lista && (
              <ul>
                {seccion.lista.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </section>
  );
}

export default Terminos;