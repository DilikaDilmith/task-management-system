import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import {
  LogOut, Plus, Search, CheckCircle2, Clock,
  AlertTriangle, Trash2, Edit3, X, Calendar, Flag,
  LayoutDashboard, CheckCircle, Hourglass, AlertCircle, User
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0, overdueTasks: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    due_date: ''
  });

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
    <div className="min-h-screen bg-[#080b14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-16">

      {/* Background Decorative Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* Navigation / Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-2xl p-5 rounded-3xl border border-slate-800/60 shadow-2xl shadow-black/50 ring-1 ring-white/[0.03]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-xs text-slate-500">Streamline your daily tasks & workflow seamlessly.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300">
              <User size={14} className="text-indigo-400" />
              <span>{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-800/60 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-rose-500/10"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <StatCard title="Total Tasks" count={stats.totalTasks} icon={<LayoutDashboard size={18} />} accent="from-blue-500/15 to-cyan-500/5 border-blue-500/20 text-blue-400" glow="shadow-blue-500/10" />
          <StatCard title="Pending" count={stats.pendingTasks} icon={<Hourglass size={18} />} accent="from-amber-500/15 to-orange-500/5 border-amber-500/20 text-amber-400" glow="shadow-amber-500/10" />
          <StatCard title="In Progress" count={stats.inProgressTasks} icon={<Clock size={18} />} accent="from-indigo-500/15 to-violet-500/5 border-indigo-500/20 text-indigo-400" glow="shadow-indigo-500/10" />
          <StatCard title="Completed" count={stats.completedTasks} icon={<CheckCircle size={18} />} accent="from-emerald-500/15 to-teal-500/5 border-emerald-500/20 text-emerald-400" glow="shadow-emerald-500/10" />
          <StatCard title="Overdue" count={stats.overdueTasks} icon={<AlertCircle size={18} />} accent="from-rose-500/15 to-red-500/5 border-rose-500/20 text-rose-400" glow="shadow-rose-500/10" />
        </div>

        {/* Action Controls & Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-900/50 backdrop-blur-2xl p-4 rounded-3xl border border-slate-800/60 shadow-xl ring-1 ring-white/[0.03]">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={17} />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800/80 rounded-2xl py-2.5 pl-11 pr-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all duration-200"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-950/50 border border-slate-800/80 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all cursor-pointer hover:border-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-950/50 border border-slate-800/80 rounded-2xl px-3 py-2.5 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all cursor-pointer hover:border-slate-700"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95"
          >
            <Plus size={18} /> Create Task
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-400 text-xs sm:text-sm px-1">
          <p>{tasks.length} tasks shown</p>
          <p className="text-slate-500">Tip: use search and filters to surface urgent work faster.</p>
        </div>

        {/* Task Cards Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-slate-800/50 p-6">
            <div className="w-16 h-16 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto text-slate-500 mb-4 border border-slate-700/40">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-semibold text-slate-300">No tasks found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              There are no tasks matching your filters. Try adjusting your search or add a new task!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group relative bg-slate-950/70 backdrop-blur-xl border border-slate-800/70 hover:border-indigo-500/30 rounded-[28px] p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_90px_-30px_rgba(99,102,241,0.5)] overflow-hidden"
              >
                {/* subtle hover gradient sheen */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/[0.04] to-transparent transition-opacity duration-300 pointer-events-none rounded-[28px]"></div>

                <div className="relative">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 mb-2">Task</p>
                      <h3 className="font-semibold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                        {task.title}
                      </h3>
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border shrink-0 backdrop-blur-sm ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed overflow-hidden text-ellipsis max-h-16">
                    {task.description || 'No detailed description provided.'}
                  </p>
                </div>

                <div className="relative space-y-4 pt-4 border-t border-slate-800/70 text-xs">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={14} className="text-slate-500" />
                      {task.due_date ? task.due_date.split('T')[0] : 'No Due Date'}
                    </span>
                    <span className={`px-3 py-1.5 rounded-2xl text-[11px] font-semibold flex items-center gap-2 ${getStatusBadge(task.status)}`}>
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(task.status)}`}></span>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBar(task.status)}`}
                        style={{ width: `${getProgressValue(task.status)}%` }}
                      ></div>
                    </div>
                    <span className="text-slate-500 text-[11px] uppercase tracking-[0.2em]">
                      {getProgressValue(task.status)}% done
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-2xl transition-all duration-200 active:scale-90"
                      title="Edit Task"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-200 active:scale-90"
                      title="Delete Task"
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

      {/* Modern Task Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl shadow-black/80 ring-1 ring-white/[0.04] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500"></span>
              {editingTask ? 'Edit Task Details' : 'Create New Task'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Design Database Schema"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide additional details about the task..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 resize-none transition-all"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 mt-2 active:scale-[0.98] text-xs sm:text-sm"
              >
                {editingTask ? 'Update Task' : 'Save Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components & Dynamic CSS Classes
const StatCard = ({ title, count, icon, accent, glow }) => (
  <div className={`bg-gradient-to-br ${accent} backdrop-blur-xl p-4 rounded-2xl border flex flex-col justify-between shadow-lg ${glow} hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/[0.03]`}>
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-xs font-medium">{title}</span>
      {icon}
    </div>
    <p className="text-2xl font-bold mt-3 text-slate-100 tracking-tight">{count}</p>
  </div>
);

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'High': return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
    case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/25';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'In Progress': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  }
};

const getStatusDot = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-400 animate-pulse';
    case 'In Progress': return 'bg-indigo-400 animate-pulse';
    default: return 'bg-amber-400 animate-pulse';
  }
};

const getProgressValue = (status) => {
  switch (status) {
    case 'Completed': return 100;
    case 'In Progress': return 65;
    default: return 25;
  }
};

const getProgressBar = (status) => {
  switch (status) {
    case 'Completed': return 'bg-emerald-400';
    case 'In Progress': return 'bg-indigo-400';
    default: return 'bg-amber-400';
  }
};

export default Dashboard;