import { response } from './response.js';
import { taskModel } from '../tasks/model/taskModel.js';

// Busca una tarea por id; si no existe, ya envia la respuesta 404 y devuelve null.
// El caller solo debe hacer `if (!task) return;` para cortar el flujo.
export const findTaskOr404 = async (id, res) => {
    const task = await taskModel.findById(id);
    if (!task) {
        response(res, 404, false, null, 'Tarea no encontrada');
        return null;
    }
    return task;
};

// Convierte una hora "HH:mm" a minutos desde medianoche, para poder comparar horas
const horaAMinutos = (hora) => {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
};

// Busca una tarea existente cuyo rango fecha+hora se solape con el rango recibido.
// Dos rangos [inicio, fin) se solapan si (inicioA < finB) y (finA > inicioB),
// comparando primero la fecha y, en caso de empate de fecha, la hora.
const buscarTareaSuperpuesta = async ({ excludeId, startDate, endDate, startTime, endTime }) => {
    const query = {
        startDate: { $ne: null },
        endDate: { $ne: null },
        startTime: { $ne: null },
        endTime: { $ne: null },
        $and: [
            {
                $or: [
                    { startDate: { $lt: endDate } },
                    { startDate: endDate, startTime: { $lt: endTime } },
                ],
            },
            {
                $or: [
                    { endDate: { $gt: startDate } },
                    { endDate: startDate, endTime: { $gt: startTime } },
                ],
            },
        ],
    };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return taskModel.findOne(query);
};

// Valida hora fin > hora inicio y que no haya solapamiento de horario con otra tarea.
// Devuelve un mensaje de error (string) si algo falla, o null si todo está bien.
export const validarHorario = async ({ excludeId, startDate, endDate, startTime, endTime }) => {
    if (!startDate || !endDate || !startTime || !endTime) {
        return null; // sin rango completo no hay nada que validar
    }

    if (horaAMinutos(endTime) <= horaAMinutos(startTime)) {
        return 'La hora de finalización debe ser posterior a la hora de inicio.';
    }

    const tareaSuperpuesta = await buscarTareaSuperpuesta({ excludeId, startDate, endDate, startTime, endTime });
    if (tareaSuperpuesta) {
        return `Ya existe una tarea programada en ese horario: "${tareaSuperpuesta.title}".`;
    }

    return null;
};
