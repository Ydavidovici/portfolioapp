// src/features/client/commonComponents/TaskList.tsx
import React, { useState } from 'react';
import { Task, deleteTask } from '@/store/slices/taskSlice';
import { useDispatch } from 'react-redux';
import DocumentList from './documentList.tsx';
import { toast } from 'react-toastify';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        toast.success('Task deleted successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to delete task');
      }
    }
  };

  return (
    <div>
      <DocumentList />
      <table className="min-w-full bg-white mt-4">
        <thead>
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Title</th>
          <th className="py-2 px-4 border-b">Project</th>
          <th className="py-2 px-4 border-b">Assigned To</th>
          <th className="py-2 px-4 border-b">Status</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
        </thead>
        <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="py-2 px-4 border-b">{task.id}</td>
            <td className="py-2 px-4 border-b">{task.title}</td>
            <td className="py-2 px-4 border-b">{task.projectId}</td>
            <td className="py-2 px-4 border-b">{task.assignedTo}</td>
            <td className="py-2 px-4 border-b">{task.status}</td>
            <td className="py-2 px-4 border-b">
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                onClick={() => setEditingTask(task)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <DocumentList task={editingTask} onClose={() => setEditingTask(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
