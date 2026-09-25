import React, { useState } from 'react';
import { NewsArticle } from '../types';
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
  Twitter,
  Sparkles,
  Send,
  Smartphone,
  Info
} from 'lucide-react';

interface ShareArticleModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareArticleModal: React.FC<ShareArticleModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'all' | 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'whatsapp'
  >('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !article) return null;

  const articleUrl = article.url || `https://mellotvnews.com/article/${article.id}`;
  const shareTitle = article.title;
  const shareSnippet = article.snippet || '';

  // Formatted templates for each platform
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    articleUrl
  )}&quote=${encodeURIComponent(`${shareTitle} - Baca berita selengkapnya di Mello TV News Portal Media Terpercaya`)}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `*${shareTitle.toUpperCase()}*\n\n${shareSnippet}\n\n📰 Baca selengkapnya di Mello TV News:\n${articleUrl}\n\n_Portal Media Terpercaya | mellotvnews.com_`
  )}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${shareTitle} via @mellotvnews`
  )}&url=${encodeURIComponent(articleUrl)}`;

  // Formatted caption for Instagram Story / Post
  const instagramCaption = `🔴 ${shareTitle.toUpperCase()}\n\n${shareSnippet}\n\n📰 Baca liputan selengkapnya di portal resmi: ${articleUrl}\n\nIkuti update terpercaya di @mellotvnews\n#MelloTVNews #BeritaTerkini #PortalMediaTerpercaya #BeritaIndonesia #SahabatMello`;

  // Formatted caption for TikTok Video / Comment
  const tiktokCaption = `⚡ ${shareTitle}\n\n${shareSnippet}\n\nSumber Resmi: mellotvnews.com\nFollow @mellotvnews untuk berita terpercaya setiap hari! #MelloTVNews #BeritaTikTok #BeritaViral #FaktaCepat #NewsUpdate`;

  // Formatted post for YouTube Community
  const youtubeCommunityPost = `🔴 [MELLO TV NEWS UPDATE] ${shareTitle}\n\n${shareSnippet}\n\n👉 Baca artikel lengkap di: ${articleUrl}\n\nKanal Resmi: @mellotv-news | Portal: mellotvnews.com`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle} - Mello TV News Portal Media Terpercaya`,
          url: articleUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-display">
                Bagikan Berita Mello TV News
              </h3>
              <p className="text-[11px] text-slate-400">
                Terhubung ke Facebook, Instagram, TikTok, YouTube & WhatsApp
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Article Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 flex gap-4 items-center">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold uppercase">
                {article.category}
              </span>
              <h4 className="font-bold text-white text-sm mt-1 line-clamp-2 font-display">
                {article.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {article.snippet}
              </p>
            </div>
          </div>

          {/* Quick Platform Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedPlatform === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua (4+ Media)
            </button>
            <button
              onClick={() => setSelectedPlatform('facebook')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                selectedPlatform === 'facebook'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('instagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                selectedPlatform === 'instagram'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('tiktok')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                selectedPlatform === 'tiktok'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
              </svg>
              <span>TikTok</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('youtube')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                selectedPlatform === 'youtube'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </button>
          </div>

          {/* Platform Specific Sharing Section */}

          {/* 1. FACEBOOK */}
          {(selectedPlatform === 'all' || selectedPlatform === 'facebook') && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Facebook @mellotvnews</h5>
                    <p className="text-[10px] text-blue-400">Bagikan langsung ke Feed & Grup Facebook</p>
                  </div>
                </div>

                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Bagikan ke Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* 2. INSTAGRAM */}
          {(selectedPlatform === 'all' || selectedPlatform === 'instagram') && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-pink-900/60 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Instagram @mellotvnews</h5>
                    <p className="text-[10px] text-pink-400">Format Caption Story & Feed Instagram</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(instagramCaption)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
                  >
                    {copiedText ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedText ? 'Tersalin!' : 'Salin Caption'}</span>
                  </button>

                  <a
                    href="https://instagram.com/mellotvnews"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Buka Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Caption preview box */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto">
                {instagramCaption}
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-pink-400" />
                <span>Salin teks di atas, lalu tempelkan pada Story atau Feed Instagram Anda dengan stiker tautan!</span>
              </p>
            </div>
          )}

          {/* 3. TIKTOK */}
          {(selectedPlatform === 'all' || selectedPlatform === 'tiktok') && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white">
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">TikTok @mellotvnews</h5>
                    <p className="text-[10px] text-slate-400">Format Deskripsi Video TikTok & Rangkuman Cepat</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(tiktokCaption)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
                  >
                    {copiedText ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedText ? 'Tersalin!' : 'Salin Skrip'}</span>
                  </button>

                  <a
                    href="https://tiktok.com/@mellotvnews"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition-colors"
                  >
                    <span>Buka TikTok</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* TikTok preview */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto">
                {tiktokCaption}
              </div>
            </div>
          )}

          {/* 4. YOUTUBE */}
          {(selectedPlatform === 'all' || selectedPlatform === 'youtube') && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-red-900/60 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">YouTube @mellotv-news</h5>
                    <p className="text-[10px] text-red-400">Format Komunitas YouTube & Rujukan Liputan</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(youtubeCommunityPost)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
                  >
                    {copiedText ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedText ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>

                  <a
                    href="https://youtube.com/@mellotv-news/community"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Buka Kanal YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* YouTube preview */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto">
                {youtubeCommunityPost}
              </div>
            </div>
          )}

          {/* OTHER CHANNELS: WhatsApp, Twitter, Link */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Kirim ke WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Twitter className="w-4 h-4" />
              <span>Bagikan ke X / Twitter</span>
            </a>

            {/* Native Share */}
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Bagikan via HP / Lainnya</span>
            </button>
          </div>

          {/* Copy Link Direct Bar */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400 truncate max-w-sm sm:max-w-md">
              {articleUrl}
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tersalin!' : 'Salin URL'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
