// Crea todas las tablas ejecutando db/schema.sql. Uso: npm run db:iniciar
// Ojo: borra las tablas si ya existen. Es solo para desarrollo.
const fs = require("fs");
const path = require("path");
const pool = require("../db/pool");

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Base de datos creada.");
}

main()
  .catch((e) => { console.error("No se pudo crear la base:", e.message); process.exitCode = 1; })
  .finally(() => pool.end());
