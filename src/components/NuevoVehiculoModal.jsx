import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

export default function NuevoVehiculoModal({ isOpen, onClose, onSave, editingVehicle }) {
  const [owner, setOwner] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [plates, setPlates] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [status, setStatus] = useState('Detenido');
  const [detentionDate, setDetentionDate] = useState('');
  const [fuel, setFuel] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (editingVehicle) {
      setOwner(editingVehicle.owner || '');
      setVehicleType(editingVehicle.vehicleType || '');
      setPlates(editingVehicle.plates || '');
      setModel(editingVehicle.model || '');
      setColor(editingVehicle.color || '');
      setStatus(editingVehicle.status || 'Detenido');
      setDetentionDate(editingVehicle.detentionDate || '');
      setFuel(editingVehicle.fuel || '');
      setNotes(editingVehicle.notes || '');
      setImages(editingVehicle.images || []);
    } else {
      handleResetForm();
    }
  }, [editingVehicle, isOpen]);

  const handleResetForm = () => {
    setOwner('');
    setVehicleType('CAMIÓN');
    setPlates('');
    setModel('');
    setColor('Rojo');
    setStatus('Detenido');
    setDetentionDate(new Date().toISOString().split('T')[0]);
    setFuel('Diésel');
    setNotes('');
    setImages(['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800']);
  };

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
    if (!owner.trim()) {
      alert('El campo Propietario es obligatorio.');
      return;
    }

    onSave({
      id: editingVehicle ? editingVehicle.id : `veh-${Date.now()}`,
      owner: owner.toUpperCase(),
      vehicleType,
      plates: plates.toUpperCase(),
      model,
      color,
      status,
      detentionDate,
      fuel,
      notes,
      images
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Header matching Screenshot 3 */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>{editingVehicle ? 'Editar registro' : 'Nuevo registro'}</h3>
            <p>Registra los datos de la actividad realizada.</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body matching Screenshot 3 */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Propietario * */}
            <div className="form-group">
              <label className="form-label">Propietario *</label>
              <input
                type="text"
                className="form-control"
                value={owner}
                onChange={e => setOwner(e.target.value)}
                placeholder="Nombre completo o razón social"
                required
              />
            </div>

            {/* Vehículo | Placas */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vehículo</label>
                <input
                  type="text"
                  className="form-control"
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  placeholder="Descripción o tipo de vehículo"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Placas</label>
                <input
                  type="text"
                  className="form-control"
                  value={plates}
                  onChange={e => setPlates(e.target.value)}
                  placeholder="Ej. PPA-0409"
                />
              </div>
            </div>

            {/* Modelo | Color */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Modelo</label>
                <input
                  type="text"
                  className="form-control"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="Ej. HINO / 2024"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <select
                  className="form-control"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                >
                  <option value="">Selecciona un color</option>
                  <option value="Rojo">Rojo</option>
                  <option value="Blanco">Blanco</option>
                  <option value="Negro">Negro</option>
                  <option value="Gris">Gris</option>
                  <option value="Azul">Azul</option>
                  <option value="Verde">Verde</option>
                  <option value="Amarillo">Amarillo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Estado | Fecha de detención */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="Detenido">Detenido</option>
                  <option value="Liberado">Liberado</option>
                  <option value="En Retención">En Retención</option>
                  <option value="Bajo Inspección">Bajo Inspección</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de detención</label>
                <input
                  type="date"
                  className="form-control"
                  value={detentionDate}
                  onChange={e => setDetentionDate(e.target.value)}
                />
              </div>
            </div>

            {/* Combustible */}
            <div className="form-group">
              <label className="form-label">Combustible</label>
              <select
                className="form-control"
                value={fuel}
                onChange={e => setFuel(e.target.value)}
              >
                <option value="">Selecciona un combustible</option>
                <option value="Diésel">Diésel</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>

            {/* Fotografía upload matching Screenshot 3 */}
            <div className="form-group">
              <label className="form-label">Fotografía</label>
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
                Puedes adjuntar una o varias fotografías. Se mostrará una vista previa.
              </p>

              {images.length > 0 && (
                <div className="preview-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="preview-thumb-wrapper">
                      <img src={img} alt={`Fotografía ${idx}`} className="preview-thumb" />
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

          {/* Footer matching Screenshot 3 */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetForm}
            >
              Limpiar formulario
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
