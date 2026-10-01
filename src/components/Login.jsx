import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, UserPlus, UserCheck } from 'lucide-react';

export default function Login({ onLogin, onRegister, users }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const foundUser = users.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!foundUser) {
      setErrorMessage('El correo electrónico no se encuentra registrado en el sistema.');
      return;
    }

    if (foundUser.password && foundUser.password !== password) {
      setErrorMessage('La contraseña ingresada es incorrecta.');
      return;
    }

    if (foundUser.status === 'Inactivo') {
      setErrorMessage('Esta cuenta de usuario se encuentra inactiva. Contacte al Super Administrador.');
      return;
    }

    // Success login
    onLogin(foundUser);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor ingrese su nombre completo.');
      return;
    }

    const existingUser = users.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (existingUser) {
      setErrorMessage('El correo electrónico ya se encuentra registrado. Inicie sesión.');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'usuario',
      roleLabel: 'Usuario Estándar',
      status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegister(newUser);
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card">
        {/* Logo Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-icon">
            <Shield size={28} />
          </div>
          <h2>InfoVault</h2>
          <p>{isRegistering ? 'Registro de Nuevo Usuario' : 'Gestión de información y control vehicular'}</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-error-alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login or Register Form */}
        {!isRegistering ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div className="input-icon-wrapper">
                <Mail className="field-icon" size={18} />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="ejemplo@infovault.gob.ec"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-icon-wrapper">
                <Lock className="field-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-login">
              <span>Iniciar Sesión</span>
              <ArrowRight size={18} />
            </button>

            {/* Prominent Register Button */}
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                ¿No tienes una cuenta registrada?
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 600
                }}
                onClick={() => {
                  setErrorMessage('');
                  setEmail('');
                  setPassword('');
                  setName('');
                  setIsRegistering(true);
                }}
              >
                <UserPlus size={16} style={{ color: '#0f172a' }} />
                <span>Registrar Nuevo Usuario</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <div className="input-icon-wrapper">
                <UserCheck className="field-icon" size={18} />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <div className="input-icon-wrapper">
                <Mail className="field-icon" size={18} />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="ejemplo@infovault.gob.ec"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <div className="input-icon-wrapper">
                <Lock className="field-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-login">
              <UserPlus size={18} />
              <span>Crear Cuenta</span>
            </button>

            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                ¿Ya tienes una cuenta registrada?
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 600
                }}
                onClick={() => {
                  setErrorMessage('');
                  setEmail('');
                  setPassword('');
                  setName('');
                  setIsRegistering(false);
                }}
              >
                <span>Volver a Iniciar Sesión</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
