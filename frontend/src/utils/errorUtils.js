// Extrae el mensaje de error real que envia el backend (validacion de yup o mensaje de negocio)
export const getErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message).join(" ");
  }
  return data.msg || fallback;
};
