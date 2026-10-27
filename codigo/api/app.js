//Creamos la app con express
const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

// Si el pedido no trae cuerpo, req.body queda vacío en lugar de undefined
app.use((req, res, next) => {
    if (req.body === undefined) req.body = {};
    next();
});

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


app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de Barrio Cultura funcionando"
    });
});

// Importamos los middlewares de manejo de errores
const { 
    rutaNoEncontrada, 
    manejarErrores 
} = require("./middleware/errores");
app.use(rutaNoEncontrada);
app.use(manejarErrores);


module.exports = app;
