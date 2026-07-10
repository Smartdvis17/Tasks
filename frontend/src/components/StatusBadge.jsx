function StatusBadge({ status }) {
  if (status === "pendiente") {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pendiente
      </span>
    );
  }

  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
      Completado
    </span>
  );
}

export default StatusBadge;
