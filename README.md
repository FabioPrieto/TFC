## 📌 Sistema de Control Horario

**TFC - Sistema de Control Horario para Empleados**

Aplicación móvil multiplataforma desarrollada con Expo Router (React Native + TypeScript) para la gestión de fichajes de empleados en un entorno TPV. Permite registrar entradas y salidas, consultar datos y generar informes exportables en .csv para cumplir con los requisitos de inspecciones laborales del Ministerio de Trabajo.

---

## 🎯 Objetivo del proyecto

1. 🕒 Implementar un sistema de control horario fiable que registre entradas y salidas de empleados.

2. 🧾 Permitir la exportación de registros a archivos .csv, cumpliendo con los requisitos de auditoría del Ministerio de Trabajo.

3. 📅 Facilitar el seguimiento de turnos y jornadas laborales, tanto completas como parciales (descansos).

4. 📲 Proveer una interfaz móvil simple e intuitiva que permita a los empleados fichar desde la app.

5. 🌐 Establecer una conexión con un backend remoto en PHP que almacene y consulte los datos necesarios.

6. 📊 Servir como una herramienta para la gestión interna y auditoría de la actividad laboral del personal.

---

## 🧠 Tecnologías y lenguajes usados

* **Lenguaje**: TypeScript (`.tsx`, `.ts`)
* **Framework móvil**: [Expo SDK](https://docs.expo.dev/) + [Expo Router](https://expo.github.io/router/)
* **UI / Navegación**:

  * React Native (componentes básicos)
  * `@react-navigation/bottom-tabs` para pestañas inferiores
  * `@expo/vector-icons` para iconos
* **Almacenamiento local**: `@react-native-async-storage/async-storage`
* **WebView**: `react-native-webview` (si se necesitan vistas web)
* **Linter / Formato**: ESLint (`eslint-config-expo`), TypeScript
* **Otros**:

  * `react-native-screens`, `react-native-safe-area-context`
  * `expo-asset`, `expo-file-system` (gestión de assets)

---

## 🚀 Cómo ejecutar el proyecto

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/FabioPrieto/TFC.git
   cd TFC
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar la URL del backend**
   Edita `config/database.js`, ajustando `BASE_URL` a tu dominio con el archivo `FuncionesBD.php`.

   ```js
   const DATABASE_CONFIG = {
     BASE_URL: 'https://tu-dominio.com/tpv/App',
     …
   }
   ```

4. **Levantar el servidor de desarrollo**

   ```bash
   npm run start
   # Para Android
   npm run android
   # Para iOS
   npm run ios
   # Para Web
   npm run web
   ```

5. **(Opcional) Resetear proyecto**
   Si necesitas limpiar caches o restablecer carpetas:

   ```bash
   npm run reset-project
   ```

---

## 🧪 Instrucciones para testing

Actualmente no hay tests automatizados incluidos. Para verificar funcionalidades:

1. Inicia la app en tu emulador/dispositivo.
2. Utiliza la pestaña **Conexión** o similar para ejecutar `test_conexion`.
3. Navega por cada pestaña (Empleados, Clientes, Servicios, Artículos) y asegúrate de que los datos se cargan correctamente.
4. Prueba crear un nuevo cliente desde el formulario y confirma su aparición en la lista.

---

## 🤝 Instrucciones para contribuir

* **Issues**: Reporta bugs o solicita features en la sección de *Issues* del repositorio.
* **Pull Requests**:

  1. Crea un branch con prefijo `feature/` o `bugfix/`.
  2. Escribe commits claros y descriptivos.
  3. Añade descripciones en tu PR explicando cambios y cómo probarlos.

---

## 📁 Estructura de carpetas y explicación general

```text
/
├─ app/                   # Rutas de Expo Router (.tsx)
│  ├─ index.tsx           # Pantalla principal / landing
│  ├─ _layout.tsx         # Layout global (tabs, header)
│  └─ +not-found.tsx      # 404 interno
├─ assets/                # Imágenes, iconos, fuentes
├─ config/
│  └─ database.js         # Configuración de endpoints y BASE_URL
├─ constants/
│  └─ Colors.ts           # Paleta de colores de la app
├─ hooks/                 # Hooks personalizados (tema, colorScheme)
├─ services/              # Lógica de conexión al backend
│  ├─ apiService.js       # Cliente HTTP con URLSearchParams
│  └─ DatabaseService.js  # Abstracción para llamadas CRUD
├─ scripts/
│  └─ reset-project.js    # Limpieza de caches y carpetas temporales
├─ .vscode/               # Configuración de VSCode
├─ app.json               # Configuración Expo
├─ eas.json               # EAS Build config
├─ package.json           # Dependencias y scripts
├─ tsconfig.json          # Configuración TypeScript
└─ eslint.config.js       # Reglas de linting
```

---

## ✨ Funcionalidades principales

* **Test de conexión**: Verificar alcance del servidor PHP.
* **Listado de Empleados**: Fetch de `/FuncionesBD.php?tipo_operacion=get_empleados`.
* **Listado de Clientes**: Fetch de `/FuncionesBD.php?tipo_operacion=get_clientes`.
* **Listado de Servicios**: Fetch de `/FuncionesBD.php?tipo_operacion=get_servicios`.
* **Listado de Artículos**: Fetch de `/FuncionesBD.php?tipo_operacion=get_articulos`.
* **Creación de Cliente**: Formulario para `tipo_operacion=crear_cliente`.
* **Operaciones genéricas**: Se pueden extender endpoints en `config/database.js`.

---

## 📚 Recursos adicionales

* **Backend PHP**: `FuncionesBD.php` del proyecto TPV
* **Expo Router Docs**: [https://expo.github.io/router/](https://expo.github.io/router/)
* **AsyncStorage**: [https://react-native-async-storage.github.io/async-storage/](https://react-native-async-storage.github.io/async-storage/)
* **React Navigation**: [https://reactnavigation.org/](https://reactnavigation.org/)

---

## 👨‍💻 Autor/es y créditos

* **Autor**: Fabio Prieto – [github.com/FabioPrieto](https://github.com/FabioPrieto)
* Inspirado en sistemas TPV de peluquería y demostraciones de Expo Router.
