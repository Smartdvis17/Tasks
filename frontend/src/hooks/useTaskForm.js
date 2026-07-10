import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { createTask, updateTask } from "../api/tasksApi";
import { taskSchema, taskFormDefaultValues } from "../validation/taskSchema";
import { toDateInputValue } from "../utils/dateUtils";
import { getErrorMessage } from "../utils/errorUtils";

// Encapsula el modal de crear/editar tarea: estado del modal + formulario (react-hook-form + yup)
export const useTaskForm = (onSaved) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: taskFormDefaultValues,
  });
  const startDateField = register("startDate");
  const startDateValue = watch("startDate");

  const openCreateModal = () => {
    setEditingTask(false);
    reset(taskFormDefaultValues);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task._id);
    reset({
      title: task.title,
      description: task.description,
      status: task.status,
      startDate: toDateInputValue(task.startDate),
      endDate: toDateInputValue(task.endDate),
      startTime: task.startTime || "",
      endTime: task.endTime || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(false);
    reset(taskFormDefaultValues);
  };

  // Si se cambia la fecha de inicio y deja a la fecha de fin antes de esa fecha, se limpia
  const handleStartDateChange = (e) => {
    startDateField.onChange(e);
    const nuevaStartDate = e.target.value;
    const endDateActual = getValues("endDate");
    if (endDateActual && endDateActual < nuevaStartDate) {
      setValue("endDate", "");
    }
  };

  // Ya validado por taskSchema (yup) antes de llegar aqui
  const onSubmit = async (formValues) => {
    try {
      const { data } = editingTask
        ? await updateTask(editingTask, formValues)
        : await createTask(formValues);
      Swal.fire({
        position: "top",
        icon: "success",
        title: data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      onSaved();
      closeModal();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar la tarea",
        text: getErrorMessage(error, "Ocurrió un error inesperado."),
      });
    }
  };

  return {
    isModalOpen,
    isEditing: Boolean(editingTask),
    register,
    errors,
    isSubmitting,
    startDateField,
    startDateValue,
    handleStartDateChange,
    handleFormSubmit,
    onSubmit,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};
