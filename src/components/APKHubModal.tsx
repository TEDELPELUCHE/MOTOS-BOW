import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  CheckCircle2, 
  ExternalLink, 
  FileCode, 
  Copy, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  X, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface APKHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
  appUrl: string;
}

export const APKHubModal: React.FC<APKHubModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onInstall,
  appUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'qr' | 'code' | 'guide'>('direct');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    const success = await onInstall();
    setIsInstalling(false);
    if (success) {
      setInstallSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Capacitor / Android Studio configuration
  const androidManifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.motosbow.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const capacitorConfig = `{
  "appId": "com.motosbow.app",
  "appName": "Motos Bow",
  "webDir": "dist",
  "server": {
    "url": "${appUrl}",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#090d16"
  }
}`;

  const downloadAndroidFiles = () => {
    const packageZipContent = `==========================================================
MOTOS BOW - PAQUETE COMPILADOR APK PARA ANDROID
==========================================================
1. CONFIGURACIÓN CAPACITOR (capacitor.config.json):
${capacitorConfig}

2. ANDROID MANIFEST (AndroidManifest.xml):
${androidManifestContent}

3. COMANDOS DE COMPILACIÓN NATIVA EN CONSOLA:
npm install -g @capacitor/cli @capacitor/core @capacitor/android
npx cap init "Motos Bow" "com.motosbow.app" --web-dir dist
npx cap add android
npx cap open android

Una vez en Android Studio:
- Menú: Build > Build Bundle(s) / APK(s) > Build APK(s)
- El archivo 'app-debug.apk' o 'app-release.apk' estará listo en android/app/build/outputs/apk/
==========================================================`;

    const blob = new Blob([packageZipContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MotosBow-Android-APK-Config.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 50,
      spread: 60,
    });
  };

  // QR Code URL via QRServer API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    appUrl
  )}&color=f59e0b&bgcolor=090d16`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-slate-100">Centro APK Motos Bow</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Android Nativo
                </span>
              </div>
              <p className="text-xs text-slate-400">Instala, compila o genera el archivo APK para celulares Android</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('direct')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'direct'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            1. Instalar APK Directo
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'qr'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            2. Escanear QR en Móvil
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'code'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            3. Descargar Proyecto APK
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'guide'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            4. Guía de Instalación
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: DIRECT APK / WEBAPK INSTALLATION */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-500/15 via-slate-800/80 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <h3 className="font-extrabold text-base text-amber-300">
                        Instalación Automática WebAPK (Recomendada)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-md">
                      Chrome para Android empaqueta directamente esta aplicación en un archivo <strong>.APK nativo</strong> con acceso directo, pantalla completa, icono de alta resolución y soporte offline.
                    </p>
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    {isInstalled || installSuccess ? (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>¡APK Instalado en este Equipo!</span>
                      </div>
                    ) : isInstallable ? (
                      <button
                        onClick={handleDirectInstall}
                        disabled={isInstalling}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                      >
                        <Download className="w-5 h-5" />
                        <span>{isInstalling ? 'Instalando...' : 'Instalar APK Ahora'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('qr')}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Abrir en Android con QR</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Specifications of the APK */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Paquete ID</span>
                  <span className="font-mono text-xs font-bold text-slate-200 truncate block">com.motosbow.app</span>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Versión APK</span>
                  <span className="text-xs font-bold text-amber-400 block">v1.2.0 (Build 2026)</span>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Modo Pantalla</span>
                  <span className="text-xs font-bold text-emerald-400 block">Standalone Nativo</span>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Soporte Offline</span>
                  <span className="text-xs font-bold text-amber-400 block">Service Worker Activo</span>
                </div>
              </div>

              {/* PWABuilder Cloud Package Option */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-2 justify-center sm:justify-start">
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    Generar archivo .APK / .AAB para Google Play Store
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Utiliza la herramienta oficial de Microsoft PWABuilder para descargar el instalador <strong>.APK firmado</strong> listo para compartir por WhatsApp o subir a tiendas.
                  </p>
                </div>
                <a
                  href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/40 transition-all flex items-center gap-1.5"
                >
                  <span>Abrir en PWABuilder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: QR CODE SCAN */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
              <div className="p-3 bg-slate-950 rounded-2xl border-2 border-amber-500/40 shadow-2xl">
                <img
                  src={qrCodeUrl}
                  alt="Código QR para instalar APK en celular"
                  className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl"
                />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="font-extrabold text-sm sm:text-base text-amber-300">
                  Escanea con la cámara de tu Android
                </h3>
                <p className="text-xs text-slate-400">
                  1. Abre la app de Cámara o Google Lens en tu celular.<br />
                  2. Toca el enlace generado para abrir Motos Bow en Google Chrome.<br />
                  3. Presiona <strong>"Instalar aplicación"</strong> en la barra inferior.
                </p>
              </div>

              <div className="w-full max-w-md bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="truncate mr-2">{appUrl}</span>
                <button
                  onClick={() => copyToClipboard(appUrl, 'url')}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  {copiedCode === 'url' ? '¡Copiado!' : 'Copiar URL'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SOURCE CODE & CAPACITOR PROJECT GENERATOR */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">Archivos del Proyecto Nativo Android</h3>
                  <p className="text-[11px] text-slate-400">
                    Copia o descarga la configuración para compilar con CapacitorJS o Android Studio CLI.
                  </p>
                </div>
                <button
                  onClick={downloadAndroidFiles}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivos</span>
                </button>
              </div>

              {/* AndroidManifest.xml preview */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">AndroidManifest.xml</span>
                  <button
                    onClick={() => copyToClipboard(androidManifestContent, 'manifest')}
                    className="flex items-center gap-1 hover:text-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode === 'manifest' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800">
                  {androidManifestContent}
                </pre>
              </div>

              {/* Commands guide */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  Comandos de compilación directa a APK:
                </h4>
                <pre className="bg-slate-950 p-2.5 rounded-lg text-[11px] text-amber-300 font-mono overflow-x-auto border border-slate-800">
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Motos Bow" "com.motosbow.app"
npx cap add android
npx cap open android</pre>
              </div>
            </div>
          )}

          {/* TAB 4: STEP BY STEP INSTALLATION GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-3">
              <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <h4 className="font-bold text-slate-100">Abre desde Google Chrome en tu celular</h4>
                  <p>
                    Asegúrate de visitar el enlace con Chrome o el navegador nativo de Android para permitir que el sistema registre los servicios del APK.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <h4 className="font-bold text-slate-100">Presiona "Agregar a la pantalla principal" o "Instalar APK"</h4>
                  <p>
                    Verás un banner en la parte inferior o en el menú de tres puntos (⋮) de Chrome. Toca <strong>"Instalar Motos Bow"</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 p-3.5 rounded-2xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <h4 className="font-bold text-slate-100">Disfruta la experiencia 100% nativa</h4>
                  <p>
                    La aplicación se instalará en el cajón de aplicaciones de Android como cualquier app de Play Store, sin barras del navegador y con funcionamiento offline.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Motos Bow APK Engine • 100% Compatible con Android 8.0+</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
