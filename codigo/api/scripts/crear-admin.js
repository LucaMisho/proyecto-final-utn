// Crea la cuenta de administrador, o le da el rol a una cuenta que ya existe con ese email.
// Los datos salen del .env (ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD). Uso: npm run admin:crear
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../data/conexion");

async function main() {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Faltan ADMIN_USERNAME, ADMIN_EMAIL o ADMIN_PASSWORD en el .env");
    }

    if (ADMIN_PASSWORD.length < 8) {
        throw new Error("ADMIN_PASSWORD tiene que tener al menos 8 caracteres");
    }

    const existente = await pool.query("SELECT id_usuario FROM usuario WHERE LOWER(email) = LOWER($1)", [ADMIN_EMAIL]);

    if (existente.rowCount > 0) {
        await pool.query("UPDATE usuario SET rol = 'ADMINISTRADOR', estado = TRUE WHERE id_usuario = $1", [existente.rows[0].id_usuario]);
        console.log("La cuenta " + ADMIN_EMAIL + " ahora es administradora.");
        return;
    }

    const claveHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
        "INSERT INTO usuario (username, email, contraseña, rol) VALUES ($1, $2, $3, 'ADMINISTRADOR')",
        [ADMIN_USERNAME, ADMIN_EMAIL, claveHash]
    );
    console.log("Administrador creado: " + ADMIN_EMAIL);
}

main()
    .catch((error) => { console.error("No se pudo crear el administrador:", error.message); process.exitCode = 1; })
    .finally(() => pool.end());
