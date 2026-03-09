import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
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

const backgroundImage = require('../assets/backgrounds/fondo_1_tpv.jpg');

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
        setAdminPassword('');
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
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
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
                placeholderTextColor="#999"
                value={storeName}
                onChangeText={setStoreName}
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Admin Password"
                placeholderTextColor="#999"
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
                (storeName.trim() && adminPassword.trim()) ? styles.loginButtonActive : styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={!storeName.trim() || !adminPassword.trim()}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
    width: '100%',
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonActive: {
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});