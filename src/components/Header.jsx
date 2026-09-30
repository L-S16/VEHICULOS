import React from 'react';
import { Crown, UserCheck, RefreshCw, Sparkles } from 'lucide-react';

export default function Header({ activeRole, setActiveRole, currentUser, setCurrentUser, allUsers, onResetDemoData }) {
  const handleRoleChange = (roleKey) => {
    setActiveRole(roleKey);
    // Find matching user from system list
    const foundUser = allUsers.find(u => u.role === roleKey);
    if (foundUser) {
      setCurrentUser(foundUser);
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        {/* Role Switcher pill controls for testing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} style={{ color: '#f59e0b' }} /> Modo Vista:
          </span>
          <div className="role-switcher-container">
            <button
              onClick={() => handleRoleChange('superadmin')}
              className={`role-btn ${activeRole === 'superadmin' ? 'active' : ''}`}
            >
              <Crown size={14} style={{ color: activeRole === 'superadmin' ? '#7c3aed' : '#64748b' }} />
              <span>Super Administrador</span>
            </button>

            <button
              onClick={() => handleRoleChange('usuario')}
              className={`role-btn ${activeRole === 'usuario' ? 'active' : ''}`}
            >
              <UserCheck size={14} style={{ color: activeRole === 'usuario' ? '#059669' : '#64748b' }} />
              <span>Usuario</span>
            </button>
          </div>
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
          {activeRole === 'superadmin' ? '👑 Acceso Total (4 apartados)' : '👤 Acceso Usuario (2 apartados)'}
        </div>
      </div>
    </header>
  );
}
