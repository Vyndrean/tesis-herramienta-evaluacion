Herramienta para apoyar el procedimiento de evaluacion de UX

Esta herramienta sirve para ayudar el proceso de evaluacion, permitiendo crear evaluacion de usabilidad, encuestas, etc. Para evaluar sitios web o apliaciones moviles

## Software stack
El proyecto "Herramienta para apoyar el procedimiento de evaluacion de UX" es una aplicación web que corre sobre el siguiente software:

-   Ubuntu 20.04
-   NodeJS 18.16.0

## Configuraciones de Ejecución para Entorno de Desarrollo/Producción

Para realizar una copia debes de clonar el repositorio de github https://github.com/Vyndrean/tesis-herramienta-evaluacion.git

### Credenciales de Base de Datos y variables de ambiente

#### Servidor de producción

Es importante considerar que para el funcionamiento correcto del proyecto deben estar corriendo simultaneamente el frontend y backend, donde deberan realizarse los pasos de instalacion de dependencias y configuracion de variable de entorno.

Para configurar el servidor de produccion se debe seguir los siguientes pasos en el servidor:

1. Iniciar el modo root e ingresar las credenciales de administrador del usuario.
-   sudo su

2. Actualizar el sistema operativo.
-   apt-get update

3.  Instalar curl para descargar paquetes.
-   apt-get install -y curl

4.  Instalar autoclean para limpiar el sistema.
-   apt-get -y autoclean

5.  Instalar git para clonar el repositorio.
-   apt-get install git

6.  Instalar nano para poder editar archivos.
-   apt-get install nano

7.  Instalar nvm para poder instalar NodeJS dentro del servidor.
-   curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

8.  Reinicar bash para que apliquen los cambios y se pueda utilizar comandos de NVM.
-   exec bash

9.  Instalar version 18.16.0 de NodeJS
-   nvm install 18.16.0

10. Cambiar alias de NodeJS
-   nvm alias default 18.16.0

11. Cambiar la version de NodeJS
-   nvm use default

12. Instalar yarn para poder instalar las dependecias y pm2 para poder ejecutar la aplicacion.
-   npm install -g yarn
-   npm install -g pm2

13. Ahora se debe clonar el repositorio del proyecto.
-   git clone "URI del proyecto"

14. Luego de haber clonado al repositorio se debe mover hacia la carpeta raiz del proyecto, ejecutando el siguiente comando:
-   cd "Proyecto"

##### Instalar las dependencias del proyecto ambiente de producción y generar el .env

Dentro de la carpeta raiz del proyecto para poder instalar las dependencias del proyecto, se debe de ejecutar los siguientes pasos:

1.  En la carpeta raiz vamos nos movemos hacia el directorio backend usando el siguiente comando:
-   cd backend/

2.  Dentro del backend instalaremos las dependencias usando el siguiete comando:

-   yarn install

3.  Ya con las dependencias instaladas se debe de generar el .env en la carpeta:

-   touch .env

4. Para editarlo se debe de ejecutar el siguiente comando:

-   nano .env

5. Dentro del .env se debe añadir las siguientes lineas de codigo y añadir los campos requeridos: 

-   PORT = "Puerto del backend"
-   DB = "URI de conexion con la base de datos (MongoDB)"
-   DIRECTION = "URL del frontend, ej: http://localhost:3000"
-   SECRET_KEY = "KEY para encryptar contraseña"
-   EMAIL_USER = "Direccion de Correo"
-   EMAIL_PASSWORD = "Contraseña del correo temporal"

6.  Con las dependencias del backend instaladas, se deben de instalar las depencias del frontend, para eso debemos dirigirnos a la raiz del proyecto y ejecutar los siguientes comandos:

-   cd frontend/

7.  Dentro del frontend instalaremos las dependicas usando el siguiente comando:

-   yarn install

8.  Ya con las dependencias instaladas se debe de generar el .env en la carpeta:

-   touch .env

9. Para editarlo se debe de ejecutar el siguiete comando:

-   nano .env

10. Dentro del .env se debe añadir las siguientes lineas de codigo y añadir los campos requeridos:

-   SERVIDOR="Direccion del servidor, ej: http://localhost:3001/api"

11. Ya listo en .env se debe contruir las paginas del frontend:

-   yarn build

##### Ejecutar el proyecto

Para poder ejecutar el proyecto se deben inicar el backend y el frontend, para lograr eso debemos seguir los siguientes pasos:

1.  Dentro de la raiz nos digirimos al backend usando el siguiente comando:

-   cd backend/

2.  Ya dentro del directorio del backend, debemos ejecutar el proyecto con el siguiente comando:

-   pm2 start yarn --name backend -- start

3.  Para poder verificar que esta corriendo el backend del proyecto, nos dirigimos al siguiente enlace:

-   http://"IP del server":3001/

4.  Ya con el backend corriendo, debemos de ejecutar el frontend del proyecto. Nos volvemos a dirigir a la raiz del proyecto y ejecutamos el siguiente comando:

-   cd frontend/

5.  Dentro del directorio del frontend, debemos ejecutar el proyecto con el siguiente comando:

-   pm2 start yarn --name frontend -- start

6. Para poder verificar que esta corriendo el frontend del proyecto, nos dirigimos al siguiente enlace:

-   http://"IP del server":3000/


## Construido con
-   yarn
-   nvm
-   nodejs
-   nano
-   pm2
-   npm

## Licencia

Este proyecto fue construido con la licencia AAA, - ver [LICENSE.md](LICENSE.md) para mayor información

## Contribuir al proyecto

-   Por favor lea las instruciones para contribuir al proyecto en [CONTRIBUTING.md](CONTRIBUTING.md)

## Agradecimientos

- Gracias a toda la documentacion disponible de Chakra UI, NextJS y NodeJS que hicieron facil de desarrollar muchas de las funciones disponibles.
