import Header from "./components/Header";
import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import TaskFormModal from "./components/TaskFormModal";
import DeleteTaskModal from "./components/DeleteTaskModal";
import { useTasks } from "./hooks/useTasks";
import { useTaskForm } from "./hooks/useTaskForm";
import { useDeleteTask } from "./hooks/useDeleteTask";

function App() {
  const { filteredTasks, isLoading, filter, setFilter, loadTasks } = useTasks();
  const form = useTaskForm(loadTasks);
  const deleteState = useDeleteTask(loadTasks);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        <TaskToolbar
          filter={filter}
          onFilterChange={setFilter}
          onCreateClick={form.openCreateModal}
        />

        <TaskTable
          tasks={filteredTasks}
          isLoading={isLoading}
          onEdit={form.openEditModal}
          onDelete={deleteState.openDeleteModal}
        />
      </div>

      <TaskFormModal form={form} />

      <DeleteTaskModal
        isOpen={deleteState.isModalOpen}
        task={deleteState.taskToDelete}
        onCancel={deleteState.closeDeleteModal}
        onConfirm={deleteState.handleDelete}
      />
    </div>
  );
}

export default App;
