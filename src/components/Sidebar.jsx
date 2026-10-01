import React from 'react';
import { Database, Car, Activity, Users } from 'lucide-react';

export default function Sidebar({ currentSection, setCurrentSection, activeRole, currentUser }) {
  // Navigation menu items definition
  const allNavItems = [
    {
      id: 'registros',
      label: 'Registros',
      icon: Database,
      adminOnly: false
    },
    {
      id: 'vehiculos',
      label: 'Vehículos',
      icon: Car,
      adminOnly: false
    },
    {
      id: 'actividad',
      label: 'Actividad',
      icon: Activity,
      adminOnly: true
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      adminOnly: true
    }
  ];

  // Filter items based on user role (Usuario only gets Registros & Vehículos)
  const visibleNavItems = allNavItems.filter(item => {
    if (activeRole === 'superadmin') return true;
    return !item.adminOnly;
  });

  return (
    <aside className="sidebar">
      {/* Brand Header with New AI Generated Logo */}
      <div className="brand-logo">
        <img
          src="/logo.png"
          alt="Control Vehículos"
          style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
        />
        <div className="brand-info">
          <span className="brand-title">Control Vehículos</span>
          <span className="brand-subtitle">Gestión e información</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {visibleNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="icon" size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer User Info */}
      <div className="sidebar-user-footer">
        <div className="user-profile-badge">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={currentUser?.name || 'Usuario'}
            className="user-avatar"
          />
          <div className="user-details">
            <span className="user-name">{currentUser?.name || 'Usuario'}</span>
            <span className="user-role-tag">
              {activeRole === 'superadmin' ? 'Super Administrador' : 'Usuario'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
