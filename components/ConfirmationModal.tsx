import React, { useMemo } from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  type: "ENTRADA" | "SALIDA_DESCANSO" | "SALIDA_FIN_TURNO" | "VUELTA_DESCANSO" | "ERROR";
  isSuccess: boolean;
  extraMessage?: string;
  userName?: string;
  translations?: any;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  type,
  isSuccess,
  extraMessage,
  userName,
  translations: t
}) => {
  // Memorizar el mensaje para que no cambie en cada render
  const message = useMemo(() => {
    const nameTag = userName ? `, ${userName}` : "";

    if (!isSuccess) {
      const errorMsgs = t?.errorMessages || [
        "Oops! No se pudo registrar la accion",
        "Error en el sistema, intentalo de nuevo",
        "No se pudo conectar con el servidor",
        "PIN incorrecto o error en el registro",
        "Algo salio mal, por favor reintenta",
      ];
      return "❌ " + errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
    }

    switch (type) {
      case "ENTRADA":
        const entradaMsgs = t?.entradaMessages ? t.entradaMessages(nameTag) : [
          `Buenos dias${nameTag}! Turno iniciado correctamente`,
        ];
        return "✅ " + entradaMsgs[Math.floor(Math.random() * entradaMsgs.length)];

      case "SALIDA_DESCANSO":
        const descansoMsgs = t?.descansoMessages || [
          "Disfruta tu descanso! Te lo mereces",
        ];
        return "☕ " + descansoMsgs[Math.floor(Math.random() * descansoMsgs.length)];

      case "VUELTA_DESCANSO":
        const vueltaMsgs = t?.vueltaMessages || [
          "De vuelta! Continuemos con energia",
        ];
        return "🔥 " + vueltaMsgs[Math.floor(Math.random() * vueltaMsgs.length)];

      case "SALIDA_FIN_TURNO":
        const finTurnoMsgs = t?.finTurnoMessages ? t.finTurnoMessages(nameTag) : [
          `Turno completado${nameTag}! Que descanses bien`,
        ];
        return "🏁 " + finTurnoMsgs[Math.floor(Math.random() * finTurnoMsgs.length)];

      default:
        return "✅ " + (t?.accionRegistrada || "Accion registrada correctamente");
    }
  }, [type, isSuccess, t]);

  const getModalColor = () => {
    if (!isSuccess) return "#f44336";
    
    switch (type) {
      case "ENTRADA":
        return "#4CAF50";
      case "SALIDA_DESCANSO":
        return "#FF9800";
      case "VUELTA_DESCANSO":
        return "#2196F3";
      case "SALIDA_FIN_TURNO":
        return "#9C27B0";
      default:
        return "#4CAF50";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { borderTopColor: getModalColor() }]}>
          <View style={styles.content}>
            <Text style={[styles.message, { color: getModalColor() }]}>
              {message}
            </Text>
            {extraMessage ? (
              <Text style={styles.extraMessage}>{extraMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: getModalColor() }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t?.continuar || "Continuar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    maxWidth: 350,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderTopWidth: 5,
  },
  content: {
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  extraMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    fontStyle: "italic",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ConfirmationModal;