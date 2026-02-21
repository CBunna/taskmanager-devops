const TaskCard = ({ task, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="text-xs text-gray-500 mb-3">
          Due: {formatDate(task.dueDate)}
        </p>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
