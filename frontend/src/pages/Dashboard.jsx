import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { 
  LogOut, Plus, Search, Filter, CheckCircle2, Clock, 
  AlertCircle, Trash2, Edit3, X, Calendar, Flag 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // State Management
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0, overdueTasks: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    due_date: ''
  });

  // Fetch Tasks and Stats
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [search, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        due_date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
        fetchStats();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}! 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your work efficiently with real-time stats.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-sm transition-all duration-200"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Tasks" count={stats.totalTasks} color="border-blue-500/30 text-blue-400" />
          <StatCard title="Pending" count={stats.pendingTasks} color="border-yellow-500/30 text-yellow-400" />
          <StatCard title="In Progress" count={stats.inProgressTasks} color="border-indigo-500/30 text-indigo-400" />
          <StatCard title="Completed" count={stats.completedTasks} color="border-emerald-500/30 text-emerald-400" />
          <StatCard title="Overdue" count={stats.overdueTasks} color="border-rose-500/30 text-rose-400" />
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>

        {/* Task List Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400">No tasks found. Create a new task to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-600 transition-colors">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-semibold text-lg text-white leading-snug">{task.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description || 'No description provided.'}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-700/60 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {task.due_date ? task.due_date.split('T')[0] : 'N/A'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-medium ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition-colors mt-4"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components & Badge Handlers
const StatCard = ({ title, count, color }) => (
  <div className={`bg-slate-800 p-4 rounded-2xl border ${color} flex flex-col justify-between`}>
    <p className="text-slate-400 text-xs font-medium">{title}</p>
    <p className="text-2xl font-bold mt-2">{count}</p>
  </div>
);

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-500/20 text-emerald-300';
    case 'In Progress': return 'bg-indigo-500/20 text-indigo-300';
    default: return 'bg-yellow-500/20 text-yellow-300';
  }
};

export default Dashboard;