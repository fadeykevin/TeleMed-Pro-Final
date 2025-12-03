# 📱 TeleMed Pro - Aplicación Médica Completa

## 📋 Descripción
TeleMed Pro es una aplicación móvil desarrollada con React Native y Expo que facilita la telemedicina, gestión de citas médicas, recetas y contactos de emergencia.

---

## 🚀 Instalación

### Requisitos previos:
- Node.js 18+ instalado
- Expo CLI instalado globalmente
- Expo Go app en tu móvil (Android/iOS)

### Pasos de instalación:
```bash
# 1. Clonar el repositorio
git clone [URL_DE_TU_REPOSITORIO]
cd TeleMedProFinal

# 2. Instalar dependencias
npm install

# 3. Iniciar el proyecto
npx expo start

# 4. Escanear QR con Expo Go
```

---

## 📦 Dependencias principales
```json
{
  "expo": "~52.0.0",
  "react-native": "0.76.0",
  "react-navigation": "^4.4.4",
  "expo-image-picker": "~15.0.7",
  "expo-document-picker": "~12.0.2",
  "expo-file-system": "~17.0.1"
}
```

---

## 🏗️ Estructura del Proyecto
```
TeleMedProFinal/
├── src/
│   ├── components/
│   │   ├── Card.js
│   │   ├── NotificationBadge.js    (Componente nuevo 1)
│   │   └── LoadingSpinner.js       (Componente nuevo 2)
│   ├── screens/
│   │   ├── HomeScreen.js           (Pantalla principal)
│   │   ├── ChatScreen.js           (Chat con IA médica)
│   │   ├── AppointmentsScreen.js   (Gestión de citas)
│   │   ├── PrescriptionsScreen.js  (Recetas médicas)
│   │   ├── ProfileScreen.js        (Perfil y emergencias)
│   │   ├── LoginScreen.js          (Login)
│   │   ├── EmergencyScreen.js      (Emergencias)
│   │   └── VideoCallScreen.js      (Videollamadas)
│   └── utils/
│       └── mockData.js
├── App.js
├── package.json
└── README.md
```

---

## ✨ Características implementadas

### 🏠 Pantalla Principal (HomeScreen)
- Dashboard con accesos rápidos
- Próximas citas
- Estadísticas de salud

### 💬 Chat Médico (ChatScreen)
- **IA médica inteligente** con respuestas contextuales
- Envío de fotos (cámara + galería)
- Adjuntar documentos
- Historial de conversación

### 📅 Gestión de Citas (AppointmentsScreen)
- Ver citas programadas
- Agendar nuevas citas
- Cancelar/reprogramar citas
- Información del médico

### 💊 Recetas Médicas (PrescriptionsScreen)
- Agregar/editar/eliminar recetas
- Compartir recetas (Share API nativo)
- Enviar por email
- Selector de íconos

### 👤 Perfil (ProfileScreen)
- Información personal editable
- Tipo de sangre y alergias
- Condiciones médicas
- **Contactos de emergencia con llamadas directas**
- Cambio de foto de perfil

### 🚨 Emergencias (EmergencyScreen)
- Botón de pánico
- Llamada rápida a emergencias
- Compartir ubicación

---

## 🆕 Componentes Nuevos Implementados

### 1️⃣ NotificationBadge
**Ubicación:** `src/components/NotificationBadge.js`

**Uso:**
```javascript
import NotificationBadge from '../components/NotificationBadge';

<NotificationBadge count={5} />
```

**Funcionalidad:**
- Muestra badges de notificaciones en íconos
- Auto-oculta cuando count = 0
- Maneja números grandes (99+)

---

### 2️⃣ LoadingSpinner
**Ubicación:** `src/components/LoadingSpinner.js`

**Uso:**
```javascript
import LoadingSpinner from '../components/LoadingSpinner';

<LoadingSpinner visible={loading} message="Cargando datos..." />
```

**Funcionalidad:**
- Modal de carga con overlay
- Mensaje personalizable
- Indicador animado

---

## 🔧 Problemas Enfrentados y Soluciones

### Problema 1: Acceso al sistema de archivos
**Descripción:** Expo Go no permite acceso directo al sistema de archivos del móvil.

**Solución:** Implementé el Share API nativo de React Native que permite compartir contenido con apps externas (WhatsApp, Email, Drive, etc.).
```javascript
import { Share } from 'react-native';

await Share.share({
  message: contenido,
  title: 'Recetas Médicas'
});
```

---

### Problema 2: Generación de PDFs en desarrollo
**Descripción:** Las librerías de PDF requieren compilación nativa.

**Solución:** Generación de texto formateado que puede ser guardado como PDF por apps externas.

---

### Problema 3: Llamadas telefónicas
**Descripción:** Necesitaba que los botones de emergencia realmente llamaran.

**Solución:** Uso de Linking API:
```javascript
import { Linking } from 'react-native';

Linking.openURL(`tel:${telefono}`);
```

---

### Problema 4: Estado persistente
**Descripción:** Los datos se perdían al recargar la app.

**Solución:** Uso de useState con datos mock realistas que simulan persistencia durante la sesión.

---

## 📱 Instalación del APK

### Generar APK (desarrollo):
```bash
npx expo export --platform android
eas build --platform android --profile preview
```

### Instalar APK en dispositivo:
1. Descarga el APK desde el repositorio
2. Habilita "Instalar apps de origen desconocido" en Android
3. Abre el APK y presiona "Instalar"

**Nota:** El APK incluido NO está firmado (desarrollo).

---

## 🎨 Decisiones de Diseño

### Paleta de colores:
- Primario: `#0088CC` (azul médico)
- Secundario: `#4CAF50` (verde confirmación)
- Alerta: `#F44336` (rojo emergencia)
- Advertencia: `#FF9800` (naranja)

### Tipografía:
- Sistema nativo (SF Pro en iOS, Roboto en Android)
- Tamaños: 12-26px según jerarquía

### Navegación:
- BottomTabNavigator con 4 tabs principales
- Navegación por stack para pantallas secundarias

---

## 🧪 Testing

Para probar la app:
1. Inicia con `npx expo start`
2. Escanea el QR con Expo Go
3. Prueba cada pantalla:
   - ✅ Login → HomeScreen
   - ✅ Chat → Enviar mensajes/fotos
   - ✅ Citas → Crear/editar citas
   - ✅ Recetas → Agregar/compartir
   - ✅ Perfil → Editar datos/contactos
   - ✅ Emergencias → Llamar contactos

---

## 📞 Contactos de Emergencia

La app incluye funcionalidad de llamadas reales:
- Presiona 📞 en cualquier contacto
- Confirma la llamada
- Se abre el marcador nativo

---

## 🐛 Problemas Conocidos

- ❌ Persistencia de datos (se pierde al cerrar app) → Solución futura: AsyncStorage
- ❌ Notificaciones push → Requiere backend
- ⚠️ El APK no firmado muestra advertencia en instalación (normal en desarrollo)

---

## 🔮 Mejoras Futuras

- [ ] Backend con Node.js + MongoDB
- [ ] Autenticación con JWT
- [ ] Notificaciones push
- [ ] Sincronización en la nube
- [ ] Modo oscuro
- [ ] Soporte multiidioma
- [ ] Integración con wearables

---

## 👨‍💻 Autor

**Kevin Rodas**  
Desarrollo de Aplicaciones Móviles  
IACC - 2025

---

## 📄 Licencia

Este proyecto es con fines educativos.

---

## 🙏 Agradecimientos

- Expo Team por el framework
- React Native Community
- Iconos de emojis nativos