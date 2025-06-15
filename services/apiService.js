import DATABASE_CONFIG from '../config/database';

class ApiService {
  constructor() {
    this.baseURL = DATABASE_CONFIG.BASE_URL;
    this.defaultHeaders = DATABASE_CONFIG.DEFAULT_HEADERS;
  }

  async post(data) {
    try {
      // Convert data to form format for your PHP API
      const formData = new URLSearchParams();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      const response = await fetch(`${this.baseURL}/FuncionesBD.php`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const result = await this.post({ tipo_operacion: 'test_conexion' });
      return result;
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export const apiService = new ApiService();