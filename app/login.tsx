import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Linking,
  useWindowDimensions,
  ScrollView, // Importamos esto para evitar saltos y solapamientos
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from './context/AuthContext';

const backgroundImage = require('../assets/backgrounds/fondo_1_tpv.jpg');
const logoImage = require('../assets/images/logoPeluqueriaUnida.png');

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const scale = Math.min(width / 1024, 1);
  const responsivo = (minimo: number, ideal: number) => Math.max(minimo, ideal * scale);

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
        
        {/* Cambiamos el behavior en Android para que no empuje el logo bruscamente */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.content, { paddingTop: responsivo(40, 180), maxWidth: responsivo(450, 850) }]}>
              <Text style={[styles.title, { fontSize: responsivo(40, 60) }]}>Time Control</Text>
              
              <Text style={[styles.subtitle, { 
                fontSize: responsivo(16, 24), 
                marginTop: responsivo(10, 20),
                marginBottom: responsivo(40, 130) 
              }]}>
                Enter store credentials to continue
              </Text>
              
              <View style={[styles.inputContainer, { padding: responsivo(35, 65) }]}>
                <TextInput
                  style={[styles.input, { paddingVertical: responsivo(20, 45), fontSize: responsivo(18, 28), marginBottom: responsivo(25, 45) }]}
                  placeholder="Store Name"
                  placeholderTextColor="#999"
                  value={storeName}
                  onChangeText={setStoreName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <TextInput
                  style={[styles.input, { paddingVertical: responsivo(20, 45), fontSize: responsivo(18, 28), marginBottom: 0 }]}
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
                    { 
                      paddingVertical: responsivo(40, 50), 
                      marginTop: responsivo(40, 100) 
                    },
                    (storeName.trim() && adminPassword.trim()) ? styles.loginButtonActive : styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={!storeName.trim() || !adminPassword.trim()}
                >
                  <Text style={[styles.loginButtonText, { fontSize: responsivo(30, 50) }]}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* El logo está dentro del scroll. Si abres el teclado, se quedará abajo escondido sin saltar */}
            <View style={[
              styles.logoContainer, 
              { paddingBottom: Platform.OS === "ios" ? responsivo(20, 180) : responsivo(20, 130) }
            ]}>
              <TouchableOpacity onPress={() => Linking.openURL("https://www.peluqueriaunida.com/")}>
                <Image
                  source={logoImage}
                  style={[styles.logo, {
                    width: responsivo(180, 500),
                    height: responsivo(45, 150)
                  }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

          </ScrollView>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    color: '#333',
  },
  loginButton: {
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
    fontWeight: '700',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "auto", 
  },
  logo: { 
  },
});