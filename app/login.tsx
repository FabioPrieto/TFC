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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
  },
  loginButtonActive: {
    backgroundColor: '#007AFF',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});