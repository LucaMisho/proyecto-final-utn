# Sitio web de Envión-Quequén/Barrio Cultura

Trabajo Final Integrador — Programación IV
Tecnicatura Universitaria en Programación — UTN FRMDP, Extensión Áulica Necochea

## La institución

El programa Envión-Quequén y Barrio Cultura se dedican a la responsabilidad social compartida,
trabajando con adolescentes y niños en situaciones de vulnerabilidad psicosocial.

## Integrantes

Massa Luca,
Génova  Candela,
Kristensen Franco 

## Estado

Etapa 4 — Diseño e implementación de las API

## Instrucciones de instalación y ejecución:

Requisitos previos:
Antes de ejecutar el proyecto, es necesario instalar:
    Node.js y npm: para ejecutar la API e instalar sus dependencias.
    PostgreSQL: para gestionar la base de datos.
    Un cliente para administrar la base de datos, como pgAdmin.
    Git, para clonar el repositorio. 
Instalacion y ejecucion:
1. Clonar el repositorio.
	git clone https://github.com/LucaMisho/proyecto-final-utn.git
2. Configurar la base de datos
    Iniciar PostgreSQL.
    Crear la base de datos del proyecto.
    Ejecutar el script SQL del repositorio para crear las tablas, relaciones, restricciones e índices necesarios.
    Verificar que las tablas se hayan creado correctamente.
3. Configurar el backend.
    Ingresar a la carpeta de la API:
        cd codigo/api
    Instalar las dependencias:
        npm install
    Configurar las variables de entorno necesarias para la conexión a PostgreSQL y el funcionamiento de la API, utilizando los nombres y valores requeridos por el proyecto. No publicar contraseñas ni claves privadas en el repositorio.
4. Iniciar el servidor.
    npm run dev
    La API utiliza el puerto 3000, por lo que, una vez iniciada, se puede acceder a ella mediante: http://localhost:3000
5. Probar la API.
    Los endpoints pueden probarse mediante Postman u otro cliente HTTP, enviando las solicitudes correspondientes y configurando la autenticación cuando sea necesaria.
* Verificación de la instalación
    Para comprobar que el proyecto funciona en otro equipo:
        Clonar el repositorio en una computadora diferente.
        Seguir los pasos de instalación y configuración.
        Iniciar el servidor.
        Probar los endpoints principales de la API.
        Registrar cualquier problema encontrado durante la instalación o ejecución.

