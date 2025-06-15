import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const { user, logout } = useAuth();

  const storeName = "Mi Tienda";

  useEffect(() => {
    const tabList = document.querySelector('.r-pointerEvents-105ug2t');
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
      } else {
        response = await apiService.clockOut(
          user?.id,
          user?.storeId,
          pin,
          exitType
        );
      }

      if (response.success) {
        Alert.alert(
          "Éxito",
          modalType === "ENTRADA"
            ? "¡Llegada registrada correctamente!"
            : `¡Salida registrada correctamente! (${
                exitType === "DESCANSO" ? "Descanso" : "Fin de turno"
              })`
        );
        loadTimeRecords();
      } else {
        Alert.alert(
          "Error",
          response.message || `Error al registrar ${modalType.toLowerCase()}`
        );
      }
    } catch (error) {
      Alert.alert("Error", `Error al registrar ${modalType.toLowerCase()}`);
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    alignItems: "flex-start",
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 34,
    color: "#666",
    marginBottom: 8,
    textTransform: "capitalize",
    textAlign: "center",
  },
  timeText: {
    fontSize: 64,
    fontWeight: "300",
    color: "#2196F3",
    fontFamily: "monospace",
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 8,
  },
  logoutText: {
    color: "#ff4444",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    textAlign: "center",
    // alignItems: 'center',
    marginTop: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  arrivalButton: {
    backgroundColor: "#4CAF50",
  },
  departureButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
