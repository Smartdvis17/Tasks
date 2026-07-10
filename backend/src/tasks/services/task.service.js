import { response } from '../../helpers/response.js';
import { catchAsync } from '../../helpers/catchAsync.js';
import { taskModel } from '../model/taskModel.js';
import { findTaskOr404, validarHorario } from '../../helpers/task.helpers.js';

//Funcion para obtener todas las tareas
export const getTasks = catchAsync(async (req, res) => {
    const tasks = await taskModel.find().sort({ createdAt: -1 });
    return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
}, 'Error al obtener las tareas');

//Crear una nueva tarea
export const createTask = catchAsync(async (req, res) => {
    const { title, description, status, startDate, endDate, startTime, endTime } = req.body;
    if (!title || !description) {
        return response(res, 400, false, null, 'El título y la descripción son obligatorios');
    }

    const errorHorario = await validarHorario({ startDate, endDate, startTime, endTime });
    if (errorHorario) {
        return response(res, 400, false, null, errorHorario);
    }

    const newtask = new taskModel({ title, description, status, startDate, endDate, startTime, endTime });
    await newtask.save();
    return response(res, 201, true, newtask, 'Tarea creada correctamente');
}, 'Error al crear la tarea');

//Editar una tarea existente
export const updateTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, status, startDate, endDate, startTime, endTime } = req.body;
    const task = await findTaskOr404(id, res);
    if (!task) return;

    // Solo se revalida el horario si la petición realmente toca alguno de estos campos
    const seModificoHorario =
        startDate !== undefined || endDate !== undefined ||
        startTime !== undefined || endTime !== undefined;

    if (seModificoHorario) {
        const errorHorario = await validarHorario({
            excludeId: id,
            startDate: startDate !== undefined ? startDate : task.startDate,
            endDate: endDate !== undefined ? endDate : task.endDate,
            startTime: startTime !== undefined ? startTime : task.startTime,
            endTime: endTime !== undefined ? endTime : task.endTime,
        });
        if (errorHorario) {
            return response(res, 400, false, null, errorHorario);
        }
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (startDate !== undefined) task.startDate = startDate;
    if (endDate !== undefined) task.endDate = endDate;
    if (startTime !== undefined) task.startTime = startTime;
    if (endTime !== undefined) task.endTime = endTime;
    await task.save();
    return response(res, 200, true, task, 'Tarea actualizada correctamente');
}, 'Error al actualizar la tarea');

//Eliminar una tarea existente
export const deleteTask = catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await findTaskOr404(id, res);
    if (!task) return;

    await task.deleteOne();
    return response(res, 200, true, task, 'Tarea eliminada correctamente');
}, 'Error al eliminar la tarea');

//Obtener una tarea por su id
export const getTaskById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await findTaskOr404(id, res);
    if (!task) return;

    return response(res, 200, true, task, 'Tarea obtenida correctamente');
}, 'Error al obtener la tarea');

//Obtener tareas por su estado
export const getTasksByStatus = catchAsync(async (req, res) => {
    const { status } = req.params;
    const tasks = await taskModel.find({ status });
    return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
}, 'Error al obtener las tareas');

//Obtener tareas por su titulo
export const getTasksByTitle = catchAsync(async (req, res) => {
    const { title } = req.params;
    const tasks = await taskModel.find({ title });
    return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
}, 'Error al obtener las tareas');

//Obtener tareas por su descripcion
export const getTasksByDescription = catchAsync(async (req, res) => {
    const { description } = req.params;
    const tasks = await taskModel.find({ description });
    return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
}, 'Error al obtener las tareas');

//Obtener tareas por fecha de creacion
export const getTasksByCreationDate = catchAsync(async (req, res) => {
    const { creationDate } = req.params;
    const tasks = await taskModel.find({ createdAt: creationDate });
    return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
}, 'Error al obtener las tareas');

//Obtener tareas por fecha de actualizacion
export const getTasksByUpdateDate = catchAsync(async (req, res) => {
    const { updateDate } = req.params;
    const tasks = await taskModel.find({ updatedAt: updateDate });
    return response(res, 200, true, tasks, 'Tareas obtenidas correctamente');
}, 'Error al obtener las tareas');
