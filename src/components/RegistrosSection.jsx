import React, { useState } from 'react';
import { Search, Plus, Download, Tag, Calendar, User, Image as ImageIcon, Trash2, Edit3, Eye } from 'lucide-react';
import NuevoRegistroModal from './NuevoRegistroModal';

export default function RegistrosSection({ records, setRecords, onAddActivity, currentUser, activeRole }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  // Filter records based on search and category
  const filteredRecords = records.filter(rec => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.tags && rec.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory =
      categoryFilter === 'Todas' || rec.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Unique categories for dropdown filter
  const categories = ['Todas', ...new Set(records.map(r => r.category))];

  const handleSaveRecord = (newRecord) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === newRecord.id ? { ...newRecord, author: r.author, authorRole: r.authorRole } : r));
      onAddActivity({
        action: 'Edición de Registro',
        details: `Actualizó el registro: "${newRecord.title}"`,
        type: 'registro'
      });
    } else {
      const fullRecord = {
        ...newRecord,
        author: currentUser?.name || 'Usuario',
        authorRole: activeRole === 'superadmin' ? 'Super Administrador' : 'Usuario'
      };
      setRecords(prev => [fullRecord, ...prev]);
      onAddActivity({
        action: 'Creación de Registro',
        details: `Creó un nuevo registro: "${newRecord.title}"`,
        type: 'registro'
      });
    }
  };

  const handleDeleteRecord = (id, title) => {
    if (window.confirm(`¿Está seguro de eliminar el registro "${title}"?`)) {
      setRecords(prev => prev.filter(r => r.id !== id));
      onAddActivity({
        action: 'Eliminación de Registro',
        details: `Eliminó el registro ID: ${id} ("${title}")`,
        type: 'registro'
      });
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Título,Categoría,Estado,Autor,Fecha,Descripción"].join(",") + "\n"
      + filteredRecords.map(r => `"${r.id}","${r.title}","${r.category}","${r.status}","${r.author}","${r.date}","${r.description.replace(/"/g, '""')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registros_infovault_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddActivity({
      action: 'Exportación de Datos',
      details: `Exportó ${filteredRecords.length} registros a formato CSV`,
      type: 'sistema'
    });
  };

  return (
    <div className="page-container">
      {/* Page Header matching Screenshot 2 */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Registros de información</h1>
          <p className="page-description">Almacena y consulta la información del sistema.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            title="Exportar a CSV"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>

          <button
            onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span>Nuevo registro</span>
          </button>
        </div>
      </div>

      {/* Toolbar matching Screenshot 2 */}
      <div className="toolbar">
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="input-search"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'Todas' ? 'Todas las categorías' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Cards Layout */}
      {filteredRecords.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>No se encontraron registros de información.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredRecords.map(rec => (
            <div key={rec.id} className="record-card">
              <div className="record-header">
                <h3 className="record-title">{rec.title}</h3>
                <span className={`badge badge-${rec.status.toLowerCase()}`}>
                  {rec.status}
                </span>
              </div>

              <div className="record-badges">
                <span className="badge badge-category">{rec.category}</span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {rec.date}
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5' }}>
                {rec.description}
              </p>

              {/* Tag Badges */}
              {rec.tags && rec.tags.length > 0 && (
                <div className="tags-list">
                  {rec.tags.map((tag, i) => (
                    <span key={i} className="tag-item">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Image Thumbnail preview if any */}
              {rec.images && rec.images.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '4px' }}>
                  {rec.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Adjunto"
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                      onClick={() => setViewingRecord(rec)}
                    />
                  ))}
                </div>
              )}

              {/* Footer Meta & Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                marginTop: 'auto'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={13} /> {rec.author}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setViewingRecord(rec)}
                    className="btn btn-secondary btn-sm"
                    title="Ver detalles completos"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => { setEditingRecord(rec); setIsModalOpen(true); }}
                    className="btn btn-secondary btn-sm"
                    title="Editar registro"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(rec.id, rec.title)}
                    className="btn btn-danger btn-sm"
                    title="Eliminar registro"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear / Editar Registro */}
      <NuevoRegistroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
      />

      {/* Modal para Ver Detalles de Registro */}
      {viewingRecord && (
        <div className="modal-overlay" onClick={() => setViewingRecord(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>{viewingRecord.title}</h3>
                <p>Categoría: {viewingRecord.category} • Registrado el {viewingRecord.date}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setViewingRecord(null)}>
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className={`badge badge-${viewingRecord.status.toLowerCase()}`}>{viewingRecord.status}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Registrado por: <strong>{viewingRecord.author}</strong> ({viewingRecord.authorRole})</span>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>Descripción:</h4>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                  {viewingRecord.description || 'Sin descripción.'}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>Contenido Completo:</h4>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  {viewingRecord.content || 'Sin contenido adicional.'}
                </p>
              </div>

              {viewingRecord.images && viewingRecord.images.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>Imágenes Adjuntas:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                    {viewingRecord.images.map((img, i) => (
                      <img key={i} src={img} alt="Adjunto" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewingRecord(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
