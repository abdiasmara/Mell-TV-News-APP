import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Monitor, Smartphone, CheckCircle2, X, Sparkles, ExternalLink, ShieldCheck, Laptop } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'public' | 'admin';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'public'
}) => {
  const { isInstallable, isInstalled, isIOS, isWindows, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'windows' | 'ios'>('android');
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    const success = await install();
    setIsInstalling(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 space-y-6 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-amber-500 to-red-700 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-2">
              <img src="/icon.svg" alt="Mello TV Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{targetRole === 'admin' ? 'Aplikasi Khusus Admin Redaksi' : 'Aplikasi Publik Mello TV'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Install Aplikasi Mello TV News
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              {targetRole === 'admin'
                ? 'Pasang aplikasi di HP Android atau Laptop Windows untuk mengelola berita, siaran live, dan kabar warga kapan saja tanpa repot membuka browser.'
                : 'Nikmati berita terkini, siaran live Mello TV, dan kirim laporan warga dengan cepat langsung dari layar utama Android & Windows Anda.'}
            </p>
          </div>
        </div>

        {/* Status Badge if already installed */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-sm font-bold text-white">Aplikasi Sudah Terpasang!</strong>
              <span>Aplikasi Mello TV News telah aktif dalam mode standalone di perangkat ini.</span>
            </div>
          </div>
        ) : isInstallable ? (
          <div className="bg-gradient-to-r from-red-950/80 via-slate-950 to-slate-950 border border-red-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">Siap Di-install 1-Klik!</span>
              <p className="text-xs text-slate-300">
                Browser mendukung instalasi langsung ke layar utama Android / Windows Desktop.
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-red-500/20 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalling ? 'Memproses...' : 'Install Sekarang'}</span>
            </button>
          </div>
        ) : null}

        {/* Platform Selection Tabs */}
        <div className="space-y-3">
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'android'
                  ? 'border-red-500 text-red-400 bg-red-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android (HP & Tablet)</span>
            </button>

            <button
              onClick={() => setActiveTab('windows')}
              className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'windows'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4 text-blue-400" />
              <span>Windows PC / Laptop</span>
            </button>

            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'ios'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>iPhone / iPad (iOS)</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-3">
            {activeTab === 'android' && (
              <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Cara Install di HP / Tablet Android:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  <li>
                    Buka situs ini menggunakan <strong>Google Chrome</strong> di HP Android Anda.
                  </li>
                  <li>
                    Tekan tombol <strong>"Install Sekarang"</strong> di banner atas, atau ketuk menu <strong>titik tiga (⋮)</strong> di pojok kanan atas Chrome.
                  </li>
                  <li>
                    Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.
                  </li>
                  <li>
                    Aplikasi <strong>Mello TV News</strong> akan terpasang otomatis seperti aplikasi Android resmi dari Play Store!
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'windows' && (
              <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span>Cara Install di Windows PC / Laptop:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  <li>
                    Gunakan <strong>Microsoft Edge</strong> atau <strong>Google Chrome</strong> di Komputer / Laptop Windows.
                  </li>
                  <li>
                    Lihat di bilah alamat URL (Address Bar) di kanan atas, ketuk ikon <strong className="text-blue-400">Install Aplikasi (🖥️ / ➕)</strong>.
                  </li>
                  <li>
                    Atau klik menu titik tiga (⋮) &gt; <strong>Aplikasi</strong> &gt; <strong>Install Mello TV News</strong>.
                  </li>
                  <li>
                    Ikon Mello TV News akan muncul di **Start Menu** dan **Desktop Windows** sebagai aplikasi desktop mandiri.
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                  <Laptop className="w-4 h-4 text-amber-400" />
                  <span>Cara Install di iPhone / iPad (Safari):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  <li>
                    Buka halaman ini menggunakan browser <strong>Safari</strong> di iOS.
                  </li>
                  <li>
                    Ketuk tombol <strong>Bagikan (Share / ⎋)</strong> di bilah navigasi bawah Safari.
                  </li>
                  <li>
                    Geser ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.
                  </li>
                  <li>
                    Ketuk <strong>Tambah</strong> di kanan atas untuk memasang di Home Screen iPhone Anda.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Aman & Bebas Iklan
          </span>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white font-semibold underline"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
