import React from 'react';
import { Calendar, Edit3, Trash2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getDueDateStatus = (dueDateStr) => {
    if (!dueDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)}d`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due Today', isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', isSoon: true };
    } else {
      return { text: `Due in ${diffDays} days`, isNormal: true };
    }
  };

  const dueStatus = getDueDateStatus(task.due_date);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'grab'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}>
      {/* Category & Priority Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          letterSpacing: '0.04em'
        }}>
          {task.category || 'General'}
        </span>

        <span className={`badge-priority ${task.priority}`}>
          {task.priority === 'Urgent' && '🔥 '}
          {task.priority}
        </span>
      </div>

      {/* Task Title & Description */}
      <div>
        <h4 style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '4px',
          lineHeight: '1.35',
          textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
          opacity: task.status === 'Completed' ? 0.7 : 1
        }}>
          {task.title}
        </h4>
        {task.description && (
          <p style={{
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {task.description}
          </p>
        )}
      </div>

      {/* Due Date Indicator */}
      {task.due_date && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: dueStatus?.isOverdue && task.status !== 'Completed'
            ? 'var(--accent-danger)'
            : dueStatus?.isToday && task.status !== 'Completed'
            ? 'var(--accent-warning)'
            : 'var(--text-muted)'
        }}>
          {dueStatus?.isOverdue && task.status !== 'Completed' ? (
            <AlertTriangle size={14} />
          ) : (
            <Calendar size={14} />
          )}
          <span>{task.due_date} ({dueStatus?.text})</span>
        </div>
      )}

      {/* Footer Controls: Quick Status Select + Edit / Delete */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto'
      }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-hover)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Completed">Completed</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => onEdit(task)}
            className="btn btn-ghost"
            style={{ padding: '6px' }}
            title="Edit Task"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-ghost"
            style={{ padding: '6px', color: 'var(--accent-danger)' }}
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
