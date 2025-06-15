// config/database.js
const DATABASE_CONFIG = {
  // Tu servidor (ajusta la URL según donde subas el archivo PHP)
  BASE_URL: 'https://peluqueriaunida.com/tpv/App', // Cambia por tu dominio real

  // Endpoints basados en tu archivo FuncionesBD.php
  ENDPOINTS: {
    // Para probar conexión (puedes usar cualquier endpoint existente)
    HEALTH: '/FuncionesBD.php',

    // Endpoints existentes que puedes usar
    GET_EMPLEADOS: '/FuncionesBD.php',
    GET_CLIENTES: '/FuncionesBD.php', 
    GET_SERVICIOS: '/FuncionesBD.php',
    GET_ARTICULOS: '/FuncionesBD.php',
    CREAR_CLIENTE: '/FuncionesBD.php',
    CREAR_EMPLEADO: '/FuncionesBD.php',

    // Para crear tabla de prueba (necesitarás agregar este caso)
    CREATE_TABLE: '/FuncionesBD.php',
    INSERT_DATA: '/FuncionesBD.php',
    GET_DATA: '/FuncionesBD.php'
  },

  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/x-www-form-urlencoded', // Importante: tu PHP usa POST form data
    'Accept': 'application/json'
  }
};

export default DATABASE_CONFIG;