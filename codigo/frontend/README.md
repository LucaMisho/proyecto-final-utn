Configuración del frontend
Crear un archivo .env dentro de codigo/frontend:
VITE_API_URL=http://localhost:3000

Esta variable indica la dirección del backend al que se conecta el frontend.
- Para desarrollo local: http://localhost:3000.
- Para producción: utilizar la URL pública del backend desplegado en Vercel.