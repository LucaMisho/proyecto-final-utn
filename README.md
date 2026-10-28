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

## Iniciar el servidor 
Una vez instaladas las dependencias y configurada la base de datos, iniciar la API con el 
comando correspondiente definido en package.json, en este caso: npm run dev.  
 
## Creación del usuario administrador  
El proyecto cuenta con un comando para crear un usuario con rol de administrador: npm run admin:crear  

Básicamente lo que hace es generar un usuario utilizando las credenciales del .env y el 
crear-admin.js en script que se encarga de hacer el INSERT de un usuario nuevo con rol ADMINISTRADOR por defecto, 
permite usar los endpoints principales de la API.  

Por motivos de seguridad, los usuarios registrados normalmente no pueden modificar su propio rol para obtener permisos de administrador. La asignación de este rol se realiza mediante el procedimiento específico de creación del administrador. 