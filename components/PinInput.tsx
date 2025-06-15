import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface PinInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  maxLength?: number;
  disableKeyboard?: boolean; // Nueva prop
}

const PinInput: React.FC<PinInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Enter PIN",
  maxLength = 4,
  disableKeyboard = false, // Por defecto false
}) => {
  const handleChangeText = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeText(numericText);
    
    // Auto-submit when max length is reached
    if (numericText.length === maxLength && onSubmit) {
      setTimeout(onSubmit, 100);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        style={[styles.input, { fontSize: 24, letterSpacing: 8 }]}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        secureTextEntry
        maxLength={maxLength}
        placeholder="••••"
        placeholderTextColor="#ccc"
        textAlign="center"
        showSoftInputOnFocus={!disableKeyboard} // Controla si aparece el teclado
        caretHidden={disableKeyboard} // Oculta el cursor cuando está deshabilitado
      />
      <View style={styles.dotsContainer}>
        {Array.from({ length: maxLength }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < value.length ? styles.filledDot : styles.emptyDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    width: 200,
    height: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -40,
    marginBottom: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  filledDot: {
    backgroundColor: '#333',
  },
  emptyDot: {
    backgroundColor: '#ddd',
  },
});

export default PinInput;