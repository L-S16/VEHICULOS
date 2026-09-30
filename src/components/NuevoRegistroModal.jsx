import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

export default function NuevoRegistroModal({ isOpen, onClose, onSave, editingRecord }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState('Activo');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (editingRecord) {
      setTitle(editingRecord.title || '');
      setCategory(editingRecord.category || 'General');
      setStatus(editingRecord.status || 'Activo');
      setDescription(editingRecord.description || '');
      setContent(editingRecord.content || '');
      setTags(editingRecord.tags ? editingRecord.tags.join(', ') : '');
      setImages(editingRecord.images || []);
    } else {
      setTitle('');
      setCategory('Inspecciones');
      setStatus('Activo');
      setDescription('');
      setContent('');
      setTags('');
      setImages([]);
    }
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor ingrese un título para el registro.');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      id: editingRecord ? editingRecord.id : `reg-${Date.now()}`,
      title,
      category,
      status,
      description,
      content,
      tags: tagArray,
      images,
      date: editingRecord ? editingRecord.date : new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header matching Screenshot 2 */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>{editingRecord ? 'Editar registro' : 'Nuevo registro'}</h3>
            <p>Completa los campos para crear un nuevo registro.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body matching Screenshot 2 */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Título * */}
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. Informe Operativo de Control Interinstitucional"
                required
              />
            </div>

            {/* Categoría * & Estado */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <input
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="Categoría"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Breve resumen del registro..."
              />
            </div>

            {/* Contenido */}
            <div className="form-group">
              <label className="form-label">Contenido</label>
              <textarea
                className="form-control"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                placeholder="Detalle completo de la información almacenada..."
              />
            </div>

            {/* Etiquetas */}
            <div className="form-group">
              <label className="form-label">Etiquetas</label>
              <input
                type="text"
                className="form-control"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Separadas por comas"
              />
            </div>

            {/* Imágenes Upload matching Screenshot 2 */}
            <div className="form-group">
              <label className="form-label">Imágenes</label>
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <Upload className="upload-icon" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Subir</span>
              </label>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Puedes subir una o varias imágenes. Se mostrarán en el registro.
              </p>

              {/* Upload Previews */}
              {images.length > 0 && (
                <div className="preview-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="preview-thumb-wrapper">
                      <img src={img} alt={`Preview ${idx}`} className="preview-thumb" />
                      <button
                        type="button"
                        className="preview-remove"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer matching Screenshot 2 */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
