import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';

const COLORES = [
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Negro', hex: '#111111' },
  { nombre: 'Gris', hex: '#808080' },
  { nombre: 'Plateado', hex: '#C0C0C0' },
  { nombre: 'Rojo', hex: '#DC2626' },
  { nombre: 'Vino', hex: '#7F1D1D' },
  { nombre: 'Naranja', hex: '#F97316' },
  { nombre: 'Amarillo', hex: '#FACC15' },
  { nombre: 'Dorado', hex: '#CA8A04' },
  { nombre: 'Beige', hex: '#D6C3A1' },
  { nombre: 'Crema', hex: '#FFF3D6' },
  { nombre: 'Café', hex: '#78350F' },
  { nombre: 'Verde', hex: '#16A34A' },
  { nombre: 'Turquesa', hex: '#14B8A6' },
  { nombre: 'Celeste', hex: '#38BDF8' },
  { nombre: 'Azul', hex: '#2563EB' },
  { nombre: 'Morado', hex: '#7C3AED' },
  { nombre: 'Rosado', hex: '#EC4899' }
];

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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
  {COLORES.map(c => (
    <button
      type="button"
      key={c.nombre}
      title={c.nombre}
      onClick={() => setColor(c.nombre)}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: c.hex,
        cursor: 'pointer',
        border: color === c.nombre ? '3px solid #0f172a' : '2px solid #cbd5e1',
        boxShadow: color === c.nombre ? '0 0 0 2px #fff inset' : 'none'
      }}
    />
  ))}
  <input
    type="color"
    title="Otro color"
    value={/^#/.test(color) ? color : '#888888'}
    onChange={e => setColor(e.target.value)}
    style={{ width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer' }}
  />
</div>
<span style={{ fontSize: '0.8rem', color: '#64748b' }}>
  Seleccionado: {color || 'ninguno'}
</span>
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
