import React, { useState, useEffect } from 'react';
import { NewsArticle, Author } from '../types';
import { X, Volume2, VolumeX, Share2, Bookmark, BookmarkCheck, Facebook, Twitter, MessageSquare, Send, Check, Copy, ExternalLink, Play, ShieldCheck, Scale, AlertCircle, Ban, Youtube, Instagram, MessageCircle, Sparkles, BookOpen, ThumbsUp, Trash2 } from 'lucide-react';
import { ShareArticleModal } from './ShareArticleModal';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenTerms?: (tab?: 'all' | 'protected' | 'prohibited' | 'ethics' | 'comments') => void;
  authors?: Author[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenTerms,
  authors = [],
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isFocusReader, setIsFocusReader] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<{ id: string; name: string; text: string; date: string; likes?: number }>>(() => {
    if (!article) return [];
    try {
      const saved = localStorage.getItem(`mello_comments_${article.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'c1-' + article.id,
        name: 'Sahabat Mello',
        text: 'Informasi yang sangat bermanfaat dan cepat diperbarui. Sukses terus Mello TV News!',
        date: 'Baru saja',
        likes: 2,
      },
    ];
  });
  const [commentInput, setCommentInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null);

  // Sync comments to localStorage per article ID
  useEffect(() => {
    if (!article) return;
    try {
      localStorage.setItem(`mello_comments_${article.id}`, JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments, article?.id]);

  // Re-load comments when article changes
  useEffect(() => {
    if (!article) return;
    try {
      const saved = localStorage.getItem(`mello_comments_${article.id}`);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        setComments([
          {
            id: 'c1-' + article.id,
            name: 'Sahabat Mello',
            text: 'Informasi yang sangat bermanfaat dan cepat diperbarui. Sukses terus Mello TV News!',
            date: 'Baru saja',
            likes: 1,
          },
        ]);
      }
    } catch {
      setComments([]);
    }
  }, [article?.id]);
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  if (!article) return null;

  const getReadingTime = (): string => {
    if (article.readTimeMinutes) return `${article.readTimeMinutes} mnt baca`;
    const text = (article.title || '') + ' ' + (article.snippet || '') + ' ' + (article.content || '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${Math.max(1, minutes)} mnt baca`;
  };

  const triggerToast = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => setShareToast(null), 3000);
  };

  // Text to Speech Handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Fitur Suara Berita tidak didukung di browser ini.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. Berita oleh ${article.author}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError(null);
    setCommentSuccess(null);

    const trimmedText = commentInput.trim();
    if (!trimmedText) {
      setCommentError('Komentar tidak boleh kosong.');
      return;
    }
    if (trimmedText.length < 3) {
      setCommentError('Komentar minimal harus berisi 3 karakter.');
      return;
    }
    if (trimmedText.length > 500) {
      setCommentError('Komentar maksimal 500 karakter.');
      return;
    }

    const newC = {
      id: 'comm-' + Date.now(),
      name: nameInput.trim() || 'Pembaca Mello TV',
      text: trimmedText,
      date: 'Baru saja',
      likes: 0,
    };

    setComments([newC, ...comments]);
    setCommentInput('');
    setNameInput('');
    setCommentSuccess('Komentar berhasil dikirim dan ditayangkan!');
    setTimeout(() => setCommentSuccess(null), 4000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c)));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  const handleCopyLink = () => {
    const url = article.url || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`${article.title} - Mello TV News Portal Media Terpercaya`);
  const articleUrl = encodeURIComponent(article.url || 'https://mellotvnews.com');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full ${isFocusReader ? 'max-w-3xl' : 'max-w-4xl'} bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-all duration-300`}>
        {/* Modal Top Control Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-red-950 border border-red-800 text-red-400 font-bold text-xs uppercase">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">· {article.source || 'Mello TV News'}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Focus Reader Toggle */}
            <button
              onClick={() => setIsFocusReader(!isFocusReader)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isFocusReader
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Toggle Focus Reader (Mode Baca Fokus Tanpa Gangguan)"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{isFocusReader ? 'Keluar Fokus' : 'Focus Reader'}</span>
            </button>

            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded ${fontSize === 'base' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                A+
              </button>
            </div>

            {/* Audio Reader */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Dengarkan Suara Berita"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Berhenti' : 'Dengarkan'}</span>
            </button>

            {!isFocusReader && (
              <>
                {/* Share Button */}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-colors text-xs font-bold hidden md:flex"
                  title="Bagikan Berita"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Bagikan</span>
                </button>
              </>
            )}

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Simpan Berita"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className={`p-6 sm:p-10 overflow-y-auto space-y-6 flex-1 ${isFocusReader ? 'max-w-2xl mx-auto' : ''}`}>
          {/* Article Header */}
          <div>
            <h1 className={`${isFocusReader ? 'text-3xl sm:text-4xl leading-tight' : 'text-2xl sm:text-3xl'} font-extrabold text-white tracking-tight font-display leading-snug`}>
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-4 pb-4 border-b border-slate-800">
              <span className="font-semibold text-slate-200">Penulis: {article.author}</span>
              <span>·</span>
              <span>{new Date(article.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">{getReadingTime()}</span>
              <span>·</span>
              <span className="text-blue-400 font-semibold">{article.source || 'mellotvnews.com'}</span>
            </div>
          </div>

          {/* Author Byline Profile Card */}
          {(() => {
            const matchingAuthor = authors.find(a => a.name.toLowerCase() === article.author.toLowerCase()) || {
              name: article.author,
              title: 'Jurnalis & Kontributor Mello TV News',
              bio: 'Wartawan resmi dan pengamat pemberitaan Mello TV News portal.',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              email: ''
            };
            return (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 my-2 shadow-inner">
                <img
                  src={matchingAuthor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={matchingAuthor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-600 shrink-0 shadow"
                />
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white font-display flex items-center gap-2">
                    <span>{matchingAuthor.name}</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[10px] border border-red-800">
                      Author Byline
                    </span>
                  </div>
                  <div className="text-xs text-amber-400 font-semibold">{matchingAuthor.title}</div>
                  {matchingAuthor.bio && <p className="text-[11px] text-slate-400 line-clamp-1">{matchingAuthor.bio}</p>}
                </div>
              </div>
            );
          })()}

          {/* Media Player or Banner Image */}
          {article.videoUrl ? (
            <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-black shadow-xl">
              <iframe
                src={article.videoUrl}
                title={article.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : article.imageUrl ? (
            <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-96 bg-slate-950 shadow-xl">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          {/* Article Text Content */}
          <div className={`text-slate-200 leading-relaxed space-y-6 ${
            fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
          }`}>
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {/* Focus Reader Mode Banner / Exit Reminder */}
          {isFocusReader && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 mt-8">
              <p className="text-xs text-amber-300 font-semibold">✨ Anda sedang menggunakan Mode Focus Reader (Immersive Reading).</p>
              <button
                onClick={() => setIsFocusReader(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow"
              >
                Keluar Mode Fokus & Tampilkan Komentar
              </button>
            </div>
          )}

          {!isFocusReader && (
            <>
              {/* External Source Link */}
              {article.url && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    <span>Sumber Berita Resmi: </span>
                    <strong className="text-blue-400 font-mono">{article.url}</strong>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    <span>Buka Sumber</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Copyright Protection & Content Prohibitions Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Hak Cipta Karya Jurnalistik Dilindungi Hukum</span>
                  </div>
                  {onOpenTerms && (
                    <button
                      onClick={() => onOpenTerms('protected')}
                      className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Scale className="w-3 h-3" />
                      <span>Pelajari Syarat & Ketentuan</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Materi berita ini dilindungi oleh Undang-Undang Hak Cipta No. 28/2014 & UU Pers No. 40/1999. Dilarang menggandakan, menyalin sebagian atau seluruh isi berita untuk tujuan komersial tanpa izin tertulis dari <strong>Redaksi Mello TV News</strong>. Pengutipan wajar wajib menyertakan atribusi sumber: <span className="text-blue-400 font-mono">mellotvnews.com</span>.
                </p>
              </div>

              {/* Social Share Bar */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Bagikan Berita ke Media Sosial Resmi</span>
                  </h4>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Format Lengkap</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Notification Toast if text copied */}
                {shareToast && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{shareToast}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 1. Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}&quote=${shareText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>

                  {/* 2. Instagram */}
                  <button
                    onClick={() => {
                      const igText = `🔴 ${article.title.toUpperCase()}\n\n${article.snippet}\n\nBaca selengkapnya: ${article.url || 'https://mellotvnews.com'}\n\n@mellotvnews #MelloTVNews`;
                      navigator.clipboard.writeText(igText);
                      triggerToast('Caption Instagram berhasil disalin! Membuka Instagram @mellotvnews...');
                      setTimeout(() => {
                        window.open('https://instagram.com/mellotvnews', '_blank', 'noopener,noreferrer');
                      }, 600);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </button>

                  {/* 3. TikTok */}
                  <button
                    onClick={() => {
                      const ttText = `⚡ ${article.title}\n\n${article.snippet}\n\nFollow @mellotvnews #MelloTVNews #BeritaTikTok`;
                      navigator.clipboard.writeText(ttText);
                      triggerToast('Deskripsi berita TikTok disalin! Membuka TikTok @mellotvnews...');
                      setTimeout(() => {
                        window.open('https://tiktok.com/@mellotvnews', '_blank', 'noopener,noreferrer');
                      }, 600);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
                    </svg>
                    <span>TikTok</span>
                  </button>

                  {/* 4. YouTube */}
                  <button
                    onClick={() => {
                      const ytText = `🔴 [KABAR MELLO TV NEWS] ${article.title}\n\n${article.snippet}\n\nBaca artikel di: ${article.url || 'https://mellotvnews.com'}\nKanal Resmi: @mellotv-news`;
                      navigator.clipboard.writeText(ytText);
                      triggerToast('Kutipan YouTube berhasil disalin! Membuka kanal @mellotv-news...');
                      setTimeout(() => {
                        window.open('https://youtube.com/@mellotv-news/community', '_blank', 'noopener,noreferrer');
                      }, 600);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </button>
                </div>

                {/* Additional Channels */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900">
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareText}%20${articleUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3 h-3 fill-white text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${articleUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/90 hover:bg-sky-400 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <Twitter className="w-3 h-3" />
                    <span>X / Twitter</span>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-xs transition-colors ml-auto border border-amber-500/40"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Semua Opsi Berbagi</span>
                  </button>
                </div>
              </div>

              {/* Comment Section */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-red-500" />
                    <span>Komentar Pembaca ({comments.length})</span>
                  </h3>

                  {onOpenTerms && (
                    <button
                      onClick={() => onOpenTerms('comments')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Tata Tertib & Larangan Komentar</span>
                    </button>
                  )}
                </div>

                {/* Comment Prohibitions Notice Bar */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5 text-[11px] text-slate-400">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Larangan Redaksi:</strong> Dilarang memuat ujaran kebencian, isu SARA, fitnah, pornografi, dan promosi judi online/spam. Komentar yang melanggar akan dihapus otomatis oleh sistem moderator.
                  </span>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  {commentError && (
                    <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{commentError}</span>
                    </div>
                  )}
                  {commentSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{commentSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Anda (Opsional)"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan komentar atau tanggapan Anda (min. 3 karakter)..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {commentInput.length}/500 karakter
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Komentar</span>
                    </button>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      Belum ada komentar pada artikel ini. Jadilah yang pertama memberikan tanggapan!
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center">
                              {c.name ? c.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-200">{c.name}</span>
                              <span className="text-slate-500 text-[10px] ml-2">· {c.date}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                            title="Hapus komentar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pl-9">{c.text}</p>
                        <div className="pl-9 flex items-center gap-4 pt-1">
                          <button
                            onClick={() => handleLikeComment(c.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Suka ({c.likes || 0})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full Social Sharing Dialog */}
      <ShareArticleModal
        article={article}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
