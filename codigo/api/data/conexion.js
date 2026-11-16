require("dotenv").config();

const { Pool, types } = require("pg");

// Mantener DATE como texto AAAA-MM-DD
types.setTypeParser(1082, (valor) => valor);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;
