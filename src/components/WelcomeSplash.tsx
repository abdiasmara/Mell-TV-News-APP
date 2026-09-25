import React from 'react';
import { MelloLogo } from './MelloLogo';
import { Globe, Tv, Play, Share2, Sparkles, ArrowRight, ShieldCheck, Scale } from 'lucide-react';
import { AppTab } from '../types';

interface WelcomeSplashProps {
  onEnter: (targetTab?: AppTab) => void;
  onOpenSocials: () => void;
  onOpenTerms?: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEnter, onOpenSocials, onOpenTerms }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
      {/* Animated Background Gradients & Broadcast Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e293b_0,transparent_70%)] opacity-80 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center backdrop-blur-2xl overflow-hidden my-auto">
        {/* Top Metallic Border Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-red-600 to-amber-500" />

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Siaran Langsung Mello TV News</span>
        </div>

        {/* 3D Logo Display */}
        <div className="mb-6 flex justify-center">
          <MelloLogo size="xl" showSubtitle={false} />
        </div>

        {/* Main Greeting - Exact Text requested by user */}
        <div className="space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase font-display">
            "SELAMAT DATANG SAHABAT MELLO TV NEWS"
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            <span className="text-sm sm:text-base font-bold text-amber-400 tracking-widest uppercase">
              PORTAL MEDIA TERPERCAYA
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-lg mx-mx leading-relaxed">
            Menyajikan informasi terkini, berimbang, dan terpercaya. Terhubung langsung dengan portal resmi{' '}
            <span className="text-blue-400 font-semibold">mellotvnews.com</span> dan seluruh saluran media sosial resmi kami.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => onEnter('home')}
            className="group relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Masuk Portal Berita</span>
            <ArrowRight className="w-4 h-4 text-red-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onEnter('website')}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700/80 transition-all hover:border-slate-600 transform hover:-translate-y-0.5"
          >
            <Globe className="w-5 h-5 text-blue-400" />
            <span>Tampilan mellotvnews.com</span>
          </button>

          <button
            onClick={() => onEnter('news')}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/60 transition-all"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Berita Terkini & Video Live</span>
          </button>

          <button
            onClick={() => {
              onOpenSocials();
            }}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700/60 transition-all"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Media Sosial Resmi</span>
          </button>
        </div>

        {/* Footer Badges inside splash */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kanal Berita Terverifikasi</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-red-400" />
            <span>Multi-Platform Penyiaran</span>
          </span>
          {onOpenTerms && (
            <>
              <span className="hidden sm:inline">·</span>
              <button
                onClick={onOpenTerms}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline font-semibold"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Syarat yang Dilindungi & Dilarang</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
