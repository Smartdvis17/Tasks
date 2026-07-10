import * as yup from 'yup';

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTaskSchema = yup.object().shape({
    title:
    yup.string()
    .transform((value) => value.trim())
    .required('El titulo es requerido')
    .matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¿?¡!_\-\s]+$/,
        "El titulo contiene caracteres inválidos."
    )
    .min(3, 'El titulo debe tener al menos 3 caracteres')
    .max(100, 'El titulo debe tener como maximo 100 caracteres'),

    description:
    yup.string()
    .transform((value) => value.trim())
    .matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¿?¡!_\-\s]+$/,
        "La descripción contiene caracteres inválidos."
    )
    .min(3, 'La descripcion debe tener al menos 3 caracteres')
    .max(500, 'La descripcion debe tener como maximo 500 caracteres'),
    status: yup.string()
    .transform((value) => value.toLowerCase())
    .oneOf(['pendiente', 'completada'], 'El status debe ser pendiente o completada'),

    startDate: yup.date()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('La fecha de inicio no es válida'),

    endDate: yup.date()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('La fecha de finalización no es válida')
    .when('startDate', {
        is: (value) => value !== undefined && value !== null,
        then: (schema) => schema.min(yup.ref('startDate'), 'La fecha de finalización no puede ser anterior a la fecha de inicio'),
    }),

    startTime: yup.string()
    .matches(timePattern, { message: 'La hora de inicio debe tener el formato HH:mm', excludeEmptyString: true }),

    endTime: yup.string()
    .matches(timePattern, { message: 'La hora de finalización debe tener el formato HH:mm', excludeEmptyString: true })
});

export const updateTaskSchema = yup.object().shape({
    title:
    yup.string()
    .transform((value) => value.trim())
    .matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¿?¡!_\-\s]+$/,
        "El titulo contiene caracteres inválidos."
    )
    .min(3, 'El titulo debe tener al menos 3 caracteres')
    .max(100, 'El titulo debe tener como maximo 100 caracteres'),
    description:
    yup.string()
    .transform((value) => value.trim())
    .matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¿?¡!_\-\s]+$/,
        "La descripción contiene caracteres inválidos."
    )
    .min(3, 'La descripcion debe tener al menos 3 caracteres')
    .max(500, 'La descripcion debe tener como maximo 500 caracteres'),
    status: yup.string()
    .transform((value) => value.toLowerCase())
    .oneOf(['pendiente', 'completada'], 'El status debe ser pendiente o completada'),

    startDate: yup.date()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('La fecha de inicio no es válida'),

    endDate: yup.date()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .typeError('La fecha de finalización no es válida')
    .when('startDate', {
        is: (value) => value !== undefined && value !== null,
        then: (schema) => schema.min(yup.ref('startDate'), 'La fecha de finalización no puede ser anterior a la fecha de inicio'),
    }),

    startTime: yup.string()
    .matches(timePattern, { message: 'La hora de inicio debe tener el formato HH:mm', excludeEmptyString: true }),

    endTime: yup.string()
    .matches(timePattern, { message: 'La hora de finalización debe tener el formato HH:mm', excludeEmptyString: true })
});