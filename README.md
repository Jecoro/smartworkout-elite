# SmartWorkout Planner 💪

App para planificar rutinas con gomas elásticas (SmartWorkout Elite) y calcular tu déficit calórico. Es una **PWA**: funciona en el navegador, se instala en Android como una app (con icono y modo offline) y no necesita backend — todo se guarda en tu móvil.

## 🌐 App publicada

**https://jecoro.github.io/smartworkout-elite/** (GitHub Pages, repo `Jecoro/smartworkout-elite`)

- **Móvil:** abre la URL en Chrome → menú ⋮ → «Añadir a pantalla de inicio» (o escanea `qr-app.png`).
- **PC:** abre la URL en Chrome/Edge → icono de instalar (⊕/monitor con flecha) en la barra de direcciones.
- **Actualizar la app:** edita los archivos y `git push` — Pages se redespliega solo en ~1 min.

## Qué hace

- Calcula tu **metabolismo basal** (Mifflin-St Jeor), **mantenimiento** y **objetivo calórico** en déficit (suave/medio/agresivo), con reparto de macros y ritmo de pérdida estimado.
- Genera una **rutina semanal** según tus días disponibles (2-6) y experiencia:
  - 2-3 días → Full Body · 4 días → Torso/Pierna · 5-6 días → Empuje/Tirón/Pierna
- Para cada ejercicio sugiere **qué gomas usar** (combinación de tubos que mejor se acerca a la resistencia objetivo según tu peso y nivel). Los kg de cada tubo son **editables** por si tu set no coincide con los valores por defecto.
- Añade **finishers de cardio** en cada sesión, pauta de pasos diarios y cardio suave.
- Botón de **imprimir/PDF** y los datos se guardan en el dispositivo (localStorage).

## Probar en el PC

```powershell
cd E:\Capgemini\Code\smartworkout-elite
npx serve . -l 4173
# abre http://localhost:4173
```

## Instalarla en tu Android (camino rápido, sin APK)

La PWA necesita HTTPS, así que hay que subirla a un hosting gratuito (2 minutos):

1. Ve a **https://app.netlify.com/drop** (o GitHub Pages) y arrastra la carpeta `smartworkout-elite`.
2. Abre la URL que te da en **Chrome del móvil**.
3. Menú ⋮ → **«Añadir a pantalla de inicio»** → «Instalar».

Ya tienes la app con icono, a pantalla completa y funcionando sin conexión. Para el 99% de los casos esto es indistinguible de una APK.

## Generar la APK de verdad

### Opción A — PWABuilder (la más fácil)

1. Con la app ya subida a un hosting (paso anterior), entra en **https://www.pwabuilder.com**.
2. Pega la URL, pulsa **Package for stores → Android**.
3. Descarga el `.apk` firmado e instálalo en el móvil (activa «Instalar apps desconocidas»).

### Opción B — Capacitor (APK local, control total)

Requisitos: **JDK 17** (`winget install EclipseAdoptium.Temurin.17.JDK`) y **Android Studio** (o los cmdline-tools del SDK).

```powershell
cd E:\Capgemini\Code\smartworkout-elite
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "SmartWorkout Planner" "com.jecor.smartworkout" --web-dir .
npx cap add android
npx cap sync
cd android
.\gradlew assembleDebug
# APK en: android\app\build\outputs\apk\debug\app-debug.apk
```

Pasa el APK al móvil (cable, Drive, etc.) e instálalo.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | UI: formulario y secciones de resultados |
| `app.js` | Cálculos calóricos, base de ejercicios, plantillas de rutina y selector de gomas |
| `styles.css` | Tema oscuro + estilos de impresión |
| `manifest.webmanifest` + `sw.js` + `icons/` | Lo que la convierte en PWA instalable/offline |

> ⚠️ Los cálculos son estimaciones y no sustituyen el consejo de un profesional sanitario o un dietista.
