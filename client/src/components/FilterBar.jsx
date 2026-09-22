import React from 'react';
import { Search, Plus, LayoutGrid, List, BarChart3, Filter, X } from 'lucide-react';

export default function FilterBar({
  viewMode,
  setViewMode,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  onOpenCreateModal
}) {
  const hasActiveFilters = search || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setSortBy('created_at');
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      padding: '16px 20px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Top row: View Modes + Action Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* View mode toggle tabs */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'var(--bg-surface-hover)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          gap: '4px'
        }}>
          <button
            onClick={() => setViewMode('kanban')}
            className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <LayoutGrid size={16} />
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <List size={16} />
            List View
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`btn ${viewMode === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <BarChart3 size={16} />
            Analytics
          </button>
        </div>

        {/* Create task button */}
        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          style={{ gap: '6px' }}
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Bottom row: Search & Filter inputs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '36px', paddingRight: search ? '36px' : '12px' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          <option value="All">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority Dropdown */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">🔴 Urgent</option>
          <option value="High">🟠 High</option>
          <option value="Medium">🔵 Medium</option>
          <option value="Low">⚪ Low</option>
        </select>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input"
          style={{ width: 'auto', minWidth: '130px' }}
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
          <option value="Feature">Feature</option>
          <option value="Bug">Bug</option>
        </select>

        {/* Sort By Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
          style={{ width: 'auto', minWidth: '140px' }}
        >
          <option value="created_at">Sort: Newest First</option>
          <option value="due_date">Sort: Due Date</option>
          <option value="priority">Sort: Highest Priority</option>
        </select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', color: 'var(--accent-danger)' }}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
