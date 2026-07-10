import { Trash2 } from "lucide-react";

function DeleteTaskModal({ isOpen, task, onCancel, onConfirm }) {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Tarea</h2>
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar la tarea "{task.title}"? Esta acción no se puede
          deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 cursor-pointer"
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
