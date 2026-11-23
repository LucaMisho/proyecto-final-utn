// servicios/correo.js
const nodemailer = require("nodemailer");

const transporte = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function enviarVerificacion(destino, token) {
  const enlace = `${process.env.BACKEND_URL}/api/auth/verificar?token=${token}`;
  await transporte.sendMail({
    from: process.env.CORREO_REMITENTE,
    to: destino,
    subject: "Confirmá tu correo",
    html: `<p>Hacé clic para confirmar tu correo:</p>
           <p><a href="${enlace}">Confirmar correo</a></p>
           <p>El enlace vence en 24 horas.</p>`,
  });
}

module.exports = { enviarVerificacion };