import { useEffect, useState } from "react";
import { getTasks } from "../api/tasksApi";

// Encapsula la carga de tareas desde el backend y el filtro seleccionado
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("todas");

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await getTasks();
      setTasks(data.data);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend al montar
    loadTasks();
  }, []);

  const filteredTasks =
    filter === "todas" ? tasks : tasks.filter((task) => task.status === filter);

  return { filteredTasks, isLoading, filter, setFilter, loadTasks };
};
