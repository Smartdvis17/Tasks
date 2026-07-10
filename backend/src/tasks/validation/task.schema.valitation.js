import * as yup from 'yup';

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
    .oneOf(['pendiente', 'completada'], 'El status debe ser pendiente o completada')
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
    .oneOf(['pendiente', 'completada'], 'El status debe ser pendiente o completada')
});