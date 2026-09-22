import React from 'react';
import TaskCard from './TaskCard';
import { Circle, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'To Do', label: 'To Do', icon: Circle, color: '#94a3b8' },
  { id: 'In Progress', label: 'In Progress', icon: Clock, color: '#3b82f6' },
  { id: 'In Review', label: 'In Review', icon: AlertCircle, color: '#f59e0b' },
  { id: 'Completed', label: 'Completed', icon: CheckCircle2, color: '#10b981' }
];

export default function TaskBoard({ tasks, onEdit, onDelete, onStatusChange, onOpenCreateModal }) {
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(Number(taskId), targetStatus);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      alignItems: 'start'
    }}>
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const IconComponent = col.icon;

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{
              backgroundColor: 'var(--bg-surface-hover)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              minHeight: '400px'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconComponent size={18} color={col.color} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {col.label}
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)'
                }}>
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={onOpenCreateModal}
                className="btn btn-ghost"
                style={{ padding: '4px' }}
                title={`Add task to ${col.label}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Task List in Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {columnTasks.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  fontSize: '0.825rem'
                }}>
                  No tasks in {col.label}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
