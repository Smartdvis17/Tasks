import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatTime } from "../utils/dateUtils";

const COLUMNS = [
  "ID",
  "Título",
  "Descripción",
  "Estado",
  "Fecha inicio",
  "Fecha fin",
  "Hora inicio",
  "Hora fin",
];

function TaskTable({ tasks, isLoading, onEdit, onDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length + 1}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No hay tareas para mostrar
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500"
                    title={task._id}
                  >
                    {task._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td
                    className="px-6 py-4 max-w-xs truncate text-sm text-gray-500"
                    title={task.description}
                  >
                    {task.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.startDate ? formatDate(task.startDate) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.endDate ? formatDate(task.endDate) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.startTime ? formatTime(task.startTime) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.endTime ? formatTime(task.endTime) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        aria-label="Editar tarea"
                        onClick={() => onEdit(task)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        aria-label="Eliminar tarea"
                        onClick={() => onDelete(task)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;
