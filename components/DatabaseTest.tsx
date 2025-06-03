// components/DatabaseTest.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import DatabaseService from '../services/DatabaseService';

interface DataItem {
  id: number;
  nombre: string;
  email: string;
  fecha_creacion: string;
}

const DatabaseTest: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [datos, setDatos] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('No probado');

  useEffect(() => {
    // Probar conexión al cargar el componente
    testConnection();
  }, []);

  const testConnection = async (): Promise<void> => {
    setLoading(true);
    const result = await DatabaseService.testConnection();

    if (result.success) {
      setConnectionStatus('✅ Conectado');
      Alert.alert('Éxito', 'Conexión establecida con la base de datos');
    } else {
      setConnectionStatus('❌ Sin conexión');
      Alert.alert('Error', `No se pudo conectar: ${result.error}`);
    }
    setLoading(false);
  };

  const createTable = async (): Promise<void> => {
    setLoading(true);
    const result = await DatabaseService.createTestTable();

    if (result.success) {
      Alert.alert('Éxito', 'Tabla creada correctamente');
    } else {
      Alert.alert('Error', `No se pudo crear la tabla: ${result.error}`);
    }
    setLoading(false);
  };

  const insertData = async (): Promise<void> => {
    if (!nombre.trim() || !email.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    const result = await DatabaseService.insertTestData(nombre, email);

    if (result.success) {
      Alert.alert('Éxito', 'Datos insertados correctamente');
      setNombre('');
      setEmail('');
      loadData(); // Recargar datos
    } else {
      Alert.alert('Error', `No se pudieron insertar los datos: ${result.error}`);
    }
    setLoading(false);
  };

  const loadData = async (): Promise<void> => {
    setLoading(true);
    const result = await DatabaseService.getTestData();

    if (result.success) {
      setDatos(result.data || []);
    } else {
      Alert.alert('Error', `No se pudieron cargar los datos: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Prueba de Base de Datos</Text>

      {/* Estado de conexión */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado: </Text>
        <Text style={styles.statusText}>{connectionStatus}</Text>
      </View>

      {/* Botones de prueba */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.testButton]} 
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Probar Conexión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.createButton]} 
          onPress={createTable}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Crear Tabla</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario para insertar datos */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Insertar Datos de Prueba</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity 
          style={[styles.button, styles.insertButton]} 
          onPress={insertData}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Insertar Datos</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para cargar datos */}
      <TouchableOpacity 
        style={[styles.button, styles.loadButton]} 
        onPress={loadData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Cargar Datos</Text>
      </TouchableOpacity>

      {/* Indicador de carga */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      )}

      {/* Lista de datos */}
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>Datos en la Base de Datos:</Text>
        {datos.length > 0 ? (
          datos.map((item, index) => (
            <View key={index} style={styles.dataItem}>
              <Text style={styles.dataText}>ID: {item.id}</Text>
              <Text style={styles.dataText}>Nombre: {item.nombre}</Text>
              <Text style={styles.dataText}>Email: {item.email}</Text>
              <Text style={styles.dataText}>Fecha: {item.fecha_creacion}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No hay datos disponibles</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  testButton: {
    backgroundColor: '#007AFF',
  },
  createButton: {
    backgroundColor: '#34C759',
  },
  insertButton: {
    backgroundColor: '#FF9500',
    marginTop: 10,
  },
  loadButton: {
    backgroundColor: '#5856D6',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dataItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataText: {
    fontSize: 14,
    marginBottom: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DatabaseTest;
