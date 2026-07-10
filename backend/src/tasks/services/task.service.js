import { response } from '../../helpers/response.js';
import { taskModel } from '../model/taskModel.js';


//Funcion para obtener todas las tareas
export const getTasks = async (req, res ) => {
    try {
        const tasks = await taskModel.find().sort({ createdAt: -1 });
  return response(res, 200, true, tasks, 'Tareas obtenidas correctamente'); 

    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener las tareas');
    }
}

//Crear una nueva tarea
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        if (!title || !description) {
            return response(res, 400, false, null, 'El título y la descripción son obligatorios');
        }
        const newtask = new taskModel({ title, description, status });
        await newtask.save();
        return response(res, 201, true, newtask, 'Tarea creada correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al crear la tarea');
    }
}

//Editar una tarea existente
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const task = await taskModel.findById(id);
        if (!task) {
            return response(res, 404, false, null, 'Tarea no encontrada');
        }
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        await task.save();
        return response(res, 200, true, task, 'Tarea actualizada correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al actualizar la tarea');
    }
}

//Eliminar una tarea existente
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel.findById(id);
        if (!task) {
            return response(res, 404, false, null, 'Tarea no encontrada');
        }
        await task.deleteOne();
        return response(res, 200, true, task, 'Tarea eliminada correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al eliminar la tarea');
    }
}

//Obtener una tarea por su id
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskModel.findById(id);
        if (!task) {
            return response(res, 404, false, null, 'Tarea no encontrada');
        }
        return response(res, 200, true, task, 'Tarea obtenida correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener la tarea');
    }
}

//Obtener tareas por su estado
export const getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const tasks = await taskModel.find({ status });
        return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener las tareas');
    }
}

//Obtener tareas por su titulo
export const getTasksByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        const tasks = await taskModel.find({ title });
        return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener las tareas');
    }
}

//Obtener tareas por su descripcion
export const getTasksByDescription = async (req, res) => {
    try {
        const { description } = req.params;
        const tasks = await taskModel.find({ description });
        return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener las tareas');
    }
}

//Obtener tareas por fecha de creacion
export const getTasksByCreationDate = async (req, res) => {
    try {
        const { creationDate } = req.params;
        const tasks = await taskModel.find({ createdAt: creationDate });
        return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener las tareas');
    }
}


//Obtener tareas por fecha de actualizacion
export const getTasksByUpdateDate = async (req, res) => {
    try {
        const { updateDate } = req.params;
        const tasks = await taskModel.find({ updatedAt: updateDate });
        return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
    } catch (error) {
        console.log(error);
        return response(res, 500, false, null, 'Error al obtener las tareas');
    }
}