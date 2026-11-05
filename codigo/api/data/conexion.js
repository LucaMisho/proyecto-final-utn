// Única conexión a PostgreSQL. Todos los repositorios usan este pool.
require("dotenv").config();
const { Pool, types } = require("pg");

// Por defecto pg convierte DATE en un objeto Date de JS (y lo corre de zona horaria).
// Lo dejamos como texto "AAAA-MM-DD", que es lo que la API devuelve y recibe.
types.setTypeParser(1082, (valor) => valor);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;