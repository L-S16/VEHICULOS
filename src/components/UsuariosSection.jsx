import React, { useState } from 'react';
import { Users, UserPlus, ShieldAlert, ShieldCheck, User, Lock, Mail, Trash2, Edit3, CheckCircle, XCircle } from 'lucide-react';

export default function UsuariosSection({ users, setUsers, onAddActivity, activeRole, setCurrentUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states for new/edit user
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('usuario');
  const [status, setStatus] = useState('Activo');

  // Guard condition for Super Admin requirement
  if (activeRole !== 'superadmin') {
    return (
      <div className="page-container">
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #fee2e2',
          maxWidth: '600px',
          margin: '40px auto',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)'
        }}>
          <Lock size={56} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
            Acceso Restringido - Control de Usuarios
          </h2>
          <p style={{ color: '#7f1d1d', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            El apartado de <strong>Gestión y Administración de Usuarios</strong> es exclusivo para el <strong>Super Administrador</strong>. El rol de Usuario solo puede interactuar con los apartados de <strong>Registros</strong> y <strong>Vehículos</strong>.
          </p>
        </div>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('usuario');
    setStatus('Activo');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setStatus(u.status);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        name,
        email,
        role,
        roleLabel: role === 'superadmin' ? 'Super Administrador' : 'Usuario Estándar',
        status
      } : u));

      onAddActivity({
        action: 'Edición de Usuario',
        details: `Actualizó cuenta de usuario: ${name} (Rol: ${role})`,
        type: 'sistema'
      });
    } else {
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        roleLabel: role === 'superadmin' ? 'Super Administrador' : 'Usuario Estándar',
        status,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
        lastLogin: 'Nunca',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => [...prev, newUser]);
      onAddActivity({
        action: 'Creación de Usuario',
        details: `Creó nuevo usuario: ${name} (${email}) con rol ${role}`,
        type: 'sistema'
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteUser = (id, username) => {
    if (window.confirm(`¿Está seguro de eliminar la cuenta de usuario "${username}"?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      onAddActivity({
        action: 'Eliminación de Usuario',
        details: `Eliminó la cuenta de usuario: ${username}`,
        type: 'sistema'
      });
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={26} style={{ color: '#18181b' }} />
            Gestión de Usuarios y Permisos
          </h1>
          <p className="page-description">Administra las cuentas del sistema, asigna roles de Super Administrador o Usuario y controla apartados permitidos.</p>
        </div>
        <div>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <UserPlus size={18} />
            <span>Nuevo usuario</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Super Administradores</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              {users.filter(u => u.role === 'superadmin').length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>Acceso total a 4 apartados</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Usuarios Estándar</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
              {users.filter(u => u.role === 'usuario').length}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Acceso limitado a 2 apartados</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuario / Nombre</th>
              <th>Correo Electrónico</th>
              <th>Rol Asignado</th>
              <th>Apartados Permitidos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Creado el {u.createdAt}</span>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} style={{ color: '#94a3b8' }} /> {u.email}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.role === 'superadmin' ? 'badge-retencion' : 'badge-activo'}`}>
                    {u.role === 'superadmin' ? '👑 Super Administrador' : '👤 Usuario'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: u.role === 'superadmin' ? '#7c3aed' : '#047857' }}>
                    {u.role === 'superadmin' ? '4/4 (Registros, Vehículos, Actividad, Usuarios)' : '2/4 (Registros, Vehículos)'}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${u.status === 'Activo' ? 'activo' : 'pendiente'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditModal(u)}
                      className="btn btn-secondary btn-sm"
                      title="Editar usuario"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="btn btn-danger btn-sm"
                      title="Eliminar usuario"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar Usuario */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                <p>Configura las credenciales y rol de acceso al sistema.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre Completo *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo Electrónico *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ejemplo@infovault.gob.ec"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rol de Acceso *</label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="superadmin">Super Administrador (Acceso Total: 4 apartados)</option>
                    <option value="usuario">Usuario Estándar (Acceso Limitado: 2 apartados)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado de la cuenta</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
