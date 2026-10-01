import React from 'react';
import { RefreshCw, LogOut, Shield } from 'lucide-react';

export default function Header({ activeRole, currentUser, onResetDemoData, onLogout }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
            Sesión: {currentUser?.name || 'Usuario'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onResetDemoData}
          className="btn btn-secondary btn-sm"
          title="Restablecer datos demostrativos iniciales"
        >
          <RefreshCw size={14} />
          <span>Restablecer Datos</span>
        </button>

        <div style={{
          padding: '6px 12px',
          borderRadius: '9999px',
          backgroundColor: activeRole === 'superadmin' ? '#f3e8ff' : '#ecfdf5',
          color: activeRole === 'superadmin' ? '#6b21a8' : '#047857',
          fontSize: '0.78rem',
          fontWeight: 700,
          border: `1px solid ${activeRole === 'superadmin' ? '#e9d5ff' : '#a7f3d0'}`
        }}>
          {activeRole === 'superadmin' ? '👑 Super Administrador (4 apartados)' : '👤 Usuario Estándar (2 apartados)'}
        </div>

        <button
          onClick={onLogout}
          className="btn btn-danger btn-sm"
          title="Cerrar sesión actual"
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
