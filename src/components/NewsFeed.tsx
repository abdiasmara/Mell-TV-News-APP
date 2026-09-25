import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { Search, Bookmark, BookmarkCheck, Play, Sparkles, Filter, ExternalLink, Clock, User, ArrowRight, Share2, Flame, TrendingUp, Hash, Youtube, Instagram, Facebook, Download } from 'lucide-react';
import { ShareArticleModal } from './ShareArticleModal';
import { ShareAppModal } from './ShareAppModal';

interface NewsFeedProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  bookmarks: string[];
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenWebsiteTab: () => void;
  theme?: 'dark' | 'light';
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
  articles,
  onSelectArticle,
  bookmarks,
  onToggleBookmark,
  onOpenWebsiteTab,
  theme = 'dark',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [sharingArticle, setSharingArticle] = useState<NewsArticle | null>(null);
  const [showShareAppModal, setShowShareAppModal] = useState<boolean>(false);

  const isLight = theme === 'light';

  const categories = [
    'Semua',
    'Mello TV Live',
    'Website mellotvnews.com',
    'Nasional',
    'Politik',
    'Ekonomi',
    'Hukum',
    'Olahraga',
    'Hiburan',
    'Daerah',
    'Teknologi',
  ];

  // Filtering articles
  const filteredArticles = articles.filter((item) => {
    // Bookmark filter
    if (showBookmarksOnly && !bookmarks.includes(item.id)) return false;

    // Category filter
    if (selectedCategory !== 'Semua') {
      if (selectedCategory === 'Website mellotvnews.com' && item.source !== 'mellotvnews.com') {
        return false;
      } else if (selectedCategory === 'Mello TV Live' && item.category !== 'Mello TV Live' && !item.videoUrl) {
        return false;
      } else if (
        selectedCategory !== 'Website mellotvnews.com' &&
        selectedCategory !== 'Mello TV Live' &&
        item.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const snippetMatch = item.snippet.toLowerCase().includes(q);
      const categoryMatch = item.category.toLowerCase().includes(q);
      return titleMatch || snippetMatch || categoryMatch;
    }

    return true;
  });

  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];

  const getReadingTime = (article: NewsArticle): string => {
    if (article.readTimeMinutes) return `${article.readTimeMinutes} mnt baca`;
    const text = (article.title || '') + ' ' + (article.snippet || '') + ' ' + (article.content || '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${Math.max(1, minutes)} mnt baca`;
  };

  const trendingTopics = React.useMemo(() => {
    const stopWords = new Set(['dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'pada', 'adalah', 'ini', 'itu', 'dengan', 'karena', 'oleh', 'sebagai', 'dalam', 'tersebut', 'juga', 'akan', 'atau', 'menjadi']);
    const counts: Record<string, number> = {};

    articles.forEach((a) => {
      if (a.category && a.category !== 'Semua') {
        counts[a.category] = (counts[a.category] || 0) + 3;
      }
      const words = (a.title + ' ' + a.snippet).toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
      words.forEach((w) => {
        if (w.length > 4 && !stopWords.has(w)) {
          counts[w] = (counts[w] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        tag: '#' + word.charAt(0).toUpperCase() + word.slice(1),
        keyword: word,
        count,
      }));

    return sorted.length > 0 ? sorted : [
      { tag: '#MelloTVNews', keyword: 'mello', count: 24 },
      { tag: '#Pemilu2026', keyword: 'pemilu', count: 19 },
      { tag: '#EkonomiNasional', keyword: 'ekonomi', count: 15 },
      { tag: '#TeknologiAI', keyword: 'teknologi', count: 12 },
      { tag: '#KabarDaerah', keyword: 'daerah', count: 10 },
    ];
  }, [articles]);

  return (
    <div className="space-y-8">
      {/* Official Social Media Profiles Quick Showcase on Main Menu */}
      {!searchQuery && !showBookmarksOnly && selectedCategory === 'Semua' && (
        <div className={`p-5 rounded-3xl border shadow-xl ${isLight ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800' : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-slate-800'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-[11px] uppercase tracking-wide mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Media Sosial Resmi Mello TV</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                Ikuti Saluran & Profil Utama Kami
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-300 bg-slate-950/60 px-3 py-1 rounded-xl border border-slate-800">
              Terverifikasi @mellotvnews
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* YouTube */}
            <a
              href="https://youtube.com/@mellotv-news"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/80 hover:bg-red-950/40 border border-slate-800 hover:border-red-600/60 transition-all group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow">
                <Youtube className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white group-hover:text-red-400 truncate">YouTube</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">@mellotv-news</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-red-400" />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/mellotvnews"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/80 hover:bg-pink-950/40 border border-slate-800 hover:border-pink-600/60 transition-all group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white group-hover:text-pink-400 truncate">Instagram</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">@mellotvnews</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-pink-400" />
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/mellotvnews"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-600/60 transition-all group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white group-hover:text-blue-400 truncate">Facebook</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">@mellotvnews</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-blue-400" />
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@mellotvnews"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/40 border border-slate-800 hover:border-slate-600 transition-all group shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shrink-0 shadow">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white group-hover:text-amber-400 truncate">TikTok</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">@mellotvnews</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-amber-400" />
            </a>
          </div>

          {/* Social Share Preview Image Banner & Quick Share Trigger */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-16 h-10 sm:w-24 sm:h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0 shadow">
                <img
                  src="/og-main-menu.png"
                  alt="Pratinjau Menu Utama"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 rounded bg-red-600 text-[8px] font-bold text-white leading-none">
                  HD
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                  <span>Gambar Menu Utama Saat Dibagikan</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[9px] font-mono">
                    og:image
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Gambar ini otomatis tampil saat link portal dikirim ke WhatsApp, FB, X & medsos publik.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowShareAppModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Link & Gambar Menu</span>
            </button>
          </div>
        </div>
      )}

      {/* Featured News Hero Spotlight */}
      {featuredArticle && !searchQuery && !showBookmarksOnly && selectedCategory === 'Semua' && (
        <div className={`relative overflow-hidden border rounded-3xl shadow-2xl group ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image / Video Container */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full bg-slate-950 overflow-hidden">
              <img
                src={featuredArticle.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className={`absolute inset-0 ${isLight ? 'bg-gradient-to-t from-white via-white/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white' : 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900'}`} />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs uppercase shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  BERITA UTAMA
                </span>
                {featuredArticle.videoUrl && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs uppercase shadow-md flex items-center gap-1">
                    <Play className="w-3 h-3 fill-slate-950" />
                    LIVE VIDEO
                  </span>
                )}
              </div>
            </div>

            {/* Content Container */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
              <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span className="font-semibold text-red-500 uppercase">{featuredArticle.category}</span>
                <span className="flex items-center gap-1.5 font-mono">
                  <span>{new Date(featuredArticle.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>·</span>
                  <span className="text-amber-500 font-sans font-semibold">{getReadingTime(featuredArticle)}</span>
                </span>
              </div>

              <h2
                onClick={() => onSelectArticle(featuredArticle)}
                className={`text-2xl sm:text-3xl font-extrabold font-display leading-tight cursor-pointer transition-colors ${isLight ? 'text-slate-900 hover:text-red-600' : 'text-white hover:text-amber-300'}`}
              >
                {featuredArticle.title}
              </h2>

              <p className={`text-sm leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {featuredArticle.snippet}
              </p>

              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  onClick={() => onSelectArticle(featuredArticle)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSharingArticle(featuredArticle)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400'}`}
                    title="Bagikan Berita Utama"
                  >
                    <Share2 className="w-4 h-4 text-amber-500" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>

                  <button
                    onClick={() => onToggleBookmark(featuredArticle)}
                    className={`p-2.5 rounded-xl transition-colors ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
                    title="Simpan Berita"
                  >
                    {bookmarks.includes(featuredArticle.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar & Search */}
      <div className={`space-y-4 border rounded-2xl p-4 sm:p-6 shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Cari berita Mello TV News..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-red-500 ${isLight ? 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'}`}
            />
          </div>

          {/* Direct Website View Button & Bookmark Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-500 font-bold shadow'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Tersimpan ({bookmarks.length})</span>
            </button>

            <button
              onClick={onOpenWebsiteTab}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Website mellotvnews.com</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <Filter className="w-4 h-4 text-amber-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowBookmarksOnly(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat && !showBookmarksOnly
                  ? 'bg-red-600 text-white shadow-md'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout Grid with Sidebar for Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Columns: News Articles List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xl font-bold font-display flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>
                {showBookmarksOnly
                  ? 'Berita Tersimpan'
                  : selectedCategory === 'Semua'
                  ? 'Daftar Berita Terbaru'
                  : `Berita ${selectedCategory}`}
              </span>
              <span className={`text-xs font-sans font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                ({filteredArticles.length} artikel)
              </span>
            </h3>
          </div>

          {filteredArticles.length === 0 ? (
            <div className={`border rounded-2xl p-12 text-center space-y-3 ${isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              <p className={`text-base font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Tidak ada berita yang sesuai pencarian atau kategori ini.</p>
              <p className="text-xs text-slate-500">Coba ubah kata kunci atau pilih kategori lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((item) => (
                <article
                  key={item.id}
                  className={`group border rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-md' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                >
                  <div>
                    {/* Article Thumbnail */}
                    <div
                      onClick={() => onSelectArticle(item)}
                      className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {item.isBreaking && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase shadow-md">
                          BREAKING
                        </span>
                      )}

                      {item.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-500 uppercase text-[11px]">{item.category}</span>
                        <span className={`flex items-center gap-1 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                          <span>·</span>
                          <span className="text-amber-500 font-sans">{getReadingTime(item)}</span>
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectArticle(item)}
                        className={`font-bold text-base font-display leading-snug line-clamp-2 cursor-pointer transition-colors ${isLight ? 'text-slate-900 hover:text-red-600' : 'text-white hover:text-amber-300'}`}
                      >
                        {item.title}
                      </h4>

                      <p className={`text-xs leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className={`px-5 py-3 border-t flex items-center justify-between gap-2 text-xs ${isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800/80 bg-slate-950/40 text-slate-400'}`}>
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{item.author}</span>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharingArticle(item);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400'}`}
                        title="Bagikan Berita"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleBookmark(item)}
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                        title="Simpan Berita"
                      >
                        {bookmarks.includes(item.id) ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => onSelectArticle(item)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs transition-colors"
                      >
                        Baca
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Columns: Sidebar with Trending Topics Widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-3xl border shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className={`font-display font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Topik Terpopuler
                </h3>
                <p className="text-[11px] text-amber-500 font-medium">Trending Keywords & Hashtags</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {trendingTopics.map((topic, idx) => (
                <button
                  key={topic.tag}
                  onClick={() => setSearchQuery(topic.keyword)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left group ${
                    searchQuery === topic.keyword
                      ? 'bg-red-600 text-white border-red-500 shadow-md font-bold'
                      : isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-100'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      idx === 0 ? 'bg-amber-500 text-slate-950 shadow' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className="font-semibold text-xs tracking-wide">{topic.tag}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono opacity-60">({topic.count})</span>
                    <TrendingUp className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity text-amber-400" />
                  </div>
                </button>
              ))}
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors shadow"
              >
                Reset Filter Trending
              </button>
            )}
          </div>

          {/* Quick Notice Widget */}
          <div className={`p-6 rounded-3xl border shadow-xl ${isLight ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-slate-900' : 'bg-gradient-to-br from-slate-900 to-indigo-950/40 border-slate-800 text-white'}`}>
            <h4 className="font-display font-bold text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Jurnalis Warga & Redaksi</span>
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Punya informasi, laporan peristiwa, atau rilis berita terkini? Hubungi tim redaksi Mello TV News melalui hotline resmi kami.
            </p>
          </div>
        </div>
      </div>

      {/* Share Article Modal */}
      <ShareArticleModal
        article={sharingArticle}
        isOpen={!!sharingArticle}
        onClose={() => setSharingArticle(null)}
      />

      {/* Share App / Main Menu Modal */}
      <ShareAppModal
        isOpen={showShareAppModal}
        onClose={() => setShowShareAppModal(false)}
      />
    </div>
  );
};
