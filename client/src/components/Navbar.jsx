import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, Moon, Sun, Radio } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, isSocketConnected }) {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header style={{
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckSquare size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              TaskMaster
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '-2px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isSocketConnected ? 'var(--accent-success)' : 'var(--accent-warning)',
                display: 'inline-block'
              }} className={isSocketConnected ? 'animate-pulse-live' : ''} />
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                {isSocketConnected ? 'Live Sync Active' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        {/* User Actions & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            style={{ padding: '8px', borderRadius: 'var(--radius-full)' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} color="#f59e0b" />}
          </button>

          {/* User Profile Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--primary-border)'
            }}>
              {getInitials(user?.name)}
            </div>
            <div className="user-details-text" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user?.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="btn btn-ghost"
              style={{ padding: '8px', color: 'var(--accent-danger)', marginLeft: '4px' }}
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
