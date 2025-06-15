// import React, { useState } from 'react';
// import {
//     Alert,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { apiService } from '../services/api';

// const ConnectionTest: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<string>('');

//   const testConnection = async () => {
//     setIsLoading(true);
//     setResult('Testing connection...');
    
//     try {
//       const response = await apiService.testConnection();
//       if (response.success) {
//         setResult('✅ Connection successful!');
//         Alert.alert('Success', 'Connection to server is working!');
//       } else {
//         setResult('❌ Connection failed');
//         Alert.alert('Error', 'Connection failed');
//       }
//     } catch (error) {
//       setResult('❌ Connection error');
//       Alert.alert('Error', `Connection error: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity 
//         style={styles.button} 
//         onPress={testConnection}
//         disabled={isLoading}
//       >
//         <Text style={styles.buttonText}>
//           {isLoading ? 'Testing...' : 'Test Connection'}
//         </Text>
//       </TouchableOpacity>
      
//       {result ? (
//         <Text style={styles.result}>{result}</Text>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 8,
//     minWidth: 150,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   result: {
//     marginTop: 15,
//     fontSize: 16,
//     textAlign: 'center',
//   },
// });

// export default ConnectionTest;