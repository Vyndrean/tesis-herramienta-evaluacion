# Guía de Contribución

## Equipo de Desarrollo

## Autores

- [Sebastian Moreno](https://github.com/Vyndrean)

## Estándar de Codificación

### Estilo de Codificación

El estilo de código de este proyecto debe seguir las recomendaciones de los estándares:

-   [Estructura de NextJS](https://nextjs.org/docs/getting-started/project-structure)
-   [Api Rest NodeJS](https://www.freecodecamp.org/news/rest-api-design-best-practices-build-a-rest-api/)
-   [import](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/import)
-   [require](https://nodejs.org/api/modules.html)

### Configuraciones para editores de código

Antes de escribir tu codigo, generales de tu editor esten ajustados de la siguiente manera:

-   Final/Salto de Línea (EOL - End of Line ) = LF
-   Codificación de Archivos de Código (Encoding - Charset) = UTF-8, ISO-8859-1
-   Tabulación = Espacios para la sangria

### Editor Config

Puedes utilizar la configuracion de tu preferencia.

## Desarrollo del código

### Arquitectura del Sistema - Patrones de Diseño

-   El proyecto se compone de un Backend y un Frontend
-   Para conectar a la base de datos se debe de editar el .env y añadir la uri mongodb.

Para el backend se debe de utilizar la estrucutra comun de Node.js y Express.js para organizar el codigo, de esta forma:
-   controllers
-   models
-   routes
-   middleware
-   services
-   index.js
-   package.json

Y el frontend debe de utilizar la estrucutra comun de Next.js
-   pages
-   components
-   data
-   styles
-   package.json


-   Las importaciones y exportaciones deben de utilizar la sintaxis de 'require' en Node.js y la sintaxis 'import' en Next.js

-   Para el uso de packeted de terceros se deben de utilizar los npm packages que esten disponibles en el registro de npm, para poder ser usados. Para instalarlos debes de usar 'npm' y luego puedes importar sus funcionalidades al codigo.

### Analizar codigo desarrollado

Para verificar el cumplimiento del [Estandar de Codificacion](#estándar-de-codificación), con una terminal en la raiz del proyecto ejecutar 'npm run dev', esto ejecutara el script de desarrollador.

## Interaccion con el repositorio

1. Crear una issue y una rama a partir de main:
    - Crear una nueva issue en Github para describir la tareas que seran desarrolladas. Puedes asignar la issue al milestone correspondiente.
    - Crear una nueva rama a partir de la rama 'main' con un nombre descriptivo, como 'feature/nueva-funcionalidad' o 'bugfix/arreglo-de-error'.
2. Desarrollar el codigo en la nueva rama creada:
    - Realizar commits en la ramaa de la issue con mensajes claros y descriptivos.
    - Mencionar el numero de issue en el mensaje del commit para vincularlo con la issue correspondiente.
3. Construir los test unitararios y de integracion:
    - Desarrollar test unitarios y de integracion que comprueben el funcionamiento de tu desarrollo.
    - Ejecutar los test localmente para asegurarte de que pasan correctamente y que no rompen otras funcionalidades del sistema.
4. Enviar tu codigo al repositorio y abrir un Püll Request (PR):
    - Los Colaboradores (Tiene permiso para revisar y aprobar cambios) del repositorio revisaran el Pull Request y realizaran comentarios o sugerencias.
    - Si el PR cumple con los criterios de aceptacion y pasa la revision, Colaboradores aprobaran el PR y podran fusionar los cambios en la rama 'main'.


### Archivos/Directorios que no deben ser versionados o enviados al repositorio (**no** incluir en los **commit's**)

- node_modules/
- .env
- package-lock.json

### Archivos/Directorios que no deben estar en ambientes de producción

- .gitignore
- .dockerignore
- README.md
- .git