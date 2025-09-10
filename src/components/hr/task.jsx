import React, { useEffect, useState, useContext } from "react";
import axios from "../../util/axiosInstance";
import { UserInfoContext } from "../../context/contextApi";
import { Plus, Trash2, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

const TaskManagement = () => {
  const { user } = useContext(UserInfoContext); // HR/Manager who creates tasks
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]); // employees list
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [assignTo, setAssignTo] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/task/allTasks");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false);
    }
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employee");
      setEmployees(res.data.employees || []);
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !priority || !dueDate || !assignTo) {
      alert("All fields are required!");
      return;
    }

    try {
      if (editTask) {
        await axios.put(`/api/task/${editTask._id}`, {
          title,
          description,
          priority,
          dueDate,
          assignTo,
        });
      } else {
        await axios.post("/api/task/createTasks", {
          title,
          description,
          createdBy: user.id,
          priority,
          dueDate,
          assignTo,
        });
      }

      setTitle("");
      setDescription("");
      setPriority("LOW");
      setDueDate("");
      setAssignTo("");
      setEditTask(null);
      setShowForm(false);

      fetchTasks();
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      console.error("Error saving task:", error);
    }
  };

  // Edit Task
  const handleEdit = (task) => {
    setEditTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate.split("T")[0]);
    setAssignTo(task.assignTo);
    setShowForm(true);
  };

  // Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`/api/task/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex sm:flex-row justify-end sm:items-center mb-6 gap-3">
        <button
          onClick={() => {
            setShowForm(true);
            setEditTask(null);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base"
        >
          <Plus size={18} /> Create Task
        </button>
      </div>

      {/* Task Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {editTask ? "Edit Task" : "Create Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              {/* Dates & Assign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assign To (Employee)
                  </label>
                  <select
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditTask(null);
                  }}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  {editTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="p-4 sm:p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-lg sm:text-xl font-bold mb-4">All Tasks</h2>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="p-2 sm:p-3">Title</th>
                  <th className="p-2 sm:p-3">Priority</th>
                  <th className="p-2 sm:p-3">Due Date</th>
                  <th className="p-2 sm:p-3">Assigned To</th>
                  <th className="p-2 sm:p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks?.map((task) => {
                  const emp = employees.find((e) => e._id === task.assignTo._id);
                  return (
                    <tr
                      key={task._id}
                      className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                    >
                      <td className="p-2 sm:p-3">{task.title}</td>
                      <td
                        className={`p-2 sm:p-3 font-medium ${
                          task.priority === "LOW"
                            ? "text-green-600"
                            : task.priority === "MEDIUM"
                            ? "text-yellow-600"
                            : task.priority === "HIGH"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {task.priority}
                      </td>
                      <td className="p-2 sm:p-3">{task.dueDate.split("T")[0]}</td>
                      <td className="p-2 sm:p-3">
                        {emp
                          ? `${emp.firstName} ${emp.lastName} (${emp.email})`
                          : "Unknown"}
                      </td>
                      <td className="p-2 sm:p-3 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
