
export const validationSchema = (schema) => {
    return async (req, res, next) => {
        try {
            // Validar el cuerpo de la solicitud utilizando el esquema proporcionado
        const resultValidate = await schema.validate(req.body,{
            abortEarly: false, // Validar todos los errores en lugar de detenerse en el primero
            stripUnknown: true, // Eliminar campos desconocidos
        });
        req.body = resultValidate;
        next();
    } catch (error) {
       console.log(error.inner);
       return res.status(400).send(
        {
            ok: false,
            msg: "Error de validacion",
            errors: error.inner.map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
        }
};
};