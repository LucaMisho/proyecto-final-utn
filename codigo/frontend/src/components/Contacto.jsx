import "../styles/Contacto.css";

function Contacto() {
  return (
    <section className="contacto" id="contacto">

      <div className="contacto-encabezado">
        <span className="contacto-etiqueta">
          VENÍ A CONOCERNOS
        </span>

        <h2>¿Dónde encontrarnos?</h2>

        <p>
          Conocé dónde estamos y acercate a compartir
          nuestras actividades y propuestas.
        </p>
      </div>

      <div className="contacto-ubicaciones">

        <article className="contacto-ubicacion">
          <h3>Envión Quequén</h3>

          <div className="contacto-mapa">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3120.5820796403314!2d-58.71804040025357!3d-38.54340082530543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x958f97c7e7afa61b%3A0x5bde39c6f1c96f60!2sC.%20574%20%26%20C.%20545%2C%20B7631%20Quequ%C3%A9n%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1794816379829!5m2!1ses-419!2sar"
              title="Ubicación de Envión Quequén"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </article>

        <article className="contacto-ubicacion">
          <h3>Barrio Cultura</h3>

          <div className="contacto-mapa">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3120.623506310575!2d-58.75162152517258!3d-38.54244607180188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x958fbd9d4919f24d%3A0xdf65d6585705688a!2sC.%2053%20%26%20C.%2084%2C%20B7630%20Necochea%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1794815969521!5m2!1ses-419!2sar">
              title="Ubicación de Barrio Cultura"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            </iframe>
          </div>
        </article>

      </div>
    </section>
  );
}

export default Contacto;

