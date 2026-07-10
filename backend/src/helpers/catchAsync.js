import { response } from './response.js';

// Envuelve un handler de ruta para no repetir el mismo try/catch + log + respuesta 500
// en cada funcion del servicio.
export const catchAsync = (handler, errorMessage) => async (req, res) => {
    try {
        return await handler(req, res);
    } catch (error) {
        console.error(error);
        return response(res, 500, false, null, errorMessage);
    }
};
