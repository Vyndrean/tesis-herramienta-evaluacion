Herramienta para apoyar el procedimiento de evaluacion de UX

Esta herramienta sirve para ayudar el proceso de evaluacion, permitiendo crear evaluacion de usabilidad, encuestas, etc. Para evaluar sitios web o apliaciones moviles

## Software stack
El proyecto "Herramienta para apoyar el procedimiento de evaluacion de UX" es una aplicación web que corre sobre el siguiente software:

-   Ubuntu 20.04
-   NodeJS 18.16.0
-   NextJS 13.4.2
-   Mongoose 5.13.15

## Configuraciones de Ejecución para Entorno de Desarrollo/Producción

Para realizar una copia debes de clonar el repositorio de github https://github.com/Vyndrean/tesis-herramienta-evaluacion.git

### Credenciales de Base de Datos y variables de ambiente
Editar el archivo .env.example cambiando su nombre a .env o crear un nuevo .env para el backend: `tesis-herramienta-evaluacion/backend/.env` y añadir: 
-   PORT = "Puerto del backend"
-   DB = "URI de conexion con la base de datos (MongoDB)"
-   DIRECTION = "URL del frontend, ej: http://localhost:3000"
-   SECRET_KEY = "KEY para encryptar contraseña"
-   EMAIL_USER = "Direccion de Correo"
-   EMAIL_PASSWORD = "Contraseña del correo temporal"

Luego se debe configurar el .env del frontend: `tesis-herramienta-evaluacion/frontend/.env` y añadir:
-   SERVIDOR="Direccion del servidor, ej: http://localhost:3001/api"

### docker y docker-compose son requeridos

Con una terminal situarse dentro del directorio raiz donde fue clonado este repositorio y ejecutar lo siguiente para construir la imagen docker:

```bash
docker-compose up -d --build
```

Esto construira ambas imagenes y las ejecutara en segundo plano.

Ir a un navegador web y ejecutar la siguiente url: http://localhost:3001/api para poder acceder al backend en funcionamiento y la url: http://localhost:3000 para acceder al frontend.

## Construido con
-   docker
-   docker-compose
-   npm
-   node

## Licencia

Este proyecto fue construido con la licencia AAA, - ver [LICENSE.md](LICENSE.md) para mayor información

## Contribuir al proyecto

-   Por favor lea las instruciones para contribuir al proyecto en [CONTRIBUTING.md](CONTRIBUTING.md)

## Agradecimientos

- Gracias a toda la documentacion disponible de Chakra UI, NextJS y NodeJS que hicieron facil de desarrollar muchas de las funciones disponibles.