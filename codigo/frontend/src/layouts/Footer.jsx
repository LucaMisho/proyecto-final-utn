import "../styles/Footer.css";

const instituciones = [
  {
    nombre: "Envión Quequén",
    redes: [
      {
        icono: "bi-instagram",
        etiqueta: "Instagram",
        url: "https://www.instagram.com/envionquequen/",
      },
      {
        icono: "bi-facebook",
        etiqueta: "Facebook",
        url: "https://www.facebook.com/envionquequen/",
      },
      {
        icono: "bi-whatsapp",
        etiqueta: "WhatsApp",
        url: "https://wa.me/5492262471464",
    },
    ],
  },
  {
    nombre: "Barrio Cultura",
    redes: [
      {
        icono: "bi-instagram",
        etiqueta: "Instagram",
        url: "https://www.instagram.com/barrioculturanecochea/",
      },
      {
        icono: "bi-facebook",
        etiqueta: "Facebook",
        url: "https://www.facebook.com/people/CIC-Barrio-Norte-Necochea/100067140305835/",
      },
      {
        icono: "bi-envelope-fill",
        etiqueta: "Correo",
        url: "infoculturaneco@gmail.com",
      },
    ],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">

        {/* Identidad */}
        <div className="footer-identidad">
          <h2>Envión Quequén</h2>
          <span>Barrio Cultura</span>

          <p>
            Un espacio de encuentro, participación y
            crecimiento para nuestra comunidad.
          </p>
        </div>

        {/* Navegación */}
        <div className="footer-enlaces">
          <h3>Navegación</h3>

          <a href="/">Inicio</a>
          <a href="/#quienes-somos">Quiénes somos</a>
          <a href="/#novedades">Novedades</a>
          <a href="/#noticias">Noticias</a>
          <a href="/#sugerencias">Sugerencias</a>
          <a href="/#contacto">Contacto</a>
        </div>

        {/* Redes sociales */}
        <div className="footer-redes">
          <h3>Seguinos y contactanos</h3>

          <p>
            Encontrá nuestras actividades y novedades
            en nuestras redes sociales.
          </p>

          {instituciones.map((inst) => (
            <div key={inst.nombre} className="footer-redes-grupo">
              <span className="footer-redes-titulo">{inst.nombre}</span>

              <div className="footer-redes-iconos">
                {inst.redes.map((red) => {
                  const externo = red.url.startsWith("http");

                  return (
                    <a
                      key={red.etiqueta}
                      href={red.url}
                      target={externo ? "_blank" : undefined}
                      rel={externo ? "noreferrer" : undefined}
                      aria-label={`${red.etiqueta} de ${inst.nombre}`}
                      title={`${red.etiqueta} de ${inst.nombre}`}
                    >
                      <i className={`bi ${red.icono}`}></i>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-final">
        <p>
          © {new Date().getFullYear()} Envión Quequén - Barrio Cultura.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;