//const { Resend } = require("resend");

async function enviarVerificacion(destino, token) {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("Falta configurar RESEND_API_KEY");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const backendUrl = process.env.BACKEND_URL.replace(/\/+$/, "");

    const enlace = `${backendUrl}/api/auth/verificar?token=${encodeURIComponent(token)}`;

    const { data, error } = await resend.emails.send({
        from: process.env.CORREO_REMITENTE,
        to: [destino],
        subject: "Confirmá tu correo - Barrio Cultura",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>¡Bienvenido a Barrio Cultura!</h2>
                <p>Gracias por registrarte.</p>
                <p>Para confirmar tu dirección de correo electrónico, hacé clic en el siguiente enlace:</p>
                <p>
                    <a href="${enlace}"
                       style="background-color: #7137a8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
                        Confirmar mi correo
                    </a>
                </p>
                <p>Este enlace vence en 24 horas.</p>
            </div>
        `,
        text: `Confirmá tu correo ingresando en: ${enlace}`
    });

    if (error) {
        console.error("Error de Resend:", error);
        throw new Error("No se pudo enviar el correo de verificación");
    }

    console.log("Correo enviado correctamente:", data.id);

    return data;
}

module.exports = { enviarVerificacion };
