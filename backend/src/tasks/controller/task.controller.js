import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByStatus,
    getTasksByTitle,
    getTasksByDescription,
    getTasksByCreationDate,
    getTasksByUpdateDate
} from '../services/task.service.js';



//Controlador para obtener todas las tareas
export const controllerGetTasks = async (req, res) => {
    return await getTasks(req, res);
}

//Controlador para crear una nueva tarea
export const controllerCreateTask = async (req, res) => {
    return await createTask(req, res);
}

//Controlador para editar una tarea existente
export const controllerUpdateTask = async (req, res) => {
    return await updateTask(req, res);
}

//Controlador para eliminar una tarea existente
export const controllerDeleteTask = async (req, res) => {
    return await deleteTask(req, res);
}

//Controlador para obtener una tarea por su id
export const controllerGetTaskById = async (req, res) => {
    return await getTaskById(req, res);
}

//Controlador para obtener todas las tareas por su estado
export const controllerGetTasksByStatus = async (req, res) => {
    return await getTasksByStatus(req, res);
}

//Controlador para obtener una tarea por su titulo
export const controllerGetTaskByTitle = async (req, res) => {
    return await getTasksByTitle(req, res);
}

//Controlador para obtener todas las tareas por su descripcion
export const controllerGetTasksByDescription = async (req, res) => {
    return await getTasksByDescription(req, res);
}

//Controlador para obtener todas las tareas por su fecha de creacion
export const controllerGetTasksByCreationDate = async (req, res) => {
    return await getTasksByCreationDate(req, res);
}

//Controlador para obtener todas las tareas por su fecha de actualizacion
export const controllerGetTasksByUpdateDate = async (req, res) => {
    return await getTasksByUpdateDate(req, res);
}
