import React from 'react';
import { NewsArticle } from '../types';
import { Bookmark, Trash2, ExternalLink, Clock, ArrowRight, BookOpen, Newspaper } from 'lucide-react';

interface ReadLaterViewProps {
  bookmarks: string[];
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearBookmarks: () => void;
  isLight: boolean;
  setActiveTab: (tab: any) => void;
}

export const ReadLaterView: React.FC<ReadLaterViewProps> = ({
  bookmarks,
  articles,
  onSelectArticle,
  onRemoveBookmark,
  onClearBookmarks,
  isLight,
  setActiveTab,
}) => {
  // Find all articles that are bookmarked
  const bookmarkedArticles = articles.filter((article) => bookmarks.includes(article.id));

  return (
    <div className={`min-h-[80vh] py-8 px-4 sm:px-6 lg:px-8 transition-colors ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className={`p-6 sm:p-8 rounded-2xl mb-8 border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                <Bookmark className="w-7 h-7 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-bold uppercase tracking-wider">
                    Daftar Baca Nanti
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}`}>
                    {bookmarkedArticles.length} Artikel Tersimpan
                  </span>
                </div>
                <h1 className={`text-2xl sm:text-3xl font-display font-extrabold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Queue Baca Nanti (Read-Later)
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Simpan artikel menarik untuk dibaca kapan saja secara offline maupun online dengan daftar antrean personal Anda.
                </p>
              </div>
            </div>

            {bookmarkedArticles.length > 0 && (
              <button
                onClick={onClearBookmarks}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-500 text-xs font-bold transition-all self-start sm:self-auto"
                title="Hapus semua artikel dari daftar baca nanti"
              >
                <Trash2 className="w-4 h-4" />
                <span>Kosongkan Antrean</span>
              </button>
            )}
          </div>
        </div>

        {/* Content List */}
        {bookmarkedArticles.length === 0 ? (
          <div className={`text-center py-20 px-6 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-4">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              Belum Ada Artikel dalam Antrean Baca Nanti
            </h3>
            <p className={`text-sm max-w-md mx-auto mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Jelajahi portal berita atau artikel pilihan, lalu klik ikon bookmark/simpan pada artikel yang ingin Anda baca di lain waktu.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('home')}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
              >
                <Newspaper className="w-4 h-4" />
                <span>Jelajahi Berita Utama</span>
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-2 ${
                  isLight ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Semua Artikel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedArticles.map((article) => (
              <div
                key={article.id}
                className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                    : 'bg-slate-900/90 border-slate-800 shadow-lg hover:border-slate-700'
                }`}
              >
                {/* Article Image / Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    {article.category}
                  </span>

                  {/* Read Time */}
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[10px] font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{article.readTimeMinutes || 3} min read</span>
                  </span>

                  {/* Remove Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(article.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-red-600 text-slate-300 hover:text-white backdrop-blur-sm border border-slate-700/80 transition-all shadow-md"
                    title="Hapus dari daftar baca nanti"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">{article.author || 'Redaksi Mello'}</span>
                      <span>·</span>
                      <span>{article.date}</span>
                    </div>

                    <h3
                      onClick={() => onSelectArticle(article)}
                      className={`font-display font-bold text-base line-clamp-2 cursor-pointer transition-colors ${
                        isLight ? 'text-slate-900 hover:text-red-600' : 'text-white hover:text-red-400'
                      }`}
                    >
                      {article.title}
                    </h3>

                    <p className={`text-xs mt-2 line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {article.snippet}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-amber-400 font-mono font-medium">
                      {article.source || 'Mello TV News'}
                    </span>
                    <button
                      onClick={() => onSelectArticle(article)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <span>Baca Sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
