import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import RegistrosSection from './components/RegistrosSection';
import VehiculosSection from './components/VehiculosSection';
import ActividadSection from './components/ActividadSection';
import UsuariosSection from './components/UsuariosSection';

import {
  INITIAL_USERS,
  INITIAL_REGISTROS,
  INITIAL_VEHICULOS,
  INITIAL_ACTIVIDAD
} from './data/initialData';

export default function App() {
  // Login Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('infovault_authenticated') === 'true';
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('infovault_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('infovault_active_role') || 'superadmin';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUserId = localStorage.getItem('infovault_current_user_id');
    if (savedUserId) {
      const found = users.find(u => u.id === savedUserId);
      if (found) return found;
    }
    const foundRole = users.find(u => u.role === activeRole);
    return foundRole || users[0];
  });

  const [currentSection, setCurrentSection] = useState(() => {
    return localStorage.getItem('infovault_current_section') || 'vehiculos';
  });

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('infovault_records');
    return saved ? JSON.parse(saved) : INITIAL_REGISTROS;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('infovault_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICULOS;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('infovault_activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVIDAD;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('infovault_authenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('infovault_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('infovault_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('infovault_current_section', currentSection);
  }, [currentSection]);

  useEffect(() => {
    localStorage.setItem('infovault_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('infovault_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('infovault_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('infovault_activity', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Enforce section restriction when switching to 'usuario' role
  useEffect(() => {
    if (activeRole === 'usuario' && (currentSection === 'actividad' || currentSection === 'usuarios')) {
      setCurrentSection('registros');
    }
  }, [activeRole, currentSection]);

  // Helper to add audit log
  const handleAddActivity = (event) => {
    const newLog = {
      id: `act-${Date.now()}`,
      user: currentUser?.name || 'Usuario',
      userRole: activeRole === 'superadmin' ? 'Super Administrador' : 'Usuario',
      action: event.action,
      details: event.details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: event.type || 'sistema'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Login handler
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsAuthenticated(true);

    if (user.role === 'usuario') {
      setCurrentSection('registros');
    } else {
      setCurrentSection('vehiculos');
    }

    handleAddActivity({
      action: 'Inicio de Sesión',
      details: `Usuario ${user.name} iniciós sesión con rol ${user.roleLabel || user.role}`,
      type: 'sistema'
    });
  };

  // Logout handler
  const handleLogout = () => {
    handleAddActivity({
      action: 'Cierre de Sesión',
      details: `Usuario ${currentUser?.name || 'Usuario'} cerró sesión`,
      type: 'sistema'
    });

    setIsAuthenticated(false);
    localStorage.removeItem('infovault_authenticated');
  };

  // Reset demo data handler
  const handleResetDemoData = () => {
    if (window.confirm('¿Desea restablecer todos los datos de demostración a su estado inicial?')) {
      localStorage.clear();
      setUsers(INITIAL_USERS);
      setRecords(INITIAL_REGISTROS);
      setVehicles(INITIAL_VEHICULOS);
      setActivityLogs(INITIAL_ACTIVIDAD);
      setActiveRole('superadmin');
      setCurrentSection('vehiculos');
      setCurrentUser(INITIAL_USERS[0]);
      setIsAuthenticated(true);
    }
  };

  // Registration handler
  const handleRegister = (newUser) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole(newUser.role);
    setIsAuthenticated(true);
    setCurrentSection('registros');

    // Add activity log visible to Super Admin
    const newLog = {
      id: `act-${Date.now()}`,
      user: newUser.name,
      userRole: 'Usuario',
      action: 'Auto-Registro de Usuario',
      details: `El nuevo usuario "${newUser.name}" (${newUser.email}) se registró desde la pantalla de Inicio de Sesión.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'sistema'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Render Login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} users={users} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        activeRole={activeRole}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          allUsers={users}
          onResetDemoData={handleResetDemoData}
          onLogout={handleLogout}
        />

        {/* Section View Renderer */}
        <main>
          {currentSection === 'registros' && (
            <RegistrosSection
              records={records}
              setRecords={setRecords}
              onAddActivity={handleAddActivity}
              currentUser={currentUser}
              activeRole={activeRole}
            />
          )}

          {currentSection === 'vehiculos' && (
            <VehiculosSection
              vehicles={vehicles}
              setVehicles={setVehicles}
              onAddActivity={handleAddActivity}
              currentUser={currentUser}
              activeRole={activeRole}
            />
          )}

          {currentSection === 'actividad' && (
            <ActividadSection
              activityLogs={activityLogs}
              setActivityLogs={setActivityLogs}
              activeRole={activeRole}
            />
          )}

          {currentSection === 'usuarios' && (
            <UsuariosSection
              users={users}
              setUsers={setUsers}
              onAddActivity={handleAddActivity}
              activeRole={activeRole}
              setCurrentUser={setCurrentUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}
