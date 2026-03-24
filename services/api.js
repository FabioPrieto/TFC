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

      // Convertir JSON a form data para compatibilidad con PHP
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
      console.error('Error en la petición API:', error);
      throw error;
    }
  }

  // Autenticación de la tienda con email y contraseña de admin
  async authenticateStore(storeEmail, adminPassword) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'authenticate_store',
          store_email: storeEmail,
          admin_password: adminPassword
        })
      });

      return response;
    } catch (error) {
      console.error('Error al autenticar la tienda:', error);
      return { success: false, message: 'Error al autenticar la tienda' };
    }
  }

  // Autenticación de usuario por PIN
  async authenticateUser(pin) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'authenticate',
          pin: pin
        })
      });

      return response;
    } catch (error) {
      console.error('Error al autenticar usuario:', error);
      return { success: false, message: 'Error al autenticar' };
    }
  }

  async clockIn(userId, storeId, pin) {
    try {
      const response = await this.makeRequest('/app.php', {
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
      console.error('Error al registrar entrada:', error);
      return { success: false, message: 'Error al registrar entrada' };
    }
  }

  async clockOut(userId, storeId, pin, exitType = 'FIN_TURNO') {
    try {
      const response = await this.makeRequest('/app.php', {
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
      console.error('Error al registrar salida:', error);
      return { success: false, message: 'Error al registrar salida' };
    }
  }

  async getTimeRecords(userId, storeId) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'get_fichajes_usuario',
          user_id: userId,
          store_id: storeId
        })
      });

      return response;
    } catch (error) {
      console.error('Error al obtener fichajes:', error);
      return { success: false, message: 'Error al obtener registros' };
    }
  }

  async getFestivos(storeId) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'get_festivos',
          tienda: storeId
        })
      });

      return response;
    } catch (error) {
      console.error('Error al obtener festivos:', error);
      return {};
    }
  }

  // Guarda el tema de la tienda en la base de datos
  async updateTheme(storeId, theme) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'update_theme',
          store_id: storeId,
          theme: theme
        })
      });
      return response;
    } catch (error) {
      console.error('Error al guardar el tema:', error);
      return { success: false };
    }
  }

  // Obtiene el tema guardado de la tienda en la base de datos
  async getTheme(storeId) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'get_theme',
          store_id: storeId
        })
      });
      return response;
    } catch (error) {
      console.error('Error al obtener el tema:', error);
      return { success: false, theme: 'claro' };
    }
  }

  // Guarda el idioma de la tienda en la base de datos
  async updateLanguage(storeId, language) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'update_language',
          store_id: storeId,
          language: language
        })
      });
      return response;
    } catch (error) {
      console.error('Error al guardar el idioma:', error);
      return { success: false };
    }
  }

  // Obtiene el idioma guardado de la tienda en la base de datos
  async getLanguage(storeId) {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'get_language',
          store_id: storeId
        })
      });
      return response;
    } catch (error) {
      console.error('Error al obtener el idioma:', error);
      return { success: false, language: 'es' };
    }
  }

  // Método de conexión de prueba
  async testConnection() {
    try {
      const response = await this.makeRequest('/app.php', {
        method: 'POST',
        body: JSON.stringify({
          tipo_operacion: 'test'
        })
      });

      return response;
    } catch (error) {
      console.error('Error en la prueba de conexión:', error);
      return { success: false, message: 'Error en la prueba de conexión' };
    }
  }


}

export const apiService = new ApiService();