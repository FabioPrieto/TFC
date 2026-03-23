import { router } from 'expo-router';
import React, { useEffect, useState, useRef } from "react";
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
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinner from "../../components/LoadingSpinner";
import PinModal from "../../components/PinModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { translations, languageNames, type Language } from "../../i18n/translations";
import { ThemeColors, type AppTheme } from "../../constants/Colors";

const backgroundImage = require("../../assets/backgrounds/fondo_1_tpv.jpg");
const logoImage = require("../../assets/images/logoPeluqueriaUnida.png");
const logoImageWhite = require("../../assets/images/logo_peluqueria_unida_blanco.png");

export default function TimeControlScreen() {
  const { width } = useWindowDimensions();
  const scale = Math.min(width / 1024, 1);
  const responsivo = (minimo: number, ideal: number) => Math.max(minimo, ideal * scale);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [timeRecords, setTimeRecords] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [modalType, setModalType] = useState<"ENTRADA" | "SALIDA" | "AJUSTES">("ENTRADA");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [theme, setTheme] = useState<AppTheme>("claro");
  const [language, setLanguage] = useState<Language>("es");
  const t = translations[language];

  // --- ESTADOS PARA LA PANTALLA DE MENSAJES (SIN MODAL) ---
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackSubtitle, setFeedbackSubtitle] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("#4CAF50");
  const [feedbackTime, setFeedbackTime] = useState(""); // Hora exacta del fichaje
  const [employeeName, setEmployeeName] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, logout } = useAuth();
  const storeNameDisplay = user?.name || "Rocholl";

  useEffect(() => {
    if (Platform.OS === 'web') {
      const tabList = document.querySelector(".r-pointerEvents-105ug2t");
      if (tabList) (tabList as HTMLElement).style.display = "none";
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user?.rutaId) return;

    const loadInitialData = async () => {
      loadTimeRecords();
      try {
        const themeResponse = await apiService.getTheme(user.rutaId);
        if (themeResponse && themeResponse.success && themeResponse.theme) {
          setTheme(themeResponse.theme);
        }
        const langResponse = await apiService.getLanguage(user.rutaId);
        if (langResponse && langResponse.success && 
            langResponse.language
            && ["es", "ca", "eu", "gl", "en"].includes(langResponse.language)) {
          setLanguage(langResponse.language);
          await AsyncStorage.setItem("appLanguage", langResponse.language);
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      }
    };

    loadInitialData();
  }, [user?.rutaId]);

  const loadTimeRecords = async () => {
    if (!user) return;
    try {
      const response = await apiService.getTimeRecords(user.id, user.rutaId);
      if (response.success) setTimeRecords(response.records || []);
    } catch (error) {
      console.error("Error al cargar los fichajes:", error);
    }
  };

  const selectTheme = async (newTheme: AppTheme) => {
    setTheme(newTheme);
    try {
      if (user?.rutaId) {
        await apiService.updateTheme(user.rutaId, newTheme);
      }
    } catch (error) {
      console.error("Error al guardar el tema:", error);
    }
  };

  const selectLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    try {
      await AsyncStorage.setItem("appLanguage", newLang);
      if (user?.rutaId) {
        await apiService.updateLanguage(user.rutaId, newLang);
      }
    } catch (error) {
      console.error("Error al guardar el idioma:", error);
    }
  };

  const handleClockIn = () => {
    setModalType("ENTRADA");
    setShowPinModal(true);
  };

  const handleClockOut = () => {
    setModalType("SALIDA");
    setShowPinModal(true);
  };

  const calcularMensajeDespedida = async (nombreEmpleadoActual: string) => {
    try {
      const festivos = await apiService.getFestivos(user?.rutaId);
      const hoy = new Date();
      let hayFestivoExtra = false;
      let hayFinDeSemana = false;
      for (let i = 1; i <= 7; i++) {
        const siguiente = new Date(hoy);
        siguiente.setDate(hoy.getDate() + i);

        const diaSemana = siguiente.getDay();
        if (diaSemana === 0 || diaSemana === 6) {
          hayFinDeSemana = true;
          continue;
        }
        const fechaStr = siguiente.toISOString().split("T")[0];
        if (festivos[fechaStr]) {
          hayFestivoExtra = true;
          continue;
        }
        return { mensaje: hayFestivoExtra ? t.felizFestivo(nombreEmpleadoActual) : "", hayFinDeSemana };
      }
      return { mensaje: "", hayFinDeSemana };
    } catch {
      return { mensaje: "", hayFinDeSemana: false };
    }
  };

  // --- LÓGICA PARA MOSTRAR EL MENSAJE EN PANTALLA ---
  const triggerFeedback = (emoji: string, title: string, subtitle: string, color: string) => {
    setFeedbackEmoji(emoji);
    setFeedbackTitle(title);
    setFeedbackSubtitle(subtitle);
    setFeedbackColor(color);
    
    // Congelamos la hora exacta
    const horaFichaje = new Date().toLocaleTimeString(t.dateLocale, { hour: "2-digit", minute: "2-digit", hour12: false });
    setFeedbackTime(horaFichaje);
    
    setShowFeedback(true);

    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      setShowFeedback(false);
    }, 4000); // 4 segundos
  };

  const handlePinConfirm = async (pin: string, exitType?: "DESCANSO" | "FIN_TURNO") => {
    setShowPinModal(false);
    if (modalType === "AJUSTES") {
      const response = await apiService.authenticateStore(user?.name, pin);
      if (response.success) {
        setShowSettingsModal(true);
      } else {
        triggerFeedback("❌", "Error", "PIN de Ajustes incorrecto", "#f44336");
      }
      return;
    }

    setIsLoading(true);
    try {
      let response: any;
      if (modalType === "ENTRADA") {
        response = await apiService.clockIn(user?.id, user?.rutaId, pin);
        if (response.success) {
          const nombreActual = response.user_name || response.nombre_empleado || response.nombre || response.empleado || "";
          if (nombreActual) setEmployeeName(nombreActual);
          
          // Lógica corregida para el descanso
          if (response.entry_type === "VUELTA_DESCANSO") {
              triggerFeedback("🔥", "¡De vuelta!", `${nombreActual}, continuemos con energía`, "#2196F3");
          } else {
              triggerFeedback("👋", `¡Buenos días, ${nombreActual}!`, "Turno iniciado correctamente", "#4CAF50");
          }
        } else {
          triggerFeedback("❌", "Error", response.message || "PIN incorrecto", "#f44336");
        }

      } else {
        response = await apiService.clockOut(user?.id, user?.rutaId, pin, exitType);
        if (response.success) {
          const nombreActual = response.user_name || response.nombre_empleado || response.nombre || response.empleado || "";
          if (nombreActual) setEmployeeName(nombreActual);

          if (exitType === "DESCANSO") {
            triggerFeedback("☕", "¡Hasta ahora!", "Disfruta de tu descanso", "#FF9800");
          } else {
            const resultado = await calcularMensajeDespedida(nombreActual);
            const titulo = resultado.hayFinDeSemana ? t.buenFinDeSemana : "Turno completado";

            triggerFeedback("🏁", titulo, resultado.mensaje || `¡Que descanses bien, ${nombreActual}!`, "#9C27B0");
          }
        } else {
          const msg = response.message || "";
          if (msg.toLowerCase().includes("no hay entrada") || msg.toLowerCase().includes("fichado")) {
            triggerFeedback("⚠️", "¡Te has colado!", "No has fichado al entrar y estás fichando salida", "#f44336");
          } else {
            triggerFeedback("❌", "Oops!", msg, "#f44336");
          }
        }
      }

      if (response.success) loadTimeRecords();
    } catch (error) {
      triggerFeedback("❌", "Error", "No se pudo conectar con el servidor", "#f44336");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsPress = () => {
    setModalType("AJUSTES");
    setShowPinModal(true);
  };

  const handleLogout = () => {
    setShowSettingsModal(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (logout) logout();
    router.replace('/login');
  };

  if (isLoading) return <LoadingSpinner />;

  const tc = ThemeColors[theme];
  const textColor = tc.text;
  const clockColor = tc.clock;
  const currentLogo = (theme === "oscuro" || theme === "azul") ? logoImageWhite : logoImage;

  return (
    <View style={[styles.mainWrapper, { backgroundColor: tc.wrapperBackground }]}>
      <ImageBackground
        source={tc.showBackgroundImage ? backgroundImage : { uri: "" }}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={tc.showBackgroundImage ? { opacity: 1 } : { opacity: 0 }}
      >
        <SafeAreaView style={styles.container}>
          
          {showFeedback ? (
            /* --- VISTA DE MENSAJES LIMPIA Y CENTRADA --- */
            <Pressable 
              style={styles.feedbackContainer} 
              onPress={() => {
                setShowFeedback(false);
                if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
              }}
            >
              <Text style={[styles.feedbackEmoji, { fontSize: responsivo(80, 160) }]}>
                {feedbackEmoji}
              </Text>
              
              <Text style={[styles.feedbackTitle, { color: feedbackColor, fontSize: responsivo(35, 75) }]}>
                {feedbackTitle}
              </Text>
              
              {feedbackSubtitle ? (
                <Text style={[styles.feedbackSubtitle, { color: textColor, fontSize: responsivo(18, 35) }]}>
                  {feedbackSubtitle}
                </Text>
              ) : null}

              <Text style={[styles.feedbackSubtitle, { color: textColor, fontSize: responsivo(18, 35), marginTop: responsivo(10, 20), fontWeight: "bold" }]}>
                {feedbackTime}
              </Text>

              <Text style={[styles.feedbackTouchNote, { color: textColor, fontSize: responsivo(14, 24) }]}>
                (Toca la pantalla para volver)
              </Text>
            </Pressable>
          ) : (
            /* --- VISTA NORMAL (RELOJ Y BOTONES) --- */
            <>
              {/* CABECERA DIVIDIDA EN 3 PARA CENTRAR EL NOMBRE DE LA TIENDA */}
              <View style={[styles.header, { backgroundColor: tc.headerBackground, padding: responsivo(10, 15) }]}>
                
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                   <Text numberOfLines={1} style={{ fontSize: responsivo(16, 24), color: "white", fontWeight: "600" }}>
                      {employeeName}
                   </Text>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text numberOfLines={1} style={[styles.storeName, { fontSize: responsivo(18, 28) }]}>
                    {storeNameDisplay}
                  </Text>
                </View>

                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
                    <Ionicons name="settings-sharp" size={responsivo(18, 24)} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

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
            </>
          )}

          <View style={styles.logoContainer}>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.peluqueriaunida.com/")}>
              <Image
                source={currentLogo}
                style={[styles.logo, {
                  width: responsivo(180, 500),
                  height: responsivo(45, 150)
                }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <PinModal visible={showPinModal} onClose={() => setShowPinModal(false)} onConfirm={handlePinConfirm} type={modalType} translations={t} />
        </SafeAreaView>

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

        <Modal
          visible={showLogoutModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.logoutModalOverlay}>
            <View style={[styles.logoutModalBox, { backgroundColor: tc.modalBg }]}>
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
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  settingsButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    marginRight: 10,
  },
  
  // --- ESTILOS DE LA PANTALLA DE MENSAJES ---
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  feedbackEmoji: {
    marginBottom: 20,
    textAlign: "center",
  },
  feedbackTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  feedbackSubtitle: {
    textAlign: "center",
    fontWeight: "600",
    opacity: 0.8,
  },
  feedbackTouchNote: {
    marginTop: 40,
    opacity: 0.5,
    fontStyle: "italic",
    textAlign: "center",
  },
  // ------------------------------------------

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
    textTransform: "capitalize",
    fontWeight: "600",
  },
  timeText: {
    fontWeight: "300",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 2,
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