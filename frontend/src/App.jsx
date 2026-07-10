import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Trash2, Pencil, Check, X, Filter } from "lucide-react";
function App() {
  // Estados para guardar las tareas que llegan desde el backend
  const [tasks, setTasks] = useState([]);

  // Estado para controlar el modal de guardar y editar tareas
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  Estado para saber si estoy guardando o editando una tarea
  const [editingTask, setEditingTask] = useState(false);

  // Estado para saber la seleccion del filtro
  const [filter, setFilter] = useState("todas");

  // Estado de carga cuando se obtienen las tareas desde el backend
  const [isLoading, setIsLoading] = useState(false);

  // Estado para saber si estoy creando o actualiando una tarea
  const [isCreateUpdate, setIsCreateUpdate] = useState(false);

  // Estado para guardar el titulo, descripcion y estado de la tarea que se esta editando
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pendiente",
  });

  // Estado para controlar el modal de eliminar tareas
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  // Estado para guardar la tarea que se va a eliminar
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Funcion que hace la peticion al backend para obtener todas las tareas
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/tasks");
      setTasks(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend al montar
    loadTasks();
  }, []);

  // Tareas filtradas segun el filtro seleccionado (derivado, no requiere estado propio)
  const filteredTasks =
    filter === "todas"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  //Funcion para abrir el modal para crear una tarea
  const openCreateModal = () => {
    setEditingTask(false);
    setFormData({
      title: "",
      description: "",
      status: "pendiente",
    });
    setIsModalOpen(true);
  };

  //Editar el modal para editar una tarea
  const openEditModal = (task) => {
    setEditingTask(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setIsModalOpen(true);
  };

  // funcion para cerrar el modal de crear o editar una tarea
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(false);
    setFormData({
      title: "",
      description: "sin descripcion",
      status: "pendiente",
    });
  };

  // Actualiza formData cuando el usuario escribe en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Metodo para crear una tarea o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreateUpdate(true);
      const method = editingTask ? "put" : "post";
      const url = editingTask ? `/tasks/${editingTask}` : "/tasks";
      const { data } = await axios[method](url, formData);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      loadTasks();
      closeModal();
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo guardar la tarea",
      });
    } finally {
      setIsCreateUpdate(false);
    }
  };

  // Abre el modal de confirmacion para eliminar una tarea
  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsModalDeleteOpen(true);
  };

  // Cierra el modal de confirmacion de eliminar
  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsModalDeleteOpen(false);
  };

  // Elimina la tarea seleccionada
  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      const { data } = await axios.delete(`/tasks/${taskToDelete._id}`);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      loadTasks();
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar la tarea",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestor de Tareas
          </h1>
          <p className="text-gray-600">
            Administra tus tareas de forma eficiente
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-300"
              onClick={openCreateModal}
            >
              <Plus className="mr-2 w-4 h-4" />
              Crear Tarea
            </button>

            {/* Filtros */}
            <div className="flex items-center gap-2">
              <Filter className="mr-2 w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium text-sm">
                Filtrar:
              </span>
              {/* Botones de filtro */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-300 ${
                    filter === "todas"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setFilter("todas")}
                >
                  Todas
                </button>
              </div>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    filter === "pendiente"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setFilter("pendiente")}
                >
                  Pendientes
                </button>
              </div>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "completada"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setFilter("completada")}
                >
                  Completadas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de tareas */}
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Título
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descripción
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No hay tareas para mostrar
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
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
                        {task.status === "pendiente" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            aria-label="Editar tarea"
                            onClick={() => openEditModal(task)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            aria-label="Eliminar tarea"
                            onClick={() => openDeleteModal(task)}
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
      </div>

      {/* Modal de crear/editar tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingTask ? "Editar Tarea" : "Crear Tarea"}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreateUpdate}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  <Check className="mr-2 w-4 h-4" />
                  {isCreateUpdate ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmacion de eliminar tarea */}
      {isModalDeleteOpen && taskToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Eliminar Tarea
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la tarea "
              {taskToDelete.title}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 cursor-pointer"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
