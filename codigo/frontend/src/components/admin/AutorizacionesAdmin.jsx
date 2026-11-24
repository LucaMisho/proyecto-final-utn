import { useEffect, useState } from "react";

const DOCUMENTOS = [
  {
    id: "datos",
    titulo: "Autorización para el tratamiento de datos personales",
    descripcion:
      "Autoriza el tratamiento de los datos necesarios para la inscripción, participación y acompañamiento del niño o niña.",
  },
  {
    id: "imagenes",
    titulo: "Autorización para el uso y publicación de imágenes",
    descripcion:
      "Permite dejar constancia de si la familia autoriza o no la publicación de fotografías y videos.",
  },
];

function DatosResponsable() {
  return (
    <>
      <p>
        Yo, ______________________________________________________________,
      </p>
      <p>
        DNI Nº ____________________, en carácter de:
      </p>
      <p>
        ☐ Madre &nbsp;&nbsp; ☐ Padre &nbsp;&nbsp; ☐ Tutor/a &nbsp;&nbsp;
        ☐ Representante legal
      </p>
      <p>
        del niño/a ________________________________________________________,
      </p>
      <p>
        DNI Nº ____________________, declaro lo siguiente:
      </p>
    </>
  );
}

function DocumentoDatos() {
  return (
    <article className="autorizacion-documento">
      <h1>AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</h1>

      <DatosResponsable />

      <p>
        Declaro haber recibido información clara y autorizo a
        ______________________________________________ a recolectar y tratar
        los datos personales estrictamente necesarios para la inscripción,
        participación y acompañamiento del niño/a en Barrio Cultura, y para
        articular su continuidad en Envión cuando corresponda.
      </p>

      <p>
        Estos datos podrán incluir nombre, DNI —con copia únicamente si
        resulta indispensable—, domicilio, escolaridad y situación de becas
        o beneficios.
      </p>

      <p>
        La información de salud solo se solicitará si resulta necesaria,
        su tratamiento está legalmente habilitado y se limita a lo
        indispensable para cuidar la participación del niño/a.
      </p>

      <p>
        Autorizo la carga de los datos necesarios en
        ______________________________________________. El acceso o la
        comunicación a ______________________________________________ se
        limitará a lo necesario para esa finalidad.
      </p>

      <p>
        Se me informará quién es responsable del tratamiento de los datos,
        durante cuánto tiempo se conservarán y cómo solicitar el acceso,
        rectificación o supresión de la información, o revocar esta
        autorización, mediante el siguiente contacto:
        ______________________________________________.
      </p>

      <p>
        El niño/a recibirá una explicación adecuada a su edad y se tendrá
        en cuenta su opinión.
      </p>

      <p>
        Esta autorización no incluye la publicación o difusión de imágenes,
        que deberá autorizarse por separado.
      </p>

      <div className="autorizacion-firmas">
        <p>Localidad y fecha: __________________________________________</p>
        <p>Firma: _____________________________________________________</p>
        <p>Aclaración: ________________________________________________</p>
        <p>DNI: _______________________________________________________</p>
      </div>
    </article>
  );
}

function DocumentoImagenes() {
  return (
    <article className="autorizacion-documento">
      <h1>AUTORIZACIÓN PARA EL USO Y PUBLICACIÓN DE IMÁGENES</h1>

      <DatosResponsable />

      <p>
        Declaro haber sido informado/a de que, durante las actividades,
        talleres y propuestas de Barrio Cultura, podrán tomarse fotografías
        y/o videos en los que aparezca el niño/a.
      </p>

      <p>
        La autorización se refiere exclusivamente a la publicación de
        imágenes en las redes sociales oficiales de Barrio Cultura y/o del
        organismo responsable, con fines institucionales, informativos y
        de difusión de las actividades.
      </p>

      <p>
        Las imágenes no podrán utilizarse con fines comerciales ni
        difundirse de manera que afecten la dignidad, intimidad o seguridad
        del niño/a.
      </p>

      <p><strong>Marque una sola opción:</strong></p>

      <p>☐ AUTORIZO la toma y publicación de imágenes.</p>
      <p>☐ NO AUTORIZO la toma y publicación de imágenes.</p>

      <p>
        Esta decisión es voluntaria y no condiciona la participación del
        niño/a en las actividades. Podré revocar esta autorización
        comunicándome con ______________________________________________.
      </p>

      <p>
        Se tendrá en cuenta la opinión del niño/a de acuerdo con su edad
        y grado de madurez.
      </p>

      <div className="autorizacion-firmas">
        <p>Localidad y fecha: __________________________________________</p>
        <p>Firma: _____________________________________________________</p>
        <p>Aclaración: ________________________________________________</p>
        <p>DNI: _______________________________________________________</p>
      </div>
    </article>
  );
}

function AutorizacionesAdmin() {
  const [documentoImprimir, setDocumentoImprimir] = useState(null);

  useEffect(() => {
    if (!documentoImprimir) return;

    const imprimir = setTimeout(() => {
      window.print();
    }, 200);

    const finalizar = () => setDocumentoImprimir(null);

    window.addEventListener("afterprint", finalizar);

    return () => {
      clearTimeout(imprimir);
      window.removeEventListener("afterprint", finalizar);
    };
  }, [documentoImprimir]);

  const componentes = {
    datos: <DocumentoDatos />,
    imagenes: <DocumentoImagenes />,
  };

  return (
    <section className="autorizaciones-admin">
      {!documentoImprimir ? (
        <>
          <p>
            Desde esta sección podés consultar e imprimir las autorizaciones
            para entregar a las familias. Los formularios se completan a mano.
          </p>

          <div className="autorizaciones-lista">
            {DOCUMENTOS.map((documento) => (
              <article
                key={documento.id}
                className="autorizacion-tarjeta"
              >
                <h3>{documento.titulo}</h3>
                <p>{documento.descripcion}</p>

                <button
                  type="button"
                  onClick={() => setDocumentoImprimir(documento.id)}
                >
                  Imprimir / Guardar como PDF
                </button>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="autorizacion-para-imprimir">
          {componentes[documentoImprimir]}
        </div>
      )}
    </section>
  );
}

export default AutorizacionesAdmin;