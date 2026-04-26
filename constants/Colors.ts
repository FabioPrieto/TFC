/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Mapa centralizado de temas para timecontrol.
// Para añadir un tema nuevo, solo hay que añadir una entrada aquí.
export type AppTheme = "claro" | "oscuro" | "azul";

export const ThemeColors: Record<AppTheme, {
  appBackground: string;
  wrapperBackground: string;
  headerBackground: string;
  text: string;
  clock: string;
  modalBg: string;
  modalExtraText: string;
  showBackgroundImage: boolean;
}> = {
  claro: {
    appBackground: "transparent",
    wrapperBackground: "#fff",
    headerBackground: "#667eea",
    text: "#333",
    clock: "#667eea",
    modalBg: "#fff",
    modalExtraText: "#555",
    showBackgroundImage: true,
  },
  oscuro: {
    appBackground: "#1a1a1a",
    wrapperBackground: "#1a1a1a",
    headerBackground: "rgba(255,255,255,0.1)",
    text: "#fff",
    clock: "#fff",
    modalBg: "#2d3748",
    modalExtraText: "rgba(255,255,255,0.7)",
    showBackgroundImage: false,
  },
  azul: {
    appBackground: "#1e3a8a",
    wrapperBackground: "#1e3a8a",
    headerBackground: "rgba(255,255,255,0.1)",
    text: "#fff",
    clock: "#fff",
    modalBg: "#1e3a8a",
    modalExtraText: "rgba(255,255,255,0.7)",
    showBackgroundImage: false,
  },
};
