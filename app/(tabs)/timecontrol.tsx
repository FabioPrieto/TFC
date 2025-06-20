import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfirmationModal from "../../components/ConfirmationModal"; // Nuevo import
import LoadingSpinner from "../../components/LoadingSpinner";
import PinModal from "../../components/PinModal";
import { apiService } from "../../services/api";
import { useAuth } from "../context/AuthContext";

export default function TimeControlScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [timeRecords, setTimeRecords] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [modalType, setModalType] = useState<"ENTRADA" | "SALIDA">("ENTRADA");
  
  // Estados para el modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState<"ENTRADA" | "SALIDA_DESCANSO" | "SALIDA_FIN_TURNO" | "VUELTA_DESCANSO" | "ERROR">("ENTRADA");
  const [isSuccess, setIsSuccess] = useState(true);
  
  const { user, logout } = useAuth();

  const storeName = user?.name || "Tienda";

  useEffect(() => {
    const tabList = document.querySelector(".r-pointerEvents-105ug2t");
    if (tabList) {
      (tabList as HTMLElement).style.display = "none";
    }
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadTimeRecords();

    return () => clearInterval(timer);
  }, []);

  const loadTimeRecords = async () => {
    if (!user) return;

    try {
      const response = await apiService.getTimeRecords(user.id, user.storeId);
      if (response.success) {
        setTimeRecords(response.records || []);
      }
    } catch (error) {
      console.error("Error loading time records:", error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "long" });
    return `${dayName} - ${day} - ${month}`;
  };

  const handleClockIn = () => {
    setModalType("ENTRADA");
    setShowPinModal(true);
  };

  const handleClockOut = () => {
    setModalType("SALIDA");
    setShowPinModal(true);
  };

  const showConfirmation = (type: typeof confirmationType, success: boolean) => {
    setConfirmationType(type);
    setIsSuccess(success);
    setShowConfirmationModal(true);
  };

  const handlePinConfirm = async (
    pin: string,
    exitType?: "DESCANSO" | "FIN_TURNO"
  ) => {
    setIsLoading(true);
    setShowPinModal(false);

    try {
      let response;

      if (modalType === "ENTRADA") {
        response = await apiService.clockIn(user?.id, user?.storeId, pin);
        
        if (response.success) {
          // Determinar si es entrada normal o vuelta de descanso
          // Aquí puedes agregar lógica para detectar si viene de un descanso
          // Por ahora asumo que es entrada normal
          showConfirmation("ENTRADA", true);
        } else {
          showConfirmation("ERROR", false);
        }
      } else {
        response = await apiService.clockOut(
          user?.id,
          user?.storeId,
          pin,
          exitType
        );

        if (response.success) {
          if (exitType === "DESCANSO") {
            showConfirmation("SALIDA_DESCANSO", true);
          } else {
            showConfirmation("SALIDA_FIN_TURNO", true);
          }
        } else {
          showConfirmation("ERROR", false);
        }
      }

      if (response.success) {
        loadTimeRecords();
      }
    } catch (error) {
      showConfirmation("ERROR", false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar Sesión", onPress: logout },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.storeName}>{storeName}</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.arrivalButton]}
            onPress={handleClockIn}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Llegada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.departureButton]}
            onPress={handleClockOut}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Salida</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PinModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handlePinConfirm}
        type={modalType}
      />

      <ConfirmationModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        type={confirmationType}
        isSuccess={isSuccess}
      />
    </SafeAreaView>
  );
}

// Los estilos permanecen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    width: "100%",
    maxWidth: 1400,
    alignSelf: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#667eea",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  storeName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 0,
    flex: 1,
  },
  logoutButton: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    marginTop: 0,
    width: "100%",
  },
  dateText: {
    fontSize: 28,
    color: "#333",
    marginBottom: 8,
    textTransform: "capitalize",
    textAlign: "center",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  timeText: {
    fontSize: 64,
    fontWeight: "300",
    color: "#667eea",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 40,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#667eea",
    shadowColor: "#764ba2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  arrivalButton: {
    backgroundColor: "#667eea",
  },
  departureButton: {
    backgroundColor: "#764ba2",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
});