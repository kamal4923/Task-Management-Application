import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { getSocket } from './services/socket';

import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';
import Toast from './components/Toast';
import AuthForm from './components/AuthForm';

export default function App() {
  const { user, loading: authLoading } = useAuth();

  const [theme, setTheme] = useState(localStorage.getItem('taskmaster_theme') || 'light');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list' | 'dashboard'

  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Modal & Toast states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskmaster_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Fetch Tasks with filters
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoadingTasks(true);
    try {
      const res = await api.getTasks({
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy
      });
      setTasks(res.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [user, search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Setup Socket Listeners
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);

    if (socket.connected) {
      setIsSocketConnected(true);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Live Task Event Listeners
    socket.on('task:created', (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
      showToast(`Task Created: "${newTask.title}"`);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      showToast(`Task Updated: "${updatedTask.title}"`);
    });

    socket.on('task:status_changed', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      showToast(`Status updated to "${updatedTask.status}" for "${updatedTask.title}"`);
    });

    socket.on('task:deleted', ({ id }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task deleted successfully');
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:status_changed');
      socket.off('task:deleted');
    };
  }, [user]);

  // CRUD Actions
  const handleCreateOrUpdateTask = async (taskData) => {
    if (taskData.id) {
      const res = await api.updateTask(taskData.id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === taskData.id ? res.task : t)));
    } else {
      const res = await api.createTask(taskData);
      setTasks((prev) => [res.task, ...prev]);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await api.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to change status:', err);
      fetchTasks(); // rollback on failure
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      try {
        await api.deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
        fetchTasks();
      }
    }
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        Loading Application...
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isSocketConnected={isSocketConnected}
      />

      <main style={{
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '24px'
      }}>
        <FilterBar
          viewMode={viewMode}
          setViewMode={setViewMode}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenCreateModal={handleOpenCreateModal}
        />

        {loadingTasks ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Updating tasks...
          </div>
        ) : (
          <>
            {viewMode === 'kanban' && (
              <TaskBoard
                tasks={tasks}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {viewMode === 'list' && (
              <TaskList
                tasks={tasks}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}

            {viewMode === 'dashboard' && (
              <Dashboard tasks={tasks} />
            )}
          </>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
