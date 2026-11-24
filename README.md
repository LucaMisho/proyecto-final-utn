# Sitio web de Envión-Quequén/Barrio Cultura

Trabajo Final Integrador — Programación IV
Tecnicatura Universitaria en Programación — UTN FRMDP, Extensión Áulica Necochea

## La institución

El programa Envión-Quequén y Barrio Cultura se dedican a la responsabilidad social compartida,
trabajando con adolescentes y niños en situaciones de vulnerabilidad psicosocial.

## Integrantes

Massa Luca,
Génova  Candela,
Kristensen Franco Valentin

## Estado

Etapa 7 — Desarrollo del Frontend.

## Instrucciones de instalación y ejecución:
Antes de ejecutar el proyecto, es necesario cumplir los siguientes requisitos:

## Herramientas obligatorias y el ZIP
Instalar Visual Studio Code (VSCODE): Entorno de desarrollo principal donde vamos a utilizar su terminal integrada.
Instalar Node.js y npm: permite ejecutar la API e instalar sus dependencias.
Instalar PostgreSQL: para gestionar la base de datos.
Instalar pgAdmin: Cliente para administrar la base de datos.
Instalar Postman u otro Cliente REST: Permite hacer las peticiones HTTP con los diferentes endpoints.

Descargar proyecto como ZIP y extraerlo en tu computadora, abrir la carpeta con el Visual Studio Code ya instalado.

## Instalar las dependencias 
1. Abrir la terminal en VSCODE y posicionarse en la raiz /codigo y luego /api. 
2. Ejecutar el comando: npm install  
Este comando instala las dependencias declaradas en package.json y genera la carpeta 
node_modules, donde se almacenan los módulos necesarios para ejecutar la aplicación. 

Los principales modulos y mas importantes que utilizamos son:  express, pg, dotenv, bcryptjs, jsonwebtoken  

## Configurar las variables de entorno  
Una vez configurado los modulos, se requiere crear un archivo nuevo llamado .env en la 
misma raiz, copiando y pegando los valores que estan en .env.ejemplo y adaptandolos a la 
configuración del equipo en el que se encuentra(La base de datos).  

##  Datos de prueba y tablas
Ejecutar el ScriptEnvion.sql de la carpeta /bd en la base de datos para integrar las tablas y relaciones y crear la base de datos, y el archivo DatosPruebaEnvion.sql para insertar datos para hacer las consultas, el usuario se crea con el cliente REST y el administrador por seguridad con npm run admin:crear.

## Iniciar el servidor 
Una vez instaladas las dependencias y configurada la base de datos, iniciar la API con el 
comando correspondiente definido en package.json, en este caso: npm run dev, en la terminal tiene que aparecer: API funcionando en puerto 3000
 
## Creación del usuario administrador  
El proyecto cuenta con un comando para crear un usuario con rol de administrador: npm run admin:crear  

Básicamente lo que hace es generar un usuario utilizando las credenciales del .env y el 
crear-admin.js en script que se encarga de hacer el INSERT de un usuario nuevo con rol ADMINISTRADOR por defecto, 
permite usar los endpoints principales de la API.  

Por motivos de seguridad, los usuarios registrados normalmente no pueden modificar su propio rol para obtener permisos de administrador. La asignación de este rol se realiza mediante el procedimiento específico de creación del administrador. 

## Configurar y ejecutar el frontend

El frontend es una aplicación React creada con Vite y está en la carpeta /codigo/frontend.
Necesita que la API esté corriendo (ver "Iniciar el servidor"), por lo que hay que
levantar primero el backend y después el frontend, cada uno en su propia terminal.

### 1. Instalar las dependencias
1. Abrir una segunda terminal en VSCODE y posicionarse en /codigo y luego /frontend.
2. Ejecutar el comando: npm install

### 2. Configurar las variables de entorno
Crear un archivo nuevo llamado .env en la raíz de /frontend (si existe un .env.ejemplo,
copiar sus valores) e indicar la URL de la API:

VITE_API_URL=http://localhost:3000

El puerto debe coincidir con el definido en el .env de la API. Las variables del
frontend tienen que empezar con VITE_ para que Vite las exponga. Si se modifica el
.env, hay que reiniciar el servidor de desarrollo.

### 3. Iniciar el frontend
Ejecutar el comando: npm run dev

Vite muestra en la terminal la dirección donde se sirve la aplicación
(por defecto http://localhost:5173). Abrirla en el navegador.

Nota: la API solo acepta peticiones de los orígenes permitidos (CORS). Si al iniciar
sesión aparece un error de CORS, hay que agregar la dirección del frontend
(por ejemplo http://localhost:5173) a la lista de orígenes permitidos en app.js de la API.

### 4. Generar la versión de producción (opcional)
- npm run build: genera la carpeta dist con la aplicación lista para publicar.
- npm run preview: permite probar localmente esa versión.

### 5. Versión publicada
- Frontend (Vercel): https://barriocultura-envionquequen.vercel.app/
- API (Render): https://proyecto-final-utn-23w6.onrender.com

### Estructura del frontend
- src/layouts: Header, Footer y MainLayout.
- src/pages: pantallas completas (Inicio, Login, Registro, Perfil, Talleres, Noticias, etc.).
- src/components: secciones y componentes reutilizables (por ejemplo components/inicio y components/admin).
- src/assets y public: imágenes y recursos estáticos.