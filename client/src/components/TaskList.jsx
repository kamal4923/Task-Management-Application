import React from 'react';
import { Calendar, Edit3, Trash2, Tag, Flag } from 'lucide-react';

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)'
      }}>
        <h3>No tasks match your search or filter criteria.</h3>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--bg-surface-hover)',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <th style={{ padding: '14px 20px' }}>Task</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Priority</th>
              <th style={{ padding: '14px 20px' }}>Category</th>
              <th style={{ padding: '14px 20px' }}>Due Date</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Title & Description */}
                <td style={{ padding: '16px 20px', maxWidth: '320px' }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                    opacity: task.status === 'Completed' ? 0.7 : 1
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Status Selector */}
                <td style={{ padding: '16px 20px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                {/* Priority */}
                <td style={{ padding: '16px 20px' }}>
                  <span className={`badge-priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Category */}
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)'
                  }}>
                    {task.category || 'General'}
                  </span>
                </td>

                {/* Due Date */}
                <td style={{ padding: '16px 20px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {task.due_date ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      {task.due_date}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>No Due Date</span>
                  )}
                </td>

                {/* Actions */}
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => onEdit(task)}
                      className="btn btn-ghost"
                      style={{ padding: '6px' }}
                      title="Edit Task"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="btn btn-ghost"
                      style={{ padding: '6px', color: 'var(--accent-danger)' }}
                      title="Delete Task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
