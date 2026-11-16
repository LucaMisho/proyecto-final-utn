require("dotenv").config();

const { Pool, types } = require("pg");

types.setTypeParser(1082, (valor) => valor);

const configuracion = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      };

const pool = new Pool(configuracion);

module.exports = pool;

