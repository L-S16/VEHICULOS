// Initial mock data with localStorage support for InfoVault system

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Malitasig Oscar',
    email: 'oscar.malitasig@infovault.gob.ec',
    password: 'admin123',
    role: 'superadmin',
    roleLabel: 'Super Administrador',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-09-30 18:05:12',
    createdAt: '2026-01-15'
  },
  {
    id: 'usr-2',
    name: 'Carlos Pérez',
    email: 'carlos.perez@infovault.gob.ec',
    password: 'user123',
    role: 'usuario',
    roleLabel: 'Usuario Estándar',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-09-30 17:40:00',
    createdAt: '2026-02-10'
  },
  {
    id: 'usr-3',
    name: 'Ana María Gómez',
    email: 'ana.gomez@infovault.gob.ec',
    password: 'user123',
    role: 'usuario',
    roleLabel: 'Usuario Estándar',
    status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-09-29 14:12:05',
    createdAt: '2026-03-01'
  }
];

export const INITIAL_REGISTROS = [
  {
    id: 'reg-001',
    title: 'Informe Operativo de Control Interinstitucional',
    category: 'Inspecciones',
    status: 'Activo',
    description: 'Registro detallado del operativo ejecutado en la zona norte con participación de tránsito y policía nacional.',
    content: 'Se procedió con la verificación de documentos, licencias de conducir y estado de retención vehicular. Se inspeccionaron 45 vehículos y se emitieron 8 citaciones por inconsistencias en matriculación.',
    tags: ['operativo', 'tránsito', 'inspección', 'zona-norte'],
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
    ],
    author: 'Malitasig Oscar',
    authorRole: 'Super Administrador',
    date: '2026-09-28'
  },
  {
    id: 'reg-002',
    title: 'Acta de Custodia y Depósito Temporal #409',
    category: 'Documentación',
    status: 'Activo',
    description: 'Documentación oficial de ingreso de unidad pesada al patio de retención vehicular principal.',
    content: 'Unidad de transporte de carga tipo Camión HINO de color Rojo, placas PPA-0409, retenido por falta de permiso de circulación vigente en el sector industrial.',
    tags: ['retención', 'patio-1', 'custodia', 'hino'],
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
    ],
    author: 'Carlos Pérez',
    authorRole: 'Usuario',
    date: '2026-09-24'
  },
  {
    id: 'reg-003',
    title: 'Reporte de Mantenimiento de Patios y Equipos',
    category: 'Mantenimiento',
    status: 'Pendiente',
    description: 'Solicitud de revisión del sistema de videovigilancia y portón automatizado del patio sur.',
    content: 'Se solicita calibración del sensor vehicular y mantenimiento preventivo de las cámaras nocturnas de vigilancia.',
    tags: ['mantenimiento', 'patio-sur', 'cámaras'],
    images: [],
    author: 'Ana María Gómez',
    authorRole: 'Usuario',
    date: '2026-09-20'
  }
];

export const INITIAL_VEHICULOS = [
  {
    id: 'veh-001',
    owner: 'MANUEL',
    vehicleType: 'CAMIÓN',
    plates: 'PPA-0409',
    model: 'HINO - Rojo',
    year: '2022',
    color: 'Rojo',
    status: 'Detenido',
    detentionDate: '2026-09-24',
    fuel: 'Diésel',
    registeredBy: 'Malitasig Oscar',
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
    ],
    notes: 'Detenido durante operativo nocturno en Av. Panamericana Sur por revisión de permisos de carga.'
  },
  {
    id: 'veh-002',
    owner: 'CORPORACIÓN LOGÍSTICA ANDINA',
    vehicleType: 'CAMIONETA',
    plates: 'PBK-7821',
    model: 'TOYOTA HILUX',
    year: '2024',
    color: 'Blanco',
    status: 'En Retención',
    detentionDate: '2026-09-26',
    fuel: 'Diésel',
    registeredBy: 'Carlos Pérez',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
    ],
    notes: 'Ingresado por discrepancia en chasis y número de motor durante revisión técnica.'
  },
  {
    id: 'veh-003',
    owner: 'RODRÍGUEZ JUAN CARLOS',
    vehicleType: 'AUTOMÓVIL',
    plates: 'PCH-3910',
    model: 'CHEVROLET SAIL',
    year: '2021',
    color: 'Gris',
    status: 'Liberado',
    detentionDate: '2026-09-18',
    fuel: 'Gasolina',
    registeredBy: 'Malitasig Oscar',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
    ],
    notes: 'Vehículo liberado tras la presentación de matrícula cancelada y pago de multas.'
  }
];

export const INITIAL_ACTIVIDAD = [
  {
    id: 'act-001',
    user: 'Malitasig Oscar',
    userRole: 'Super Administrador',
    action: 'Registro de Vehículo',
    details: 'Registró detención vehicular del Camión HINO (PPA-0409) asignado a MANUEL',
    timestamp: '2026-09-24 14:32:10',
    type: 'vehiculo'
  },
  {
    id: 'act-002',
    user: 'Carlos Pérez',
    userRole: 'Usuario',
    action: 'Creación de Registro',
    details: 'Ingresó la documentación "Acta de Custodia y Depósito Temporal #409"',
    timestamp: '2026-09-24 15:05:44',
    type: 'registro'
  },
  {
    id: 'act-003',
    user: 'Malitasig Oscar',
    userRole: 'Super Administrador',
    action: 'Actualización de Estado',
    details: 'Cambió el estado del vehículo PCH-3910 a "Liberado"',
    timestamp: '2026-09-28 09:12:00',
    type: 'sistema'
  }
];
