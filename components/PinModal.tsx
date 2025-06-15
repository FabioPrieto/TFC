import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (pin: string, exitType?: "DESCANSO" | "FIN_TURNO") => void;
  type: "ENTRADA" | "SALIDA";
}

const PinModal: React.FC<PinModalProps> = ({
  visible,
  onClose,
  onConfirm,
  type,
}) => {
  const [pin, setPin] = useState("");
  const [showExitOptions, setShowExitOptions] = useState(false);

  const handleNumberPress = (number: string) => {
  if (pin.length < 4) {
    const newPin = pin + number;
    setPin(newPin);

    if (newPin.length === 4) {
      if (type === 'SALIDA') {
        setShowExitOptions(true); // Mostrar opciones de salida
      } else {
        onConfirm(newPin); // Confirmar directamente
        handleClear();
      }
    }
  }
};

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
    setShowExitOptions(false);
  };

  // const handleConfirm = () => {
  //   if (pin.length !== 4) {
  //     Alert.alert("Error", "El PIN debe tener 4 dígitos");
  //     return;
  //   }

  //   if (type === "SALIDA") {
  //     setShowExitOptions(true);
  //   } else {
  //     onConfirm(pin);
  //     handleClear();
  //   }
  // };

  const handleExitTypeSelection = (exitType: "DESCANSO" | "FIN_TURNO") => {
    onConfirm(pin, exitType);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
    onClose();
  };

  const renderKeypad = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];

    return (
      <View style={styles.keypad}>
        {numbers.map((num, index) => {
          if (num === "") {
            if (index === 9) {
              return <View key={index} style={styles.emptyKey} />;
            }
            if (index === 11) {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.key, styles.backspaceKey]}
                  onPress={handleBackspace}
                >
                  <Text style={styles.backspaceText}>⌫</Text>
                </TouchableOpacity>
              );
            }
            return <View key={index} style={styles.emptyKey} />;
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => handleNumberPress(num)}
            >
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderPinDisplay = () => {
    return (
      <View style={styles.pinDisplay}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[styles.pinDot, pin.length > index && styles.pinDotFilled]}
          />
        ))}
      </View>
    );
  };

  const renderExitOptions = () => {
    return (
      <View style={styles.exitOptions}>
        <Text style={styles.exitTitle}>Tipo de salida:</Text>
        <TouchableOpacity
          style={[styles.exitButton, styles.breakButton]}
          onPress={() => handleExitTypeSelection("DESCANSO")}
        >
          <Text style={styles.exitButtonText}>Salida por Descanso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exitButton, styles.endShiftButton]}
          onPress={() => handleExitTypeSelection("FIN_TURNO")}
        >
          <Text style={styles.exitButtonText}>Fin de Turno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exitButton, styles.cancelExitButton]}
          onPress={() => setShowExitOptions(false)}
        >
          <Text style={styles.exitButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {type === "ENTRADA" ? "Registrar Llegada" : "Registrar Salida"}
            </Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {!showExitOptions ? (
            <>
              <Text style={styles.instruction}>
                Introduce tu PIN de 4 dígitos
              </Text>

              {renderPinDisplay()}

              {renderKeypad()}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.confirmButton,
                    pin.length !== 4 && styles.disabledButton,
                  ]}
                  onPress={handleConfirm}
                  disabled={pin.length !== 4}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity> */}
              </View>
            </>
          ) : (
            renderExitOptions()
          )}
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  instruction: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginHorizontal: 10,
  },
  pinDotFilled: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  key: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 35,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    margin: "1.5%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyKey: {
    width: "30%",
    aspectRatio: 1,
    margin: "1.5%",
  },
  backspaceKey: {
    backgroundColor: "#ff6b6b",
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  backspaceText: {
    fontSize: 20,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  confirmButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  exitOptions: {
    alignItems: "center",
  },
  exitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  exitButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  breakButton: {
    backgroundColor: "#FF9800",
  },
  endShiftButton: {
    backgroundColor: "#f44336",
  },
  cancelExitButton: {
    backgroundColor: "#9E9E9E",
  },
  exitButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default PinModal;
