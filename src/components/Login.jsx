import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, Crown, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login({ onLogin, users }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
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

  const handleQuickLogin = (roleKey) => {
    const userToLogin = users.find(u => u.role === roleKey && u.status === 'Activo');
    if (userToLogin) {
      setEmail(userToLogin.email);
      setPassword(userToLogin.password || 'admin123');
      onLogin(userToLogin);
    }
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
          <p>Gestión de información y control vehicular</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-error-alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
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
        </form>

        {/* Quick Demo Access Section */}
        <div className="quick-access-section">
          <span className="quick-access-title">Ingreso Rápido de Demostración:</span>

          <div className="quick-buttons-grid">
            <button
              type="button"
              className="quick-role-btn admin-btn"
              onClick={() => handleQuickLogin('superadmin')}
            >
              <div className="role-btn-content">
                <Crown size={18} className="role-icon" />
                <div className="role-btn-text">
                  <span className="role-name">Super Administrador</span>
                  <span className="user-email">oscar.malitasig@infovault.gob.ec</span>
                </div>
              </div>
              <span className="badge-perm">4 apartados</span>
            </button>

            <button
              type="button"
              className="quick-role-btn user-btn"
              onClick={() => handleQuickLogin('usuario')}
            >
              <div className="role-btn-content">
                <User size={18} className="role-icon" />
                <div className="role-btn-text">
                  <span className="role-name">Usuario Estándar</span>
                  <span className="user-email">carlos.perez@infovault.gob.ec</span>
                </div>
              </div>
              <span className="badge-perm">2 apartados</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
