# Task Manager — Frontend

Interfaz web para gestionar tareas: crear, editar, eliminar, filtrar por estado y programar
fecha/hora de inicio y fin. Consume la API del [backend](../backend).

## Índice

- [Stack](#stack)
- [Arquitectura y flujo de datos](#arquitectura-y-flujo-de-datos)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Capa de datos (`api/`)](#capa-de-datos-api)
- [Hooks](#hooks)
- [Componentes](#componentes)
- [Validación de formularios](#validación-de-formularios)
- [Manejo de errores](#manejo-de-errores)
- [Utilidades de fecha/hora](#utilidades-de-fechahora)
- [Estilos](#estilos)
- [Testing](#testing)
- [Limitaciones conocidas](#limitaciones-conocidas)

## Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/) — build y dev server
- [Tailwind CSS 4](https://tailwindcss.com/) (`@tailwindcss/vite`) — estilos utilitarios
- [react-hook-form](https://react-hook-form.com/) — estado y envío del formulario de tareas
- [yup](https://github.com/jquense/yup) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers) — validación del formulario
- [axios](https://axios-http.com/) — cliente HTTP hacia el backend
- [date-fns](https://date-fns.org/) (locale `es`) — formateo de fechas/horas
- [SweetAlert2](https://sweetalert2.github.io/) — notificaciones de éxito/error
- [lucide-react](https://lucide.dev/) — iconos

## Arquitectura y flujo de datos

```
api/tasksApi.js  →  hooks/*  →  App.jsx  →  components/*
```

- **`api/`** es la única capa que sabe hablar HTTP (axios). No tiene lógica de UI ni de negocio.
- **`hooks/`** consumen `api/` y exponen estado + acciones ya listas para usar en JSX (nada de
  axios ni de `Swal` debería aparecer fuera de esta capa y de `api/`).
- **`App.jsx`** solo invoca los 3 hooks y pasa sus valores como props a los componentes — no tiene
  estado propio ni lógica.
- **`components/`** son mayormente presentacionales: reciben datos y callbacks por props y no
  llaman a la API directamente (excepción: `TaskFormModal` recibe el objeto `form` completo del
  hook `useTaskForm` tal cual, para no tener que repetir cada campo como prop suelta).

Este orden importa para saber dónde tocar cada tipo de cambio: un campo nuevo en el formulario
toca `validation/taskSchema.js` + `hooks/useTaskForm.js` + `components/TaskFormModal.jsx`; un
endpoint nuevo toca `api/tasksApi.js` + el hook que lo vaya a usar.

## Requisitos previos

- Node.js 18+
- El [backend](../backend) corriendo en `http://localhost:3000` — la URL está fija en
  `src/main.jsx` (`axios.defaults.baseURL`), no hay variable de entorno para configurarla.
- El backend solo acepta peticiones CORS desde `http://localhost:5174`. Si `npm run dev` te
  levanta el frontend en otro puerto (por ejemplo el `5173` por defecto de Vite), las peticiones
  fallarán por CORS — ver la nota en el [README del backend](../backend/README.md#cors).

## Puesta en marcha

```bash
npm install
npm run dev
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | ESLint sobre todo el proyecto (incluye `eslint-plugin-react-hooks` en modo estricto) |
| `npm run preview` | Sirve el build de producción localmente |

## Estructura del proyecto

```
src/
  main.jsx                  # entrypoint: monta <App /> y fija axios.defaults.baseURL
  App.jsx                    # compone los hooks y componentes de la página, sin lógica propia
  api/
    tasksApi.js                # getTasks, createTask, updateTask, deleteTask (axios puro)
  hooks/
    useTasks.js                 # carga de tareas + filtro por estado
    useTaskForm.js                # modal crear/editar: react-hook-form + yup + llamadas a la API
    useDeleteTask.js                # modal de confirmación de borrado + llamada a la API
  validation/
    taskSchema.js                    # schema de yup (misma reglas que el backend)
  utils/
    dateUtils.js                      # formateo de fechas/horas, franjas horarias del selector
    errorUtils.js                      # extrae el mensaje de error real de la respuesta del backend
  components/
    Header.jsx                          # título y subtítulo de la página
    TaskToolbar.jsx                       # botón "Crear Tarea" + botones de filtro por estado
    TaskTable.jsx                          # tabla de tareas (usa StatusBadge)
    StatusBadge.jsx                          # badge "Pendiente" / "Completado"
    TaskFormModal.jsx                          # modal de crear/editar tarea
    DeleteTaskModal.jsx                          # modal de confirmación de borrado
```

## Capa de datos (`api/`)

`api/tasksApi.js` expone una función por operación, cada una devuelve la promesa de axios tal cual
(sin desenvolver `response.data`):

```js
getTasks()              // GET  /tasks
createTask(task)        // POST /tasks
updateTask(id, task)    // PUT  /tasks/:id
deleteTask(id)          // DELETE /tasks/:id
```

## Hooks

### `useTasks()`

Carga la lista de tareas al montar y expone el filtro por estado.

```js
const { filteredTasks, isLoading, filter, setFilter, loadTasks } = useTasks();
```

- `filteredTasks`: tareas ya filtradas según `filter` (`"todas" | "pendiente" | "completada"`).
- `isLoading`: `true` mientras `loadTasks()` está en vuelo (para el overlay de carga de la tabla).
- `loadTasks`: vuelve a pedir la lista al backend; se pasa como callback a los otros dos hooks para
  refrescar la tabla después de crear/editar/eliminar.

### `useTaskForm(onSaved)`

Encapsula el modal de crear/editar y el formulario (react-hook-form + `taskSchema`).

```js
const form = useTaskForm(loadTasks);
```

Devuelve, entre otros: `isModalOpen`, `isEditing`, `register`, `errors`, `isSubmitting`,
`startDateField`/`startDateValue`/`handleStartDateChange` (para encadenar el `min` de "Fecha fin"
al valor de "Fecha inicio" y limpiarla si queda inválida), `handleFormSubmit`, `onSubmit`,
`openCreateModal`, `openEditModal(task)`, `closeModal`. Se le pasa entero al componente
`TaskFormModal` vía `<TaskFormModal form={form} />`.

### `useDeleteTask(onDeleted)`

Encapsula el modal de confirmación de borrado.

```js
const deleteState = useDeleteTask(loadTasks);
```

Devuelve `isModalOpen`, `taskToDelete`, `openDeleteModal(task)`, `closeDeleteModal`,
`handleDelete`.

## Componentes

| Componente | Props | Responsabilidad |
|---|---|---|
| `Header` | — | Título y subtítulo estáticos |
| `TaskToolbar` | `filter`, `onFilterChange`, `onCreateClick` | Botón "Crear Tarea" + botones de filtro |
| `TaskTable` | `tasks`, `isLoading`, `onEdit`, `onDelete` | Tabla completa, delega el badge de estado a `StatusBadge` |
| `StatusBadge` | `status` | Badge visual según `"pendiente"` / `"completada"` |
| `TaskFormModal` | `form` (objeto de `useTaskForm`) | Modal de crear/editar, un solo `<form>` para ambos casos |
| `DeleteTaskModal` | `isOpen`, `task`, `onCancel`, `onConfirm` | Modal de confirmación de borrado |

## Validación de formularios

`src/validation/taskSchema.js` replica las reglas del backend
(`backend/src/tasks/validation/task.schema.valitation.js`):

- `title`: requerido, 3–100 caracteres, mismo set de caracteres permitido que el backend.
- `description`: requerido *(en el frontend se exige aunque el schema de yup del backend no lo
  marque `required`, porque el `service` del backend igual rechaza una tarea sin descripción — se
  prefiere avisar antes de enviar)*, 3–500 caracteres.
- `status`: `pendiente` \| `completada`.
- `startDate` / `endDate`: fechas válidas; `endDate` no puede ser anterior a `startDate`.
- `startTime` / `endTime`: formato `HH:mm`; además, solo en el frontend, se valida que la hora de
  fin sea **posterior** a la de inicio (esta regla vive en el backend a nivel de service, no de
  `yup`, así que se duplicó aquí a mano para dar feedback inmediato).

Lo que el frontend **no** puede validar de antemano es el solapamiento de horario con otra tarea
(requiere consultar el backend), así que ese error solo se ve después de enviar el formulario —
ver [Manejo de errores](#manejo-de-errores).

## Manejo de errores

`utils/errorUtils.js` → `getErrorMessage(error, fallback)` inspecciona
`error.response.data` de axios:

- Si trae `errors` (array de `{ field, message }`, formato del middleware de validación del
  backend), concatena todos los `message`.
- Si trae `msg` (formato de negocio: 404, solapamiento, etc.), lo usa tal cual.
- Si no hay respuesta del servidor (backend caído, CORS, etc.), usa el `fallback`.

Tanto `useTaskForm` como `useDeleteTask` muestran ese mensaje en un `Swal.fire({ icon: "error", ... })`.

## Utilidades de fecha/hora

`utils/dateUtils.js`:

- `toDateInputValue(isoDate)`: ISO del backend → `yyyy-MM-dd` para `<input type="date">`.
- `formatDate(isoDate)`: ISO → `dd/MM/yyyy` para mostrar en la tabla.
- `formatTime(time)`: `"HH:mm"` → `"hh:mm a"` (ej. `09:00 AM`) para mostrar en la tabla.
- `TIME_OPTIONS`: 96 franjas horarias cada 15 minutos (`00:00` a `23:45`), usadas por los `<select>`
  de hora en el formulario en vez de un `<input type="time">` nativo.

## Estilos

Tailwind CSS 4 vía `@tailwindcss/vite`, sin configuración adicional (`src/index.css` solo tiene
`@import "tailwindcss";`). No hay un design system ni componentes de UI reutilizables aparte de
`StatusBadge`; las clases utilitarias se repiten inline en cada componente.

## Testing

No hay tests automatizados en el frontend todavía. Las validaciones se probaron manualmente y por
integración directa contra el backend real durante el desarrollo (ver historial de cambios); si se
agregan tests, [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) es
la combinación más natural dado que ya se usa Vite.

## Limitaciones conocidas

- El filtro de la tabla solo es por `status`; no hay búsqueda por título/descripción en la UI
  (aunque el backend expone esos endpoints).
- La URL del backend está hardcodeada en `main.jsx`, no hay `.env`/`import.meta.env` para
  distintos entornos (dev/staging/prod).
- No hay paginación: `getTasks()` trae todas las tareas en una sola respuesta.
