import { Plus, Filter } from "lucide-react";

const FILTER_OPTIONS = [
  { value: "todas", label: "Todas", activeClass: "bg-blue-600 text-white" },
  { value: "pendiente", label: "Pendientes", activeClass: "bg-yellow-600 text-white" },
  { value: "completada", label: "Completadas", activeClass: "bg-green-600 text-white" },
];

function TaskToolbar({ filter, onFilterChange, onCreateClick }) {
  return (
    <div className="mb-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-300"
          onClick={onCreateClick}
        >
          <Plus className="mr-2 w-4 h-4" />
          Crear Tarea
        </button>

        <div className="flex items-center gap-2">
          <Filter className="mr-2 w-4 h-4 text-gray-400" />
          <span className="text-gray-700 font-medium text-sm">Filtrar:</span>
          {FILTER_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex rounded-lg border border-gray-300 overflow-hidden"
            >
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  filter === option.value
                    ? option.activeClass
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onFilterChange(option.value)}
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskToolbar;
