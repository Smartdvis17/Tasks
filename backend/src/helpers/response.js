export const response = (res, statusCode, ok, data, msg) => {
    return res.status(statusCode).send({
        ok,
        data,
        msg
    });
}