import React, { useState } from 'react';
import { Search, Plus, Calendar, User, Fuel, Shield, Trash2, Edit3, Eye, Car } from 'lucide-react';
import NuevoVehiculoModal from './NuevoVehiculoModal';

export default function VehiculosSection({ vehicles, setVehicles, onAddActivity, currentUser, activeRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plates.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.vehicleType && v.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.model && v.model.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'Todos' || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSaveVehicle = (newVeh) => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === newVeh.id ? { ...newVeh, registeredBy: v.registeredBy } : v));
      onAddActivity({
        action: 'Edición de Vehículo',
        details: `Actualizó datos del vehículo placas: ${newVeh.plates} (${newVeh.owner})`,
        type: 'vehiculo'
      });
    } else {
      const fullVeh = {
        ...newVeh,
        registeredBy: currentUser?.name || 'Malitasig Oscar'
      };
      setVehicles(prev => [fullVeh, ...prev]);
      onAddActivity({
        action: 'Registro de Vehículo',
        details: `Registró unidad ${newVeh.vehicleType} ${newVeh.plates} a nombre de ${newVeh.owner}`,
        type: 'vehiculo'
      });
    }
  };

  const handleDeleteVehicle = (id, plates, owner) => {
    if (window.confirm(`¿Está seguro de eliminar el registro del vehículo ${plates} (${owner})?`)) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      onAddActivity({
        action: 'Eliminación de Vehículo',
        details: `Eliminó registro de vehículo placas: ${plates}`,
        type: 'vehiculo'
      });
    }
  };

  return (
    <div className="page-container">
      {/* Page Header matching Screenshot 3 */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehículos</h1>
          <p className="page-description">Registra y consulta las actividades de detención vehicular.</p>
        </div>
        <div>
          <button
            onClick={() => { setEditingVehicle(null); setIsModalOpen(true); }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Nuevo registro</span>
          </button>
        </div>
      </div>

      {/* Toolbar matching Screenshot 3 */}
      <div className="toolbar">
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="input-search"
              placeholder="Buscar por propietario, placas, vehículo..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Detenido">Detenido</option>
            <option value="Liberado">Liberado</option>
            <option value="En Retención">En Retención</option>
            <option value="Bajo Inspección">Bajo Inspección</option>
          </select>
        </div>
      </div>

      {/* Cards Layout matching Screenshot 3 */}
      {filteredVehicles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <Car size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <p style={{ color: '#64748b', fontSize: '1rem' }}>No se encontraron vehículos registrados.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredVehicles.map(veh => (
            <div key={veh.id} className="vehicle-card">
              {/* Photo Preview Container */}
              <div className="vehicle-card-img-wrapper">
                <img
                  src={
                    veh.images && veh.images.length > 0
                      ? veh.images[0]
                      : 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={veh.plates}
                  className="vehicle-card-img"
                />
                <span className={`badge badge-${veh.status.toLowerCase().replace(' ', '')}`} style={{ position: 'absolute', top: '12px', right: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                  {veh.status}
                </span>
              </div>

              {/* Card Body matching Screenshot 3 structure */}
              <div className="vehicle-card-body">
                <div className="plate-badge">{veh.plates || 'SIN PLACA'}</div>
                <div className="vehicle-owner">{veh.owner}</div>
                <div className="vehicle-type-model">
                  {veh.vehicleType} <br />
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                    {veh.model} {veh.color ? `- ${veh.color}` : ''}
                  </span>
                </div>

                <div className="vehicle-meta-row">
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>
                      {veh.detentionDate ? `${veh.detentionDate}` : 'Fecha no registrada'}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: '#0f172a', fontWeight: 600 }}>
                      {veh.registeredBy}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => setViewingVehicle(veh)}
                      className="btn btn-secondary btn-sm"
                      title="Ver detalles"
                    >
                      <Eye size={14} />
                    </button>
                    {activeRole === 'superadmin' && (
                      <>
                        <button
                          onClick={() => { setEditingVehicle(veh); setIsModalOpen(true); }}
                          className="btn btn-secondary btn-sm"
                          title="Editar registro"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(veh.id, veh.plates, veh.owner)}
                          className="btn btn-danger btn-sm"
                          title="Eliminar registro"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear / Editar Vehículo */}
      <NuevoVehiculoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVehicle}
        editingVehicle={editingVehicle}
      />

      {/* Modal para Ver Detalles de Vehículo */}
      {viewingVehicle && (
        <div className="modal-overlay" onClick={() => setViewingVehicle(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Vehículo: {viewingVehicle.plates}</h3>
                <p>Propietario: {viewingVehicle.owner}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setViewingVehicle(null)}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Tipo de Vehículo</span>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewingVehicle.vehicleType || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Modelo / Marca</span>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewingVehicle.model || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Color</span>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewingVehicle.color || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Combustible</span>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewingVehicle.fuel || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Fecha de Detención</span>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewingVehicle.detentionDate || 'N/A'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Registrado por</span>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{viewingVehicle.registeredBy || 'N/A'}</p>
                </div>
              </div>

              {viewingVehicle.notes && (
                <div>
                  <h4 style={{ fontSize: '0.88rem', color: '#0f172a', marginBottom: '4px' }}>Observaciones del Registro:</h4>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    {viewingVehicle.notes}
                  </p>
                </div>
              )}

              {viewingVehicle.images && viewingVehicle.images.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.88rem', color: '#0f172a', marginBottom: '8px' }}>Fotografías de la Unidad:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                    {viewingVehicle.images.map((img, i) => (
                      <img key={i} src={img} alt="Vehículo" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewingVehicle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
