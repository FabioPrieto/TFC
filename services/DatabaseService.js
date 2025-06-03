// services/DatabaseService.js
import DATABASE_CONFIG from '../config/database.js';

class DatabaseService {
  constructor() {
    this.baseUrl = DATABASE_CONFIG.BASE_URL;
    this.headers = DATABASE_CONFIG.DEFAULT_HEADERS;
  }

  // Método helper para hacer peticiones POST con form data
  async makeRequest(endpoint, data) {
    try {
      // Convertir objeto a FormData para tu PHP
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.text(); // Tu PHP devuelve JSON como texto

      if (response.ok) {
        try {
          const jsonResult = JSON.parse(result);
          console.log('✅ Respuesta exitosa:', jsonResult);
          return { success: true, data: jsonResult };
        } catch (e) {
          // Si no es JSON válido, devolver como texto
          console.log('✅ Respuesta exitosa (texto):', result);
          return { success: true, data: result };
        }
      } else {
        console.error('❌ Error en respuesta:', result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para probar la conexión usando un endpoint existente
  async testConnection() {
    try {
      const result = await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.HEALTH, {
        tipo_operacion: 'get_empleados_clientes_servicios',
        tienda: 1 // ID de tu tienda
      });

      if (result.success) {
        console.log('✅ Conexión exitosa con la base de datos');
        return { success: true, message: 'Conexión establecida' };
      } else {
        return { success: false, error: 'No se pudo conectar' };
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener empleados (usando tu endpoint existente)
  async getEmpleados(tiendaId = 1) {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.GET_EMPLEADOS, {
      tipo_operacion: 'get_empleados',
      tienda: tiendaId
    });
  }

  // Método para obtener clientes
  async getClientes(tiendaId = 1) {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.GET_EMPLEADOS, {
      tipo_operacion: 'get_empleados_clientes_servicios',
      tienda: tiendaId
    });
  }

  // Método para obtener servicios
  async getServicios() {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.GET_SERVICIOS, {
      tipo_operacion: 'get_servicios'
    });
  }

  // Método para obtener artículos
  async getArticulos() {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.GET_ARTICULOS, {
      tipo_operacion: 'get_articulos'
    });
  }

  // Método para crear un cliente (usando tu endpoint existente)
  async crearCliente(nombre, nif, email, telefono, comentarios, tiendaId = 1) {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.CREAR_CLIENTE, {
      tipo_operacion: 'crear_cliente',
      tienda: tiendaId,
      nombre: nombre,
      nif: nif,
      email: email,
      tlf: telefono,
      comentarios: comentarios
    });
  }

  // Método para crear un empleado (usando tu endpoint existente)
  async crearEmpleado(usuario, password, nombre, nif, telefono, tiendaId = 1) {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.CREAR_EMPLEADO, {
      tipo_operacion: 'crear_empleado',
      tienda: tiendaId,
      user: usuario,
      pass: password,
      nombre: nombre,
      nif: nif,
      tlf: telefono
    });
  }

  // Método para búsqueda global (usando tu endpoint existente)
  async busquedaGlobal(termino) {
    return await this.makeRequest('/FuncionesBD.php', {
      tipo_operacion: 'busqueda_global',
      key: termino
    });
  }

  // Método para obtener tickets abiertos
  async getTicketsAbiertos(tiendaId = 1) {
    return await this.makeRequest('/FuncionesBD.php', {
      tipo_operacion: 'get_tickets_abiertos',
      tienda: tiendaId
    });
  }

  // Método para crear un ticket
  async crearTicket(tiendaId, empleadoId, clienteId) {
    return await this.makeRequest('/FuncionesBD.php', {
      tipo_operacion: 'crear_ticket',
      tienda: tiendaId,
      empleado: empleadoId,
      cliente: clienteId
    });
  }

  // MÉTODOS NUEVOS PARA TABLA DE PRUEBA
  // Necesitarás agregar estos casos a tu FuncionesBD.php

  // Método para crear tabla de prueba
  async createTestTable() {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.CREATE_TABLE, {
      tipo_operacion: 'crear_tabla_prueba'
    });
  }

  // Método para insertar datos de prueba
  async insertTestData(nombre, email) {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.INSERT_DATA, {
      tipo_operacion: 'insertar_datos_prueba',
      nombre: nombre,
      email: email
    });
  }

  // Método para obtener datos de prueba
  async getTestData() {
    return await this.makeRequest(DATABASE_CONFIG.ENDPOINTS.GET_DATA, {
      tipo_operacion: 'obtener_datos_prueba'
    });
  }
}

export default new DatabaseService();
