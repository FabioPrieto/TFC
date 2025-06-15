
---

# TFC - Time Focus Control

*App móvil desarrollada con Expo y React Native enfocada en la gestión del tiempo, basada en tareas y productividad.*

## Índice

* [TFC - Time Focus Control](#tfc---time-focus-control)

  * [Índice](#índice)

    * [1. Introducción 📖](#1-introducción-)
    * [2. Objetivos del proyecto 📦](#2-objetivos-del-projecto-)
    * [3. Análisis y especificación de requisitos ⌨️](#3-análisis-y-especificación-de-requisitos-️)

      * [3.1 Requisitos funcionales](#31-requisitos-funcionales)
      * [3.2 Requisitos no funcionales](#32-requisitos-no-funcionales)
      * [3.3 Casos de uso](#33-casos-de-uso)
    * [4. Manual de instalación 🔧](#4-manual-de-instalación-)
    * [5. Uso de la herramienta ⚙️](#5-uso-de-la-herramienta-️)
    * [6. Planificación 🔩](#6-planificación-)
    * [7. Gestión de la información y datos 🖇️](#7-gestión-de-la-información-y-datos-️)
    * [8. Conclusiones 💭](#8-conclusiones-)
    * [9. Otros ❕](#9-otros-)

      * [9.1 Autor ✒️](#91-autor-️)
      * [9.2 Licencia 📄](#92-licencia-)
      * [9.3 Agradecimientos 🎁](#93-agradecimientos-)

---

### 1. Introducción 📖

Este proyecto es una aplicación móvil creada con [Expo](https://expo.dev) y React Native. El objetivo es ofrecer una herramienta para gestionar el tiempo del usuario, enfocándose en la productividad mediante técnicas como el seguimiento de tareas y control de sesiones.

Utiliza navegación basada en archivos mediante `expo-router`, almacenamiento local con `@react-native-async-storage/async-storage`, y otros componentes modernos de la suite Expo.

---

### 2. Objetivos del proyecto 📦

* Proporcionar una herramienta intuitiva para mejorar la productividad personal.
* Permitir al usuario registrar tareas y controlar el tiempo invertido en ellas.
* Implementar navegación modular y almacenamiento persistente.
* Desarrollar la app con tecnologías móviles modernas (Expo + React Native + TypeScript).

---

### 3. Análisis y especificación de requisitos ⌨️

#### 3.1 Requisitos funcionales

* Registro e inicio de sesión de usuarios (mediante contexto de autenticación).
* Navegación entre pestañas: principal, explorar, control de tiempo.
* Control de sesiones de tiempo (probablemente con temporizadores o Pomodoro).
* Persistencia de datos local (AsyncStorage).
* Diseño visual adaptable.

#### 3.2 Requisitos no funcionales

* ✅ Usabilidad móvil simple y moderna.
* ✅ Tiempo de carga mínimo mediante precarga de fuentes e imágenes.
* ✅ Estructura modular de componentes (layout, navegación, pantallas).
* 🔒 Seguridad pendiente: no se detecta autenticación segura.
* 📈 Escalabilidad: diseñada con componentes reutilizables.

#### 3.3 Casos de uso

**Caso 1:** El usuario abre la aplicación y accede a la pantalla de login.

**Caso 2:** Una vez autenticado, el usuario navega entre pestañas (`Home`, `Explore`, `Time Control`) para gestionar sus tareas.

**Caso 3:** El usuario inicia una sesión de control de tiempo y al finalizar puede ver el resumen de su progreso.

(Diagramas no incluidos en el repositorio — *pendiente*).

---

### 4. Manual de instalación 🔧

```bash
# Clonar el repositorio (fuera de este zip)
git clone https://github.com/FabioPrieto/TFC.git
cd TFC

# Instalar dependencias
npm install

# Ejecutar la aplicación
npx expo start
```

También es posible ejecutar directamente en:

```bash
# Emulador Android
npm run android

# Simulador iOS
npm run ios
```

---

### 5. Uso de la herramienta ⚙️

La app se estructura con navegación por pestañas (Tabs):

* **Pantalla principal:** tareas activas o resumen general.
* **Explore:** contenido adicional o exploración de funciones.
* **Time Control:** módulo para medir sesiones.

El `AuthContext.tsx` centraliza la autenticación del usuario (a través de contextos de React).

Las rutas están organizadas por archivos dentro de `/app/`.

*No hay pruebas automatizadas presentes en el repositorio*.

---

### 6. Planificación 🔩

| Fases                               | Tiempo estimado | Inicio     | Fin        |
| ----------------------------------- | --------------- | ---------- | ---------- |
| Análisis                            | 10h             | 01/04/2025 | 03/04/2025 |
| Diseño de interfaz                  | 15h             | 04/04/2025 | 06/04/2025 |
| Desarrollo base (login, navegación) | 20h             | 07/04/2025 | 12/04/2025 |
| Implementación control de tiempo    | 15h             | 13/04/2025 | 16/04/2025 |
| Testeo y ajustes                    | 10h             | 17/04/2025 | 19/04/2025 |
| Documentación final                 | 5h              | 20/04/2025 | 21/04/2025 |

---

### 7. Gestión de la información y datos 🖇️

No se utiliza una base de datos externa. Se detecta el uso de almacenamiento local (`@react-native-async-storage/async-storage`) para persistencia de información del usuario.

No hay modelo entidad-relación explícito, ni uso de ORM, por lo que este aspecto se considera *pendiente*.

---

### 8. Conclusiones 💭

TFC presenta una arquitectura moderna y clara para apps móviles, destacando por:

* Uso de `expo-router` para una navegación flexible y escalable.
* Modularidad y buenas prácticas con React Context.
* Interfaz visual cuidada y adaptable.

Pendientes: pruebas automatizadas, seguridad avanzada, backend persistente.

---

### 9. Otros ❕

#### 9.1 Autor ✒️

* Fabio Prieto – [GitHub/FabioPrieto](https://github.com/FabioPrieto)

#### 9.2 Licencia 📄

* Licencia: Propietaria / Privada – Todos los derechos reservados. Ver [LICENSE](./LICENSE).

#### 9.3 Agradecimientos 🎁

Gracias a la comunidad de Expo y React Native por la documentación y soporte.

---

¿Deseas que te lo entregue como archivo descargable `DOCUMENTACION.md` o quieres que lo incluya dentro del repositorio como archivo?
