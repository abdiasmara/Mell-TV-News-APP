import React, { useState, useEffect } from 'react';
import { MelloLogo } from './MelloLogo';
import { AppTab, UserRole, AdminUser } from '../types';
import { Globe, Newspaper, Share2, Shield, UserCheck, Tv, Clock, Sparkles, LogOut, KeyRound, Scale, Activity, Sun, Moon, Bookmark } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { PublishDiagnosticsModal } from './PublishDiagnosticsModal';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userRole: UserRole;
  adminUser?: AdminUser | null;
  onToggleRoleClick: () => void;
  onOpenWelcome: () => void;
  onOpenTerms: (tab?: 'all' | 'protected' | 'prohibited' | 'ethics' | 'comments') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  bookmarkCount?: number;
  onOpenShareApp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  adminUser,
  onToggleRoleClick,
  onOpenWelcome,
  onOpenTerms,
  theme,
  onToggleTheme,
  bookmarkCount = 0,
  onOpenShareApp,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formattedTime = new Intl.DateTimeFormat('id-ID', options).format(now);
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
      const formattedDate = new Intl.DateTimeFormat('id-ID', dateOptions).format(now);
      setTimeStr(`${formattedDate} · ${formattedTime} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
      {/* Top Utility Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Realtime WIB Clock */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-800/50 text-red-400 font-bold uppercase tracking-widest text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {timeStr}
            </span>
            <button
              onClick={() => setShowDiagnostics(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 font-semibold text-[10px] transition-colors"
              title="Periksa Status Kesiapan Publish & Diagnostik Sistem"
            >
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Publish: Siap</span>
            </button>
          </div>

          {/* Social Links Quick Bar */}
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span>Website: <a href="https://mellotvnews.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">mellotvnews.com</a></span>
            <span>·</span>
            <button
              onClick={() => onOpenTerms('all')}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
            >
              <Scale className="w-3 h-3" />
              <span>Syarat yang Dilindungi & Dilarang</span>
            </button>
            <span>·</span>
            <span>Facebook: <a href="https://facebook.com/mellotvnews" target="_blank" rel="noreferrer" className="hover:text-white">@mellotvnews</a></span>
            <span>·</span>
            <span>Instagram: <a href="https://instagram.com/mellotvnews" target="_blank" rel="noreferrer" className="hover:text-white">@mellotvnews</a></span>
            <span>·</span>
            <span>TikTok: <a href="https://tiktok.com/@mellotvnews" target="_blank" rel="noreferrer" className="hover:text-white">@mellotvnews</a></span>
            <span>·</span>
            <span>YouTube: <a href="https://youtube.com/@mellotv-news" target="_blank" rel="noreferrer" className="hover:text-white">@mellotv-news</a></span>
          </div>

          {/* Role Status & Switcher */}
          <div className="flex items-center gap-2 ml-auto">
            {userRole === 'admin' ? (
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold text-[11px]"
                  title="Akun Terhubung: asmaraabdi56@gmail.com (Keamanan Maksimum OTP 2FA)"
                >
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>Admin: <strong className="text-white">@{adminUser?.username || 'admin'}</strong></span>
                  <span className="hidden md:inline-block text-[10px] text-emerald-400 font-mono">
                    ({adminUser?.email || 'asmaraabdi56@gmail.com'})
                  </span>
                </span>
                <button
                  onClick={onToggleRoleClick}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] font-medium transition-colors"
                  title="Keluar dari akun admin"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                  <UserCheck className="w-3 h-3 text-blue-400" />
                  <span>Pembaca</span>
                </span>
                <button
                  onClick={onToggleRoleClick}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-semibold transition-colors"
                  title="Login Terproteksi Email asmaraabdi56@gmail.com"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Login Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Nav Contract Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Mark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-3 group text-left focus:outline-none"
            title="Buka Tampilan Awal / Welcome Screen"
          >
            <MelloLogo size="sm" />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-white text-lg tracking-tight leading-none group-hover:text-red-400 transition-colors">
                MELLO TV <span className="text-red-600">NEWS</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                PORTAL MEDIA TERPERCAYA
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Portal Utama</span>
          </button>

          <button
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'website'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>mellotvnews.com</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'news'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>Berita & Video</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'social'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Sosial Media</span>
          </button>

          <button
            onClick={() => setActiveTab('read-later')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'read-later'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Baca Nanti</span>
            {bookmarkCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                {bookmarkCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>Panel Admin</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Bagikan Menu Utama & Link Aplikasi Button */}
          {onOpenShareApp && (
            <button
              onClick={onOpenShareApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-md"
              title="Bagikan Menu Utama & Link Aplikasi ke Media Sosial"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          )}

          {/* Theme Switcher Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm"
            title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
          </button>

          {/* PWA App Install Button */}
          <PWAInstallButton variant="header" />

          <button
            onClick={() => onOpenTerms('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-semibold transition-all shadow-sm"
            title="Lihat Syarat yang Dilindungi & Dilarang"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Syarat & Larangan</span>
          </button>

          <button
            onClick={onOpenWelcome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
            title="Tampilkan Ucapan Selamat Datang"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ucapan Sambutan</span>
          </button>

          <a
            href="https://mellotvnews.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold transition-all shadow-md whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Buka Website</span>
          </a>
        </div>
      </div>

      {/* Mobile Tab Strip Navigation */}
      <div className="lg:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800/80 px-2 py-1.5 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${
            activeTab === 'home' ? 'text-red-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Utama</span>
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${
            activeTab === 'website' ? 'text-red-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website</span>
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${
            activeTab === 'news' ? 'text-red-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Berita</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${
            activeTab === 'social' ? 'text-red-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Medsos</span>
        </button>
        <button
          onClick={() => setActiveTab('read-later')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded relative ${
            activeTab === 'read-later' ? 'text-red-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Baca Nanti</span>
          {bookmarkCount > 0 && (
            <span className="absolute top-0 right-1 px-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px]">
              {bookmarkCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded ${
            activeTab === 'admin' ? 'text-amber-500 font-bold' : 'text-slate-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => onOpenTerms('all')}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-amber-400 font-medium"
        >
          <Scale className="w-4 h-4" />
          <span>Syarat</span>
        </button>
      </div>

      <PublishDiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
      />
    </header>
  );
};
