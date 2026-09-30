import React, { useState } from 'react';
import { Activity, Search, ShieldAlert, Clock, User, Download, Trash2, Filter } from 'lucide-react';

export default function ActividadSection({ activityLogs, setActivityLogs, activeRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');

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
          <ShieldAlert size={56} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
            Acceso Restringido
          </h2>
          <p style={{ color: '#7f1d1d', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            El apartado de <strong>Actividad e Historial de Auditoría</strong> está reservado únicamente para cuentas con rol de <strong>Super Administrador</strong>. Los usuarios estándar no poseen permisos de consulta sobre la actividad general del sistema.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: '1px solid #fecaca'
          }}>
            Regla activa: Permisos 2/4 apartados para rol Usuario
          </div>
        </div>
      </div>
    );
  }

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'Todos' || log.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleClearLogs = () => {
    if (window.confirm('¿Está seguro de limpiar todo el historial de auditoría?')) {
      setActivityLogs([]);
    }
  };

  const handleExportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Usuario,Rol,Acción,Detalles,Fecha y Hora"].join(",") + "\n"
      + filteredLogs.map(l => `"${l.id}","${l.user}","${l.userRole || 'Admin'}","${l.action}","${l.details.replace(/"/g, '""')}","${l.timestamp}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `auditoria_infovault_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity className="icon" size={26} style={{ color: '#18181b' }} />
            Historial de Actividad
          </h1>
          <p className="page-description">Registro de auditoría del sistema en tiempo real. (Control Exclusivo de Super Administrador)</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleExportLogs} className="btn btn-secondary">
            <Download size={16} />
            <span>Exportar Registro</span>
          </button>
          <button onClick={handleClearLogs} className="btn btn-danger">
            <Trash2 size={16} />
            <span>Limpiar Historial</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="input-search"
              placeholder="Buscar por usuario, acción o detalles de auditoría..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="Todos">Todos los eventos</option>
            <option value="vehiculo">Actividad Vehicular</option>
            <option value="registro">Registros de Info</option>
            <option value="sistema">Eventos del Sistema</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Usuario</th>
              <th>Acción Realizada</th>
              <th>Detalles del Evento</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  No se registran eventos de actividad en el sistema.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748b' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} style={{ color: '#94a3b8' }} /> {log.timestamp}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{log.user}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.userRole || 'Super Administrador'}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ maxWidth: '380px', color: '#334155', lineHeight: '1.4' }}>
                    {log.details}
                  </td>
                  <td>
                    <span className={`badge badge-${log.type === 'vehiculo' ? 'retencion' : log.type === 'registro' ? 'activo' : 'category'}`}>
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
