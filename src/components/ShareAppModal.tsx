import React, { useState } from 'react';
import {
  X,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Send,
  Download,
  Tv,
  Radio,
  Globe
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<
    'all' | 'whatsapp' | 'facebook' | 'twitter' | 'instagram' | 'tiktok' | 'telegram'
  >('all');

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mellotvnews.com';
  const ogImageUrl = `${appUrl}/og-main-menu.png`;
  const shareTitle = 'Mello Portal ID - Mello TV News Portal Media Terpercaya';
  const shareDescription =
    'Akses portal berita resmi Mello TV News, siaran langsung streaming TV nasional 24/7, serta integrasi 4 media sosial resmi YouTube, Instagram, Facebook, dan TikTok.';

  const whatsappMessage = `*🔴 MELLO TV NEWS - PORTAL MEDIA TERPERCAYA*\n\n` +
    `Ikuti siaran langsung 24/7, berita terkini terverifikasi, dan informasi terkini dari Redaksi Mello TV News.\n\n` +
    `🌐 *Buka Portal Utama:*\n${appUrl}\n\n` +
    `📺 *Media Sosial Resmi:*\n` +
    `• YouTube: @mellotv-news (340K Subs)\n` +
    `• Instagram: @mellotvnews (98K Followers)\n` +
    `• Facebook: @mellotvnews (125K Followers)\n` +
    `• TikTok: @mellotvnews (210K Followers)\n` +
    `• WhatsApp Hotline: +62 813-4253-0200\n\n` +
    `_Mello Portal ID · Portal Media Terpercaya_`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    appUrl
  )}&quote=${encodeURIComponent(
    'Mello Portal ID - Portal Media Terpercaya Mello TV News. Saksikan siaran live streaming dan update berita terkini.'
  )}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    'Mello Portal ID - Portal Media Terpercaya Mello TV News. Siaran langsung 24/7 dan berita terkini terverifikasi @mellotvnews'
  )}&url=${encodeURIComponent(appUrl)}&hashtags=MelloTVNews,MelloPortalID,BeritaTerkini,PortalMedia`;

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(
    'Mello Portal ID - Portal Media Terpercaya Mello TV News'
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: appUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base font-display">
                  Bagikan Menu Utama Aplikasi
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-[10px] font-bold">
                  OpenGraph HD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gambar menu utama akan otomatis muncul saat dibagikan ke media sosial & publik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Menu Preview Image Showcase Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Gambar Pratinjau Sosial Media (1200 x 630 px)
              </span>
              <a
                href="/og-main-menu.png"
                download="mello-portal-main-menu.png"
                className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
              >
                <Download className="w-3 h-3" /> Unduh Gambar
              </a>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group aspect-[1200/630]">
              <img
                src="/og-main-menu.png"
                alt="Pratinjau Menu Utama Mello Portal ID"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
                  ✓ Gambar Otomatis Terpasang (og:image & twitter:image)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[11px] font-bold">
                  Mello Portal ID
                </span>
              </div>
            </div>
          </div>

          {/* Platform Share Direct Action Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pilih Media Sosial Tujuan:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/80 text-white transition-all shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
                <span className="text-[10px] text-emerald-400">Kirim Chat/Grup</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/80 text-white transition-all shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold">Facebook</span>
                <span className="text-[10px] text-blue-400">Bagikan Feed</span>
              </a>

              {/* Twitter / X */}
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white transition-all shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                  <span className="font-black text-sm">𝕏</span>
                </div>
                <span className="text-xs font-bold">X (Twitter)</span>
                <span className="text-[10px] text-slate-400">Kicau Publik</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-950/50 hover:bg-sky-900/60 border border-sky-800/80 text-white transition-all shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold">Telegram</span>
                <span className="text-[10px] text-sky-400">Saluran & Grup</span>
              </a>
            </div>
          </div>

          {/* Quick Copy Link & Native Share Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Link Publik Aplikasi:</span>
              <span className="font-mono text-emerald-400 text-[11px]">{appUrl}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors shadow"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Salin Link Aplikasi</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNativeShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan ke Perangkat</span>
              </button>
            </div>
          </div>

          {/* Instagram & TikTok Caption Helper */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Template Teks Caption untuk Instagram & TikTok
              </span>
              <button
                onClick={() => handleCopyCaption(whatsappMessage)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Tersalin' : 'Salin Caption'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 max-h-24 overflow-y-auto">
              🔴 MELLO TV NEWS - PORTAL MEDIA TERPERCAYA. Saksikan siaran langsung 24/7 dan ikuti update di YouTube @mellotv-news, Instagram @mellotvnews, Facebook @mellotvnews, dan TikTok @mellotvnews. Kunjungi: {appUrl} #MelloTVNews #MelloPortalID #PortalMediaTerpercaya
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            og:image: {ogImageUrl}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
