# Challenge XAcademy DEV 2026 - Gestión de Jugadores FIFA

## Descripción del Proyecto
Este proyecto es una aplicación full-stack desarrollada para la gestión, análisis y visualización del historial de jugadores de FIFA (2015-2023). El sistema permite visualizar un listado paginado, obtener detalles específicos, crear nuevos perfiles personalizados, editar información existente y exportar datos. 

Este desarrollo cumple con los requerimientos obligatorios y puntos extra solicitados en el Challenge XAcademy DEV 2026.

## Stack Tecnológico
* **Frontend:** Angular 17+ (Componentes Standalone, Reactive Forms, Chart.js).
* **Backend:** Node.js con NestJS.
* **Base de Datos:** MySQL.
* **ORM:** Sequelize / Sequelize-Typescript.
* **Infraestructura:** Docker & Docker Compose.
* **IA:** Google Generative AI (Gemini 2.5 Flash).
* **Validación:** class-validator y express-validator.
* **Documentación:** Swagger / OpenAPI 3.0.

## Vistas de la Aplicación

- **Vista de LOGIN:** `![LOGIN](./assets/login.png)`
- **Radar desde plantilla de jugadores:** `![Radar en la seleccion de jugador](./assets/vistaradar.png)`
- **Modo Noche y Grilla de Jugadores:** `![Listado](./assets/listadodejugadores.png)`
- **Radar de Habilidades (Chart.js):** `![Radar](./assets/radarenaccion.png)`
- **Evolución Histórica y Coach IA:** `![Coach IA](./assets/dignosticoconIA.png)`

---

---

## Funcionalidades Implementadas

### Core (Requerimientos Obligatorios)
- [x] **Autenticación (Login):** Rutas del backend protegidas. No se devuelve información sin un token JWT válido.
- [x] **Listado de Jugadores:** Endpoint y pantalla con paginación y filtros (nombre, club, posición).
- [x] **Exportación a CSV:** Implementación de descarga del listado filtrado.
- [x] **Detalle del Jugador:** Vista detallada de estadísticas integrando un Radar Chart (Chart.js) para visualizar skills.
- [x] **Edición de Jugador:** Formulario reactivo y endpoint `PATCH` para modificar información.
- [x] **Creación de Jugador:** Formulario y endpoint `POST` con validaciones estrictas en ambos extremos para crear un jugador personalizado.
- [x] **Infraestructura:** Archivo `docker-compose.yml` para levantar la solución completa con un solo comando.
- [x] **Documentación de API:** Implementación de Swagger UI (`/api-docs`).

### Puntos Extra
- [x] **Línea de Tiempo Interactiva:** Componente visual (`player-timeline`) que permite seleccionar una habilidad específica (Pace, Shooting, etc.) y observar su evolución a lo largo de las distintas versiones de FIFA (2015-2023) utilizando un gráfico de líneas fluido y moderno.
- [x] **Análisis de Evolución con IA:** Integración con Gemini 2.5 Flash para generar diagnósticos de rendimiento basados en el historial estadístico del jugador.
- [x] **Endpoint de importación CSV:** Funcionalidad implementada mediante `POST /import` soportando archivos multipart/form-data.

---

## Decisiones Técnicas y Funcionales (Bitácora)

Durante el desarrollo, se tomaron las siguientes decisiones arquitectónicas y resoluciones de problemas:

### 1. Arquitectura Frontend (Angular)
* **Componentes Standalone:** Se optó por utilizar componentes standalone para mejorar la modularidad y reducir el *boilerplate* de NgModules, facilitando la inyección directa de dependencias.
* **Manejo del Estado del Gráfico:** Para la línea de tiempo histórica, se aisló la lógica en un componente hijo (`player-timeline`) recibiendo el `playerId` mediante `@Input()`. Esto permite recargar dinámicamente el gráfico de Chart.js sin afectar al componente padre.
* **Fallas de Renderizado Chart.js:** Se enfrentaron problemas de registro de controladores en `ng2-charts` al compilar la línea de tiempo. Se resolvió importando y registrando explícitamente los módulos de `Chart.js` (`Chart.register(...registerables)`) y ajustando el tipado estricto de TypeScript (reemplazando `null` por `undefined` en el área de degradado).

