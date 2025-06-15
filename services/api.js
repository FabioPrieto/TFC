import DATABASE_CONFIG from '../config/database';

class ApiService {
  constructor() {
    this.baseURL = DATABASE_CONFIG.BASE_URL;
    this.defaultHeaders = DATABASE_CONFIG.DEFAULT_HEADERS;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;

      console.log(JSON.stringify(options))

      // Convert JSON data to form data for PHP compatibility
      let body = options.body;
      if (options.method === 'POST' && typeof body === 'string') {
        const jsonData = JSON.parse(body);
        const formData = new URLSearchParams();
        Object.keys(jsonData).forEach(key => {
          formData.append(key, jsonData[key]);
        });
        body = formData.toString();
      }

      const response = await fetch(url, {
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
        body,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Updated authentication method for store-based auth
  async authenticateStore(storeName, adminPassword) {
    try {
      const response = await this.makeRequest('/FuncionesBD.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'authenticate_store',
          store_name: storeName,
          admin_password: adminPassword
        })
      });

      return response;
    } catch (error) {
      console.error('Store authentication error:', error);
      return { success: false, message: 'Store authentication failed' };
    }
  }

  // Keep the old method for backward compatibility if needed
  async authenticateUser(pin) {
    try {
      const response = await this.makeRequest('/FuncionesBD.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'authenticate',
          pin: pin
        })
      });

      return response;
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  async clockIn(userId, storeId, pin) {
    try {
      const response = await this.makeRequest('/FuncionesBD.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'fichar_entrada',
          user_id: userId,
          store_id: storeId,
          pin: pin,
          timestamp: new Date().toISOString()
        })
      });

      return response;
    } catch (error) {
      console.error('Clock in error:', error);
      return { success: false, message: 'Error al registrar entrada' };
    }
  }

  async clockOut(userId, storeId, pin, exitType = 'FIN_TURNO') {
    try {
      const response = await this.makeRequest('/FuncionesBD.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'fichar_salida',
          user_id: userId,
          store_id: storeId,
          pin: pin,
          exit_type: exitType,
          timestamp: new Date().toISOString()
        })
      });

      return response;
    } catch (error) {
      console.error('Clock out error:', error);
      return { success: false, message: 'Error al registrar salida' };
    }
  }

  async getTimeRecords(userId, storeId) {
    try {
      const response = await this.makeRequest('/FuncionesBD.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'get_fichajes_usuario',
          user_id: userId,
          store_id: storeId
        })
      });

      return response;
    } catch (error) {
      console.error('Get time records error:', error);
      return { success: false, message: 'Error al obtener registros' };
    }
  }

  // Test connection method
  async testConnection() {
    try {
      const response = await this.makeRequest('/FuncionesBD.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'test'
        })
      });

      return response;
    } catch (error) {
      console.error('Connection test error:', error);
      return { success: false, message: 'Connection test failed' };
    }
  }


}

export const apiService = new ApiService();