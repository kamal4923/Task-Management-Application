import React from 'react';
import { Bell, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--primary-border)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 18px',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '360px',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Bell size={18} />
      </div>

      <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
        {message}
      </div>

      <button
        onClick={onClose}
        className="btn btn-ghost"
        style={{ padding: '4px', flexShrink: 0 }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