### 2. Sincronización de Datos y Validaciones Estrictas (NestJS + Sequelize)
* **El Problema del HTTP 400 (Bad Request):** Inicialmente, el frontend enviaba un payload que chocaba con el `ValidationPipe` global de NestJS (configurado con `whitelist: true`). 
* **Solución:** Se creó el archivo `create-player.dto.ts` estandarizando las propiedades permitidas (`longName`, `clubName`, `playerPositions`, `overall`, etc.) para unificar el contrato de datos entre Angular y NestJS. Se limpió el payload en el frontend para enviar exclusivamente lo necesario.
* **El Problema del HTTP 500 (Internal Server Error):** Al pasar las validaciones del DTO, la creación de jugadores fallaba a nivel de base de datos (`SequelizeDatabaseError: ER_NO_DEFAULT_FOR_FIELD`). MySQL exigía campos obligatorios propios de la estructura original del dataset de FIFA.
* **Solución:** Se inyectaron valores técnicos por defecto desde el frontend (ej. `fifaVersion: 23`, `fifaUpdate: 9`, `potential`, `playerFaceUrl`) y se ampliaron los decoradores en el DTO para permitir el paso de estos datos, logrando un guardado exitoso.
* **Shadowing de Propiedades:** Se resolvió un *warning* de Sequelize en consola agregando la palabra reservada `declare` en los atributos de clase del modelo `PlayerModel` para respetar los getters/setters del ORM.

### 3. Seguridad
* El endpoint de creación (POST) requirió la inyección de cabeceras (`Authorization: Bearer <token>`) en el servicio de Angular para atravesar correctamente los *guards* de autenticación implementados en NestJS.

### 4. Integración de IA y QA (Resolución de Problemas)
* **Gestión de Entornos (Docker Cache):** Durante la integración de la IA, se identificó que la caché de Docker retenía variables de entorno antiguas. Se estableció como protocolo estándar ejecutar limpiezas forzadas (`docker-compose down` y `docker-compose up --build`) al rotar credenciales.
* **Seguridad de Credenciales:** Ante un bloqueo de API Key por parte de Google (Error HTTP 403 Forbidden), se reforzó la política de seguridad rotando la credencial afectada y asegurando su aislamiento en el archivo `.env`.
* **Conflictos de Enrutamiento y Documentación:** Se detectó e unificó una colisión de rutas en el decorador `@Post()` de jugadores, asegurando la cobertura del guard `JwtAuthGuard`. Posteriormente, se enriqueció la documentación de Swagger detallando contratos (códigos 200, 400, 401, 404, 500) para facilitar la comunicación entre Frontend y Backend.
* **Resolución de CORS:** Se habilitó el acceso cross-origin desde NestJS (`app.enableCors()`) para permitir el flujo sin bloqueos desde el puerto 4200 (Angular) al 3000 (Backend).

---

## Instrucciones de Ejecución

1. Clonar el repositorio.
2. Posicionarse en el directorio raíz (`cd football-api`).
3. Crear un archivo `.env` en la raíz. Para facilitar la evaluación, he dejado un archivo `.env.example` en el repositorio con todas las claves estructurales. Solo debes copiarlo, renombrarlo a `.env` y agregar tu propia clave de Gemini en la variable `GOOGLE_GENERATIVE_AI_API_KEY` (las variables de base de datos ya están preconfiguradas para funcionar con Docker).
4. Ejecutar el siguiente comando para construir y levantar los contenedores de la Base de Datos, Backend y Frontend:
   ```bash
   docker-compose up --build
---

## Agradecimientos y Créditos

Este proyecto representa el cierre de una gran etapa de aprendizaje. Quiero extender un agradecimiento especial a todo el equipo y mentores de **XAcademy** por la guía, los conocimientos compartidos durante el programa y por proveer el repositorio base inicial que sirvió como excelente cimiento arquitectónico para desarrollar esta plataforma. ¡Gracias por la oportunidad!

