//Creamos la app con express
const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());
const barrioRoutes = require("./routes/barrios.routes");
app.use("/api/barrios", barrioRoutes);


app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de Barrio Cultura funcionando"
    });
});

module.exports = app;
