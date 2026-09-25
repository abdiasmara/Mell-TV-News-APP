import React, { useState } from 'react';
import { Globe, RefreshCw, ExternalLink, Maximize2, Minimize2, ShieldAlert, ArrowLeft, ArrowRight, Layers } from 'lucide-react';

export const WebsiteView: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const websiteUrl = 'https://mellotvnews.com';

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
    setHasError(false);
  };

  return (
    <div className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-2 z-50 rounded-none border-none' : 'w-full h-[820px]'
    }`}>
      {/* Embedded Browser Header Control Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Muat Ulang Halaman"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-1 text-slate-500">
            <button className="p-2 rounded bg-slate-900 text-slate-600 cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded bg-slate-900 text-slate-600 cursor-not-allowed">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* URL Address Bar */}
        <div className="flex-1 max-w-xl flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
          <Globe className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="truncate select-all text-slate-200 font-semibold">{websiteUrl}</span>
          <span className="ml-auto text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 shrink-0 font-sans font-semibold">
            TERHUBUNG LANGSUNG
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Tab Baru</span>
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-800/80 border-b border-slate-700/60 px-4 py-2 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Menampilkan portal berita resmi <strong>mellotvnews.com</strong> secara langsung di dalam aplikasi.
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Jika tampilan iframe terhalang aturan browser, klik <a href={websiteUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline font-semibold">Buka Tab Baru</a>
        </div>
      </div>

      {/* Main Iframe Viewer Container */}
      <div className="relative flex-1 bg-slate-950">
        {!hasError ? (
          <iframe
            key={iframeKey}
            src={websiteUrl}
            title="Mello TV News Website View"
            className="w-full h-full border-0"
            onError={() => setHasError(true)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-300">
            <ShieldAlert className="w-16 h-16 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-display">Tampilan Website Mellotvnews.com</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Browser Anda membatasi pratinjau iframe untuk beberapa fitur situs. Anda dapat membuka website secara penuh langsung melalui tombol resmi di bawah.
            </p>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-900/40 transition-transform transform hover:-translate-y-0.5"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Buka Website mellotvnews.com</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
