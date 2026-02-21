import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { taskAPI } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.create(taskData);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskAPI.update(selectedTask.id, taskData);
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalSave = (taskData) => {
    if (selectedTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' },
    { id: 'done', title: 'Done', status: 'done' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            + New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4 text-gray-700">
                {column.title}
                <span className="ml-2 text-sm text-gray-500">
                  ({getTasksByStatus(column.status).length})
                </span>
              </h2>

              <div className="space-y-3">
                {getTasksByStatus(column.status).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                  />
                ))}

                {getTasksByStatus(column.status).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No tasks
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
