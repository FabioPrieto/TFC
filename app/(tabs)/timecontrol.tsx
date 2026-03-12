import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import PinModal from "../../components/PinModal";
import { apiService } from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { translations, languageNames, type Language } from "../../i18n/translations";

const backgroundImage = require("../../assets/backgrounds/fondo_1_tpv.jpg");
const logoImage = require("../../assets/images/logoPeluqueriaUnida.png");

export default function TimeControlScreen() {
  const { width } = useWindowDimensions();
  const scale = Math.min(width / 1024, 1);
  const responsivo = (minimo: number, ideal: number) => Math.max(minimo, ideal * scale);

  // Escala responsiva basada en el ancho de pantalla (referencia: 1024px)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [timeRecords, setTimeRecords] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [modalType, setModalType] = useState<"ENTRADA" | "SALIDA" | "AJUSTES">("ENTRADA");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Estado para el modal de ajustes (tema y cerrar sesión)
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Estado para el tema actual
  const [theme, setTheme] = useState<"claro" | "oscuro" | "azul">("claro");

  // Estado para el idioma actual y acceso rápido a las traducciones
  const [language, setLanguage] = useState<Language>("es");
  const t = translations[language];

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState<"ENTRADA" | "SALIDA_DESCANSO" | "SALIDA_FIN_TURNO" | "VUELTA_DESCANSO" | "ERROR">("ENTRADA");
  const [isSuccess, setIsSuccess] = useState(true);
  const [farewellMessage, setFarewellMessage] = useState("");

  const { user, logout } = useAuth();

  const storeNameDisplay = user?.name || "ST_NAME";

  useEffect(() => {
    if (Platform.OS === 'web') {
      const tabList = document.querySelector(".r-pointerEvents-105ug2t");
      if (tabList) (tabList as HTMLElement).style.display = "none";
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Carga los fichajes y el tema guardado de la tienda en la base de datos
    const loadInitialData = async () => {
      loadTimeRecords();
      if (user?.storeId) {
        const themeResponse = await apiService.getTheme(user.storeId);
        if (themeResponse && themeResponse.success && themeResponse.theme) {
          setTheme(themeResponse.theme);
        }
        const langResponse = await apiService.getLanguage(user.storeId);
        if (langResponse && langResponse.success && langResponse.language) {
          setLanguage(langResponse.language);
        }
      }
    };

    loadInitialData();
    return () => clearInterval(timer);
  }, []);

  const loadTimeRecords = async () => {
    if (!user) return;
    try {
      const response = await apiService.getTimeRecords(user.id, user.storeId);
      if (response.success) setTimeRecords(response.records || []);
    } catch (error) {
      console.error("Error al cargar los fichajes:", error);
    }
  };

  // Cambia el tema y lo guarda en la base de datos
  const selectTheme = async (newTheme: "claro" | "oscuro" | "azul") => {
    setTheme(newTheme);

    if (user?.storeId) {
      await apiService.updateTheme(user.storeId, newTheme);
    }
  };

  // Cambia el idioma y lo guarda en la base de datos
  const selectLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    if (user?.storeId) {
      await apiService.updateLanguage(user.storeId, newLang);
    }
  };

  // Abre el PinModal para registrar llegada
  const handleClockIn = () => {
    setModalType("ENTRADA");
    setShowPinModal(true);
  };

  // Abre el PinModal para registrar salida
  const handleClockOut = () => {
    setModalType("SALIDA");
    setShowPinModal(true);
  };

  // Calcula el mensaje de despedida según el próximo día laborable
  const calcularMensajeDespedida = async () => {
    try {
      const festivos = await apiService.getFestivos(user?.storeId);
      const hoy = new Date();
      const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

      // Buscar el próximo día laborable (máximo 7 días adelante)
      for (let i = 1; i <= 7; i++) {
        const siguiente = new Date(hoy);
        siguiente.setDate(hoy.getDate() + i);

        const diaSemana = siguiente.getDay();
        // Saltar fines de semana (sábado=6, domingo=0)
        if (diaSemana === 0 || diaSemana === 6) continue;

        // Comprobar si es festivo
        const fechaStr = siguiente.toISOString().split("T")[0];
        if (festivos[fechaStr]) continue;

        // Es día laborable
        if (i === 1) {
          return t.nosVemosMañana;
        }
        return t.felizFestivo(user?.name);
      }
      return "";
    } catch {
      return "";
    }
  };

  // Se ejecuta al confirmar el PIN (entrada, salida o ajustes)
  const handlePinConfirm = async (pin: string, exitType?: "DESCANSO" | "FIN_TURNO") => {
    setShowPinModal(false);

    // Si es ajustes, validamos el PIN contra el servidor y abrimos ajustes
    if (modalType === "AJUSTES") {
      const response = await apiService.authenticateStore(user?.name, pin);
      if (response.success) {
        setShowSettingsModal(true);
      } else {
        setIsSuccess(false);
        setConfirmationType("ERROR");
        setShowConfirmationModal(true);
      }
      return;
    }

    setIsLoading(true);
    setFarewellMessage("");
    try {
      let response: any;
      if (modalType === "ENTRADA") {
        response = await apiService.clockIn(user?.id, user?.storeId, pin);
        setIsSuccess(response.success);
        setConfirmationType(response.success ? "ENTRADA" : "ERROR");
      } else {
        response = await apiService.clockOut(user?.id, user?.storeId, pin, exitType);
        setIsSuccess(response.success);

        if (response.success) {
          if (exitType === "DESCANSO") {
            setConfirmationType("SALIDA_DESCANSO");
          } else {
            const mensaje = await calcularMensajeDespedida();
            setFarewellMessage(mensaje);
            setConfirmationType("SALIDA_FIN_TURNO");
          }
        } else {
          setConfirmationType("ERROR");
        }
      }
      setShowConfirmationModal(true);
      if (response.success) loadTimeRecords();
    } catch (error) {
      setConfirmationType("ERROR");
      setIsSuccess(false);
      setShowConfirmationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Abre el PinModal para acceder a ajustes
  const handleSettingsPress = () => {
    setModalType("AJUSTES");
    setShowPinModal(true);
  };

  // Abre el modal de Cerrar Sesión
  const handleLogout = () => {
    setShowSettingsModal(false);
    setShowLogoutModal(true);
  };

  // Se ejecuta al confirmar el cierre de sesión
  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (logout) logout();
    router.replace('/login');
  };

  if (isLoading) return <LoadingSpinner />;

  // Colores según el tema seleccionado
  const appBackgroundColor = theme === "claro" ? "transparent" : theme === "oscuro" ? "#1a1a1a" : "#1e3a8a";
  const headerBackgroundColor = theme === "claro" ? "#667eea" : "rgba(255,255,255,0.1)";
  const textColor = theme === "claro" ? "#333" : "#fff";
  const clockColor = theme === "claro" ? "#667eea" : "#fff";

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme === "claro" ? "#fff" : appBackgroundColor }]}>
      <ImageBackground
        source={theme === "claro" ? backgroundImage : { uri: "" }}
        style={styles.backgroundImage}
        resizeMode="cover"
        // Mostramos la imagen solo en tema claro, si no, opacidad 0
        imageStyle={theme !== "claro" ? { opacity: 0 } : { opacity: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={[styles.header, { backgroundColor: headerBackgroundColor, padding: responsivo(10, 15) }]}>
            <Text style={[styles.storeName, { fontSize: responsivo(16, 24) }]}>{storeNameDisplay}</Text>

            <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
              <Ionicons name="settings-sharp" size={responsivo(18, 24)} color="white" />
            </TouchableOpacity>
          </View>

          {/* Modal de ajustes */}
          <Modal visible={showSettingsModal} transparent animationType="fade" onRequestClose={() => setShowSettingsModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.settingsModalBox}>
                <Text style={styles.settingsModalTitle}>{t.ajustes}</Text>

                <Text style={styles.settingsSectionTitle}>{t.tema}</Text>
                <TouchableOpacity style={styles.settingsItem} onPress={() => selectTheme("claro")}>
                  <Text style={styles.settingsItemText}>⚪ {t.claro}</Text>
                  {theme === "claro" && <Ionicons name="checkmark" size={20} color="#667eea" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem} onPress={() => selectTheme("oscuro")}>
                  <Text style={styles.settingsItemText}>⚫ {t.oscuro}</Text>
                  {theme === "oscuro" && <Ionicons name="checkmark" size={20} color="#667eea" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsItem} onPress={() => selectTheme("azul")}>
                  <Text style={styles.settingsItemText}>🔵 {t.azulNoche}</Text>
                  {theme === "azul" && <Ionicons name="checkmark" size={20} color="#667eea" />}
                </TouchableOpacity>

                <Text style={[styles.settingsSectionTitle, { marginTop: 20 }]}>{t.idioma}</Text>
                {(["es", "ca", "eu", "gl", "en"] as Language[]).map((lang) => (
                  <TouchableOpacity key={lang} style={styles.settingsItem} onPress={() => selectLanguage(lang)}>
                    <Text style={styles.settingsItemText}>{languageNames[language][lang]}</Text>
                    {language === lang && <Ionicons name="checkmark" size={20} color="#667eea" />}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.settingsLogoutBtn} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={20} color="white" />
                  <Text style={styles.settingsLogoutText}>{t.cerrarSesion}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsCloseBtn} onPress={() => setShowSettingsModal(false)}>
                  <Text style={styles.settingsCloseText}>{t.cerrar}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={[styles.content, { marginTop: responsivo(30, 150) }]}>
            <Text style={[styles.dateText, { color: textColor, fontSize: responsivo(18, 40), marginBottom: responsivo(20, 120) }]}>
                {t.formatoFecha(t.diasSemana[currentTime.getDay()], currentTime.getDate(), t.meses[currentTime.getMonth()])}
              </Text>
            
            <Text style={[styles.timeText, { color: clockColor, fontSize: responsivo(45, 290), lineHeight: responsivo(55, 360), marginBottom: responsivo(20, 60) }]}>
              {currentTime.toLocaleTimeString(t.dateLocale, { hour: "2-digit", minute: "2-digit", hour12: false })}
            </Text>

            <View style={[styles.buttonContainer, { gap: responsivo(12, 40), marginTop: responsivo(40, 120), paddingHorizontal: responsivo(16, 80) }]}>
              <TouchableOpacity style={[styles.button, styles.arrivalButton, { paddingVertical: responsivo(22, 45) }]} onPress={handleClockIn}>
                <Text style={[styles.buttonText, { fontSize: responsivo(30, 60), fontWeight: "bold" }]}>{t.llegada}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.departureButton, { paddingVertical: responsivo(22, 45) }]} onPress={handleClockOut}>
                <Text style={[styles.buttonText, { fontSize: responsivo(30, 60), fontWeight: "bold" }]}>{t.salida}</Text>
              </TouchableOpacity>
            </View>
          </View>

         <View style={styles.logoContainer}>
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

          <PinModal visible={showPinModal} onClose={() => setShowPinModal(false)} onConfirm={handlePinConfirm} type={modalType} translations={t} />
          <ConfirmationModal visible={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} type={confirmationType} isSuccess={isSuccess} extraMessage={farewellMessage} userName={user?.name} translations={t} />
        </SafeAreaView>
        {/* Modal de Cerrar Sesión */}
        <Modal
          visible={showLogoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.logoutModalOverlay}>
            <View style={[styles.logoutModalBox, { backgroundColor: theme === "claro" ? "#fff" : theme === "oscuro" ? "#2d3748" : "#1e3a8a" }]}>
              <Text style={[styles.logoutModalTitle, { color: textColor }]}>{t.cerrarSesionTitulo}</Text>
              <Text style={[styles.logoutModalText, { color: textColor }]}>{t.cerrarSesionTexto(storeNameDisplay)}</Text>

              <View style={styles.logoutModalButtonsGroup}>
                <TouchableOpacity
                  style={styles.logoutModalCancelBtn}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.logoutModalCancelText}>{t.cancelar}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutModalConfirmBtn}
                  onPress={confirmLogout}
                >
                  <Text style={styles.logoutModalConfirmText}>{t.siSalir}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 8,
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  settingsButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsModalBox: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "85%",
    maxWidth: 400,
    padding: 25,
    elevation: 10,
  },
  settingsModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingsItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingsLogoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#e53e3e",
  },
  settingsLogoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  settingsCloseBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(100,100,100,0.15)",
    alignItems: "center",
  },
  settingsCloseText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dateText: {
    marginBottom: 120,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  timeText: {
    fontWeight: "300",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 2,
    marginBottom: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  arrivalButton: {
    backgroundColor: "#667eea",
  },
  departureButton: {
    backgroundColor: "#764ba2",
  },
  buttonText: {
    color: "white",
    fontWeight: "normal",
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "auto",
    paddingBottom: Platform.OS === "ios" ? 100 : 40, 
  },
  logo: { 
  },

  // Estilos para el modal de cerrar sesión
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoutModalBox: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoutModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  logoutModalText: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    opacity: 0.8,
  },
  logoutModalButtonsGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  logoutModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(100,100,100,0.2)",
    alignItems: "center",
  },
  logoutModalCancelText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#e53e3e",
    alignItems: "center",
  },
  logoutModalConfirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});