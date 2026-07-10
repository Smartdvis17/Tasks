# Task Manager — Backend

API REST para gestionar tareas (crear, editar, eliminar, listar y filtrar), con soporte para
programar fecha/hora de inicio y fin, y validación de solapamiento de horarios.

## Índice

- [Stack](#stack)
- [Arquitectura y flujo de una petición](#arquitectura-y-flujo-de-una-petición)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [CORS](#cors)
- [Formato de respuesta](#formato-de-respuesta)
- [Endpoints](#endpoints)
- [Modelo de tarea](#modelo-de-tarea)
- [Reglas de validación y de negocio](#reglas-de-validación-y-de-negocio)
- [Manejo de errores](#manejo-de-errores)
- [Testing](#testing)

## Stack

- [Express 5](https://expressjs.com/) — servidor HTTP y enrutamiento
- [Mongoose](https://mongoosejs.com/) — ODM para MongoDB
- [yup](https://github.com/jquense/yup) — validación de esquemas de entrada
- [cors](https://www.npmjs.com/package/cors) — habilita peticiones desde el frontend
- [morgan](https://www.npmjs.com/package/morgan) — logging de peticiones HTTP en desarrollo
- [dotenv](https://www.npmjs.com/package/dotenv) (vía `process.loadEnvFile()` nativo de Node) — variables de entorno
- [Jest](https://jestjs.io/) + [supertest](https://www.npmjs.com/package/supertest) — pruebas end-to-end

## Arquitectura y flujo de una petición

El proyecto sigue una separación por capas dentro de cada recurso (`tasks/`):

```
routes/  →  middleware de validación  →  controller/  →  services/  →  model/
```

1. **`routes/task.routes.js`** define la URL y el método HTTP, y encadena el middleware de
   validación antes del controlador (solo en `POST` y `PUT`).
2. **`middleware/validationSchema.js`** corre el `req.body` contra un schema de `yup`
   (`createTaskSchema` o `updateTaskSchema`). Si falla, corta la petición con `400` y una lista de
   errores por campo; si pasa, reemplaza `req.body` por el objeto ya validado/transformado
   (trims, lowercase, fechas convertidas a `Date`, etc.).
3. **`controller/task.controller.js`** es una capa delgada: cada función solo delega al `service`
   correspondiente. Existe para mantener la firma `(req, res)` desacoplada de dónde vive la lógica.
4. **`services/task.service.js`** contiene la lógica real de cada endpoint (consultas a Mongoose,
   reglas de negocio, armado de la respuesta). Todas las funciones están envueltas con
   `catchAsync` (ver [`helpers/catchAsync.js`](src/helpers/catchAsync.js)) para no repetir
   try/catch en cada una.
5. **`model/taskModel.js`** define el schema de Mongoose que finalmente lee/escribe en MongoDB.

Los `helpers/` son transversales a todo el backend (no solo a `tasks/`): `response.js` estandariza
el formato de salida, `catchAsync.js` estandariza el manejo de errores inesperados, y
`task.helpers.js` contiene las reglas de negocio de horario que usa el service.

## Requisitos previos

- Node.js 18+ (usa `process.loadEnvFile()`, disponible desde Node 20; en versiones anteriores hay
  que reemplazarlo por el paquete `dotenv`)
- Una instancia de MongoDB accesible (local o remota)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y ajustar los valores según tu entorno
npm run dev
```

El servidor queda escuchando en el puerto definido por `PORT` (por defecto `3000`) y se conecta a
MongoDB al arrancar (`connectDB()` en `src/index.js`). Si la conexión falla, el error se loguea en
consola pero el proceso no se cae — las peticiones a la base de datos fallarán hasta que la
conexión se restablezca.

## Variables de entorno

Definidas en `.env` (ver `.env.example`):

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde escucha el servidor (por defecto `3000` si no está definida) |
| `MONGO_URI` | Host de conexión a MongoDB, sin el nombre de la base (ej. `mongodb://127.0.0.1:27017`) |
| `DATABASE_NAME` | Nombre de la base de datos. Se concatena a `MONGO_URI` como `${MONGO_URI}/${DATABASE_NAME}` (ver `src/database/conect.js`) |
| `MONGO_URI_TEST` / `DATABASE_NAME_TEST` | Mismo esquema, usados solo por la suite de Jest (`tests/tast.e2e.test.js`) |

## Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Levanta el servidor con `node` (sin recarga automática) |
| `npm run dev` | Levanta el servidor con `node --watch` (reinicia el proceso al guardar cambios) |
| `npm test` | Corre la suite de Jest (`--runInBand`, secuencial) contra la base de `MONGO_URI_TEST` |

## Estructura del proyecto

```
src/
  index.js                                # entrypoint: configura Express, CORS, rutas y arranca el servidor
  database/
    conect.js                              # conexión a MongoDB (connectDB)
  helpers/
    response.js                             # formato estándar de respuesta { ok, data, msg }
    catchAsync.js                            # wrapper para no repetir try/catch en cada handler
    task.helpers.js                           # reglas de negocio de horario (solapamiento, orden hora/fecha) + findTaskOr404
  middleware/
    validationSchema.js                        # aplica un schema de yup sobre req.body y normaliza errores 400
  tasks/
    model/
      taskModel.js                                # schema de Mongoose (title, description, status, fechas, horas)
    validation/
      task.schema.valitation.js                     # schemas de yup para crear/editar
    controller/
      task.controller.js                              # controladores (delegan al service)
    services/
      task.service.js                                   # lógica de cada endpoint
    routes/
      task.routes.js                                      # definición de rutas y wiring de middleware
tests/
  tast.e2e.test.js                          # pruebas end-to-end con supertest, contra una base Mongo real
```

## CORS

`src/index.js` habilita CORS solo para un origen fijo:

```js
app.use(cors({ origin: 'http://localhost:5174' }));
```

> **Importante:** el puerto por defecto de Vite es `5173`, no `5174`. Si al correr
> `npm run dev` en el frontend te asigna el `5173` (lo normal si no tienes otro proyecto Vite
> ocupando el `5174`), las peticiones del navegador serán bloqueadas por CORS. Si te pasa, ajusta
> el `origin` en `src/index.js` al puerto real que te muestra Vite en consola, o forzá el puerto
> del frontend con `vite --port 5174` / `server.port` en `vite.config.js`.

## Formato de respuesta

Todas las rutas responden con el mismo sobre, generado por `helpers/response.js`:

```json
{ "ok": true, "data": { }, "msg": "Tarea creada correctamente" }
```

- `ok`: `true` si la operación fue exitosa, `false` en cualquier error (validación, no encontrado,
  error interno).
- `data`: la tarea, el arreglo de tareas, o `null` cuando no aplica (por ejemplo en un error).
- `msg`: mensaje legible para mostrar al usuario.

Los errores de validación de `yup` (middleware) usan una forma ligeramente distinta, con un
arreglo `errors` por campo:

```json
{
  "ok": false,
  "msg": "Error de validacion",
  "errors": [
    { "field": "title", "message": "El titulo es requerido" }
  ]
}
```

## Endpoints

Base path: `/tasks`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Lista todas las tareas, ordenadas por `createdAt` descendente |
| `POST` | `/` | Crea una tarea (valida con `createTaskSchema`) |
| `GET` | `/:id` | Obtiene una tarea por id |
| `PUT` | `/:id` | Actualiza una tarea, campos parciales (valida con `updateTaskSchema`) |
| `DELETE` | `/:id` | Elimina una tarea |
| `GET` | `/title/:title` | Busca tareas por título exacto |
| `GET` | `/status/:status` | Busca tareas por estado (`pendiente` \| `completada`) |
| `GET` | `/description/:description` | Busca tareas por descripción exacta |
| `GET` | `/creationDate/:creationDate` | Busca tareas por fecha de creación exacta (`createdAt`) |
| `GET` | `/updateDate/:updateDate` | Busca tareas por fecha de actualización exacta (`updatedAt`) |

> Las rutas `title/description/creationDate/updateDate` hacen match exacto (no búsqueda parcial),
> y `creationDate`/`updateDate` deben mandarse como el timestamp ISO exacto guardado por Mongoose
> — en la práctica son poco prácticas de usar desde una UI de búsqueda libre; `status` es la única
> que realmente usa el frontend hoy.

### Ejemplos

**Crear una tarea** — `POST /tasks`

```json
// Request body
{
  "title": "Reunión de equipo",
  "description": "Sync semanal",
  "status": "pendiente",
  "startDate": "2026-07-15",
  "endDate": "2026-07-15",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

```json
// 201 Created
{
  "ok": true,
  "msg": "Tarea creada correctamente",
  "data": {
    "_id": "6a51673e7a0449babdf62ed5",
    "title": "Reunión de equipo",
    "description": "Sync semanal",
    "status": "pendiente",
    "startDate": "2026-07-15T05:00:00.000Z",
    "endDate": "2026-07-15T05:00:00.000Z",
    "startTime": "09:00",
    "endTime": "10:00",
    "createdAt": "2026-07-10T21:42:22.879Z",
    "updatedAt": "2026-07-10T21:42:22.879Z",
    "__v": 0
  }
}
```

**Solapamiento de horario** — `POST /tasks` con un horario que choca con una tarea existente del
mismo día:

```json
// 400 Bad Request
{ "ok": false, "data": null, "msg": "Ya existe una tarea programada en ese horario: \"Reunión de equipo\"." }
```

**Tarea no encontrada** — `GET /tasks/:id`, `PUT /tasks/:id` o `DELETE /tasks/:id` con un id que no
existe:

```json
// 404 Not Found
{ "ok": false, "data": null, "msg": "Tarea no encontrada" }
```

## Modelo de tarea

| Campo | Tipo | Notas |
|---|---|---|
| `title` | `String` | Requerido |
| `description` | `String` | Requerido a nivel de servicio; por defecto `"sin descripcion"` a nivel de schema si no se manda |
| `status` | `String` | Enum: `pendiente` (por defecto) \| `completada` |
| `startDate` / `endDate` | `Date` | Opcionales |
| `startTime` / `endTime` | `String` | Opcionales, formato `HH:mm` (24h) |
| `createdAt` / `updatedAt` | `Date` | Automáticos (`timestamps: true` en el schema) |

## Reglas de validación y de negocio

**Validación de forma (yup, en `task.schema.valitation.js`)**, aplicada por el middleware antes de
llegar al controller:

- `title`: requerido (solo en `create`), 3–100 caracteres, solo letras/números/acentos/puntuación
  básica.
- `description`: 3–500 caracteres, mismo set de caracteres permitido.
- `status`: solo `pendiente` o `completada`.
- `startDate` / `endDate`: deben ser fechas válidas si se envían; `endDate` no puede ser anterior a
  `startDate` (solo se compara si `startDate` también viene en la petición).
- `startTime` / `endTime`: formato `HH:mm` si se envían (string vacío se trata como "no enviado").

**Reglas de negocio (en `helpers/task.helpers.js`, corridas dentro del service)**, solo quando la
tarea tiene los 4 campos de horario completos:

- La hora de finalización debe ser **posterior** a la hora de inicio (no solo distinta).
- El rango `[fecha+hora inicio, fecha+hora fin)` no puede solaparse con el de ninguna otra tarea
  existente. La comparación es a nivel de fecha y, en caso de empate, de hora — dos tareas pueden
  terminar y empezar exactamente a la misma hora sin considerarse solapadas.
- Al **crear**, siempre se valida si los 4 campos vienen completos.
- Al **actualizar**, solo se revalida si la petición realmente toca alguno de los 4 campos
  (`startDate`, `endDate`, `startTime`, `endTime`); los valores que no cambian se completan con los
  que ya tenía la tarea antes de comparar. La propia tarea se excluye de la búsqueda de
  solapamiento por `_id`, para no chocar consigo misma.

## Manejo de errores

- **Errores de validación de forma** (`yup`, vía middleware): `400`, con `errors` por campo.
- **Errores de negocio** (título/descripción faltante, horario inválido, solapamiento, no
  encontrado): `400` o `404`, con `msg` describiendo el problema puntual — el `catch` de cada
  service nunca los intercepta porque se devuelven con `return` antes de que ocurra una excepción.
- **Errores inesperados** (fallo de conexión a la base, bug, etc.): capturados por `catchAsync`,
  logueados con `console.error` y devueltos como `500` con un mensaje genérico por endpoint (ej.
  `"Error al crear la tarea"`), sin filtrar detalles internos al cliente.

## Testing

`tests/tast.e2e.test.js` usa Jest + Supertest para probar el flujo completo (crear, listar, obtener
por id, actualizar, eliminar, y las búsquedas por status/title/description/fechas) montando la app
de Express directamente (sin levantar un puerto) contra una base de datos **real**, definida por
`MONGO_URI_TEST`/`DATABASE_NAME_TEST`. Al terminar, `afterAll` hace `dropDatabase()` — usa una base
dedicada a pruebas, nunca la misma que `DATABASE_NAME`, para no perder datos.

```bash
npm test
```
