import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold shadow-2xl border border-amber-400 animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Modo Offline: Estás navegando con el catálogo guardado en caché de tu APK.</span>
    </div>
  );
};
