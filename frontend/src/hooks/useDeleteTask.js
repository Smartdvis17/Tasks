import { useState } from "react";
import Swal from "sweetalert2";
import { deleteTask } from "../api/tasksApi";
import { getErrorMessage } from "../utils/errorUtils";

// Encapsula el modal de confirmacion de borrado y la peticion de eliminar
export const useDeleteTask = (onDeleted) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      const { data } = await deleteTask(taskToDelete._id);
      Swal.fire({
        position: "top",
        icon: "success",
        title: data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      onDeleted();
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      Swal.fire({
        position: "top",
        icon: "error",
        title: "No se pudo eliminar la tarea",
        text: getErrorMessage(error, "Ocurrió un error inesperado."),
      });
    }
  };

  return { isModalOpen, taskToDelete, openDeleteModal, closeDeleteModal, handleDelete };
};
