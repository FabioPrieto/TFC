import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

export default function LoginScreen() {
  const [storeName, setStoreName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!storeName.trim()) {
      Alert.alert('Error', 'Please enter store name');
      return;
    }

    if (!adminPassword.trim()) {
      Alert.alert('Error', 'Please enter admin password');
      return;
    }

    try {
      const success = await login(storeName.trim(), adminPassword);
      if (success) {
        router.replace('/(tabs)/timecontrol');
      } else {
        Alert.alert('Error', 'Invalid store name or password. Please try again.');
        setAdminPassword(''); // Clear password on failed login
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
      setAdminPassword('');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Time Control</Text>
          <Text style={styles.subtitle}>Enter store credentials to continue</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Store Name"
              value={storeName}
              onChangeText={setStoreName}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Admin Password"
              value={adminPassword}
              onChangeText={setAdminPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton, 
              (storeName.trim() && adminPassword.trim()) && styles.loginButtonActive
            ]}
            onPress={handleLogin}
            disabled={!storeName.trim() || !adminPassword.trim()}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    color: '#333',
  },
  loginButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 5,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonActive: {
    backgroundColor: '#667eea',
    // Simular gradiente con una sombra de color
    shadowColor: '#764ba2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});