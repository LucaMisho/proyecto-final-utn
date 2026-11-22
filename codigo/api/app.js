// Creamos la app con express
const express = require("express");
const cors = require("cors");

// Creamos la app con Express
const app = express();

// Configuración de CORS
const origenesPermitidos = [
    "http://localhost:5173",
    "https://proyecto-final-utn-sage.vercel.app",
    process.env.FRONTEND_URL
]
    .filter(Boolean)
    .map((o) => o.trim().replace(/\/$/, ""));

// URLs de deployment de Vercel de este proyecto
const regexVercel = /^https:\/\/proyecto-final-[a-z0-9]+-proyecto-final11\.vercel\.app$/;

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origenesPermitidos.includes(origin) || regexVercel.test(origin)) {
            return callback(null, true);
        }

        console.log("CORS rechazó el origen:", origin);
        return callback(null, false);
    }
}));

// Middlewares generales
app.use(express.json());

// Si el pedido no trae cuerpo, req.body queda vacío
app.use((req, res, next) => {
    if (req.body === undefined) {
        req.body = {};
    }
    next();
});

// Rutas
const perfilRoutes = require("./routes/perfil.routes");
app.use("/api/perfil", perfilRoutes);

const buscadorRoutes = require("./routes/buscador.routes");
app.use("/api/buscador", buscadorRoutes);

const barrioRoutes = require("./routes/barrios.routes");
app.use("/api/barrios", barrioRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const tallerRoutes = require("./routes/talleres.routes");
app.use("/api/talleres", tallerRoutes);

const alumnoRoutes = require("./routes/alumnos.routes");
app.use("/api/alumnos", alumnoRoutes);

const usuarioRoutes = require("./routes/usuarios.routes");
app.use("/api/usuarios", usuarioRoutes);

const personalRoutes = require("./routes/personal.routes");
app.use("/api/personal", personalRoutes);

const inscripcionRoutes = require("./routes/inscripciones.routes");
app.use("/api/inscripciones", inscripcionRoutes);

const asistenciaRoutes = require("./routes/asistencias.routes");
app.use("/api/asistencias", asistenciaRoutes);

const actividadRoutes = require("./routes/actividades.routes");
app.use("/api/actividades", actividadRoutes);

const seguimientoRoutes = require("./routes/seguimientos.routes");
app.use("/api/seguimientos", seguimientoRoutes);

const noticiaRoutes = require("./routes/noticias.routes");
app.use("/api/noticias", noticiaRoutes);

const sedeRoutes = require("./routes/sedes.routes");
app.use("/api/sedes", sedeRoutes);

const redRoutes = require("./routes/redes.routes");
app.use("/api/redes", redRoutes);

const sugerenciaRoutes = require("./routes/sugerencias.routes");
app.use("/api/sugerencias", sugerenciaRoutes);

const novedadesRoutes = require("./routes/novedades.routes");
app.use("/api/novedades", novedadesRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de Barrio Cultura funcionando"
    });
});

// TEMPORAL: diagnóstico de la conexión (borrar cuando todo ande)
app.get("/api/diagnostico", async (req, res) => {
    try {
        const pool = require("./data/conexion");
        const r = await pool.query(
            "SELECT current_database() AS base, (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') AS tablas"
        );
        res.json(r.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Middlewares de manejo de errores
const {
    rutaNoEncontrada,
    manejarErrores
} = require("./middleware/errores");

app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
