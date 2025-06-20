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
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  type,
  isSuccess,
}) => {
  // Memorizar el mensaje para que no cambie en cada render
  const message = useMemo(() => {
    if (!isSuccess) {
      const errorMessages = [
        "❌ Oops! No se pudo registrar la acción",
        "❌ Error en el sistema, inténtalo de nuevo",
        "❌ No se pudo conectar con el servidor",
        "❌ PIN incorrecto o error en el registro",
        "❌ Algo salió mal, por favor reintenta",
      ];
      return errorMessages[Math.floor(Math.random() * errorMessages.length)];
    }

    switch (type) {
      case "ENTRADA":
        const entradaMessages = [
          "🌅 ¡Buenos días! Turno iniciado correctamente",
          "✅ ¡Perfecto! Ya estás fichado para trabajar",
          "🎯 ¡Listo! Tu jornada laboral ha comenzado",
          "💪 ¡Excelente! Hora de dar lo mejor de ti",
          "🚀 ¡Genial! Que tengas un día productivo",
          "⭐ ¡Bienvenido! Tu turno está registrado",
        ];
        return entradaMessages[Math.floor(Math.random() * entradaMessages.length)];

      case "SALIDA_DESCANSO":
        const descansoMessages = [
          "☕ ¡Disfruta tu descanso! Te lo mereces",
          "🍽️ ¡Hora del break! Recarga energías",
          "😌 ¡Perfecto! Tómate un respiro",
          "🌟 ¡Descanso registrado! Relájate un poco",
          "⏰ ¡Genial! Tiempo de pausa merecida",
          "🧘 ¡Excelente! Momento de desconectar",
        ];
        return descansoMessages[Math.floor(Math.random() * descansoMessages.length)];

      case "VUELTA_DESCANSO":
        const vueltaMessages = [
          "🔥 ¡De vuelta! Continuemos con energía",
          "💪 ¡Perfecto! Listo para seguir trabajando",
          "⚡ ¡Genial! Vuelta al trabajo registrada",
          "🎯 ¡Excelente! Hora de retomar las tareas",
          "🚀 ¡Fantástico! Sigamos siendo productivos",
          "✨ ¡Bienvenido de vuelta! A por todas",
        ];
        return vueltaMessages[Math.floor(Math.random() * vueltaMessages.length)];

      case "SALIDA_FIN_TURNO":
        const finTurnoMessages = [
          "🏁 ¡Turno completado! Que descanses bien",
          "🌙 ¡Excelente trabajo! Hasta mañana",
          "👏 ¡Jornada finalizada! Te lo has ganado",
          "🎉 ¡Perfecto! Fin de turno registrado",
          "🌅 ¡Gran día de trabajo! Nos vemos pronto",
          "⭐ ¡Fantástico! Que tengas buena tarde/noche",
        ];
        return finTurnoMessages[Math.floor(Math.random() * finTurnoMessages.length)];

      default:
        return "✅ Acción registrada correctamente";
    }
  }, [type, isSuccess]);

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
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: getModalColor() }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Continuar</Text>
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