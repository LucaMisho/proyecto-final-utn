//Creamos la app con express
const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());
const barrioRoutes = require("./routes/barrios.routes");
app.use("/api/barrios", barrioRoutes);

const tallerRoutes = require("./routes/talleres.routes");
app.use("/api/talleres", tallerRoutes);
const alumnoRoutes = require("./routes/alumnos.routes");
app.use("/api/alumnos", alumnoRoutes);
const usuarioRoutes = require("./routes/usuarios.routes");
app.use("/api/usuarios", usuarioRoutes);
const personalRoutes = require("./routes/personal.routes");
app.use("/api/personal", personalRoutes);


app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de Barrio Cultura funcionando"
    });
});

module.exports = app;
