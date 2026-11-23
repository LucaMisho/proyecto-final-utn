const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const TIPOS = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (TIPOS.includes(file.mimetype)) cb(null, true);
    else cb(new Error("La imagen tiene que ser JPG, PNG o WebP."));
  },
});

function subirACloudinary(buffer, carpeta) {
  return new Promise((resolve, reject) => {
    const flujo = cloudinary.uploader.upload_stream(
      { folder: carpeta, resource_type: "image" },
      (error, resultado) => (error ? reject(error) : resolve(resultado))
    );
    flujo.end(buffer);
  });
}

function subirImagen(campo, carpeta) {
  const recibir = upload.single(campo);

  return (req, res, next) => {
    recibir(req, res, async (error) => {
      if (error) {
        const mensaje =
          error.code === "LIMIT_FILE_SIZE"
            ? `La imagen pesa más de ${MAX_MB} MB.`
            : error.message;
        return res.status(400).json({ error: mensaje });
      }

      if (!req.file) return next();

      try {
        const resultado = await subirACloudinary(req.file.buffer, carpeta);
        req.body.imagen = resultado.secure_url;
        next();
      } catch {
        res.status(502).json({ error: "No se pudo subir la imagen." });
      }
    });
  };
}

module.exports = subirImagen;