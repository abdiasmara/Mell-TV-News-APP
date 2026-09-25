import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { Download, Smartphone, Monitor, CheckCircle2, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'admin' | 'floating';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // Quick install action if browser prompt is active
  const handleAction = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled && variant !== 'admin') {
    return null;
  }

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleAction}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white text-xs font-extrabold shadow-lg shadow-red-900/30 hover:scale-105 transition-all animate-pulse hover:animate-none ${className}`}
          title="Install Aplikasi Mello TV News di Android & Windows"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Aplikasi</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} targetRole="public" />
      </>
    );
  }

  if (variant === 'admin') {
    return (
      <>
        <button
          onClick={handleAction}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-900 via-amber-600 to-red-800 hover:from-red-800 hover:to-amber-500 text-white text-xs font-bold border border-red-700 shadow-md transition-all ${className}`}
          title="Install Aplikasi Khusus Admin Redaksi di HP / Windows"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <Monitor className="w-3.5 h-3.5 text-blue-300" />
          <span>{isInstalled ? 'Aplikasi Admin Terpasang (Buka Panduan)' : 'Install App Admin (Android & Windows)'}</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} targetRole="admin" />
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-amber-800/60 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Install Aplikasi Mello TV News</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  Android & Windows
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                Akses berita terkini, siaran live, dan kabar warga tanpa iklan langsung dari layar HP atau laptop Anda.
              </p>
            </div>
          </div>

          <button
            onClick={handleAction}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Install Sekarang</span>
          </button>
        </div>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} targetRole="public" />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleAction}
        className={`fixed bottom-20 right-4 z-40 p-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-all ${className}`}
        title="Install Aplikasi di Android / Windows"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install Mello TV</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} targetRole="public" />
    </>
  );
};
