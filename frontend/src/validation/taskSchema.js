import * as yup from "yup";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Convierte "HH:mm" a minutos desde medianoche, para comparar horas (mismo criterio que el backend)
const horaAMinutos = (hora) => {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
};

// Mismas reglas que backend/src/tasks/validation/task.schema.valitation.js,
// mas la comparacion hora fin > hora inicio para dar feedback inmediato en el formulario.
export const taskSchema = yup.object().shape({
  title: yup
    .string()
    .transform((value) => value?.trim())
    .required("El título es requerido")
    .matches(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¿?¡!_\-\s]+$/,
      "El título contiene caracteres inválidos."
    )
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título debe tener como maximo 100 caracteres"),

  description: yup
    .string()
    .transform((value) => value?.trim())
    .required("La descripción es requerida")
    .matches(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()¿?¡!_\-\s]+$/,
      "La descripción contiene caracteres inválidos."
    )
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(500, "La descripción debe tener como maximo 500 caracteres"),

  status: yup
    .string()
    .transform((value) => value?.toLowerCase())
    .oneOf(["pendiente", "completada"], "El status debe ser pendiente o completada"),

  startDate: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("La fecha de inicio no es válida"),

  endDate: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("La fecha de finalización no es válida")
    .when("startDate", {
      is: (value) => value !== undefined && value !== null,
      then: (schema) =>
        schema.min(yup.ref("startDate"), "La fecha de finalización no puede ser anterior a la fecha de inicio"),
    }),

  startTime: yup
    .string()
    .matches(timePattern, { message: "La hora de inicio debe tener el formato HH:mm", excludeEmptyString: true }),

  endTime: yup
    .string()
    .matches(timePattern, { message: "La hora de finalización debe tener el formato HH:mm", excludeEmptyString: true })
    .when("startTime", {
      is: (value) => !!value,
      then: (schema) =>
        schema.test(
          "es-posterior",
          "La hora de finalización debe ser posterior a la hora de inicio",
          function (endTime) {
            const { startTime } = this.parent;
            if (!endTime) return true;
            return horaAMinutos(endTime) > horaAMinutos(startTime);
          }
        ),
    }),
});

export const taskFormDefaultValues = {
  title: "",
  description: "",
  status: "pendiente",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
};
