import React, { useState, useEffect } from 'react';
import { SocialFeedItem } from '../types';
import {
  Facebook,
  Instagram,
  Youtube,
  Share2,
  ExternalLink,
  Heart,
  MessageSquare,
  Repeat,
  Play,
  Sparkles,
  Clock,
  CheckCircle,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';

interface SocialMediaFeedProps {
  initialPlatform?: 'all' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';
}

export const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({
  initialPlatform = 'all',
}) => {
  const [feedItems, setFeedItems] = useState<SocialFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<
    'all' | 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  >(initialPlatform);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social-feed');
      if (res.ok) {
        const data = await res.json();
        setFeedItems(data);
      }
    } catch (err) {
      console.error('Gagal mengambil feed sosial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleToggleLike = (id: string) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSharePost = async (item: SocialFeedItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Postingan Resmi Mello TV News (${item.authorHandle})`,
          text: item.content,
          url: item.postUrl,
        });
        return;
      } catch {
        // Fallback to copy link
      }
    }

    navigator.clipboard.writeText(item.postUrl);
    setCopiedPostId(item.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const filteredItems = feedItems.filter((item) => {
    if (activePlatform !== 'all' && item.platform !== activePlatform) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const contentMatch = item.content.toLowerCase().includes(q);
      const handleMatch = item.authorHandle.toLowerCase().includes(q);
      const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(q));
      return contentMatch || handleMatch || tagMatch;
    }
    return true;
  });

  const getPlatformIcon = (platform: SocialFeedItem['platform'], size = 'w-4 h-4') => {
    switch (platform) {
      case 'youtube':
        return <Youtube className={size} />;
      case 'instagram':
        return <Instagram className={size} />;
      case 'facebook':
        return <Facebook className={size} />;
      case 'tiktok':
        return (
          <svg className={`${size} fill-current`} viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
          </svg>
        );
      default:
        return <Share2 className={size} />;
    }
  };

  const getPlatformBadge = (platform: SocialFeedItem['platform']) => {
    switch (platform) {
      case 'youtube':
        return 'bg-red-600/90 text-white';
      case 'instagram':
        return 'bg-gradient-to-r from-pink-600 to-purple-600 text-white';
      case 'facebook':
        return 'bg-blue-600/90 text-white';
      case 'tiktok':
        return 'bg-slate-900 border border-slate-700 text-white';
    }
  };

  const getPlatformColor = (platform: SocialFeedItem['platform']) => {
    switch (platform) {
      case 'youtube':
        return 'text-red-400 hover:text-red-300';
      case 'instagram':
        return 'text-pink-400 hover:text-pink-300';
      case 'facebook':
        return 'text-blue-400 hover:text-blue-300';
      case 'tiktok':
        return 'text-amber-400 hover:text-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
              <span>Feed & Postingan Terbaru Media Sosial</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold font-sans">
                LIVE UPDATE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Postingan resmi dari Facebook, Instagram, TikTok & YouTube Mello TV News
            </p>
          </div>
        </div>

        {/* Refresh & Count */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchFeed}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors disabled:opacity-50"
            title="Muat Ulang Postingan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Perbarui</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Platform Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActivePlatform('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Feed ({feedItems.length})
          </button>

          <button
            onClick={() => setActivePlatform('facebook')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'facebook'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook @mellotvnews</span>
          </button>

          <button
            onClick={() => setActivePlatform('instagram')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'instagram'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram @mellotvnews</span>
          </button>

          <button
            onClick={() => setActivePlatform('tiktok')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'tiktok'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
            </svg>
            <span>TikTok @mellotvnews</span>
          </button>

          <button
            onClick={() => setActivePlatform('youtube')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'youtube'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube @mellotv-news</span>
          </button>
        </div>

        {/* Search Feed Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci di postingan sosial (@mellotvnews, breaking, fakta, siaran)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Feed List Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900 border border-slate-800 rounded-3xl">
          <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">Memuat postingan media sosial...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900 border border-slate-800 rounded-3xl">
          <p className="text-base font-semibold text-slate-300">
            Tidak ada postingan yang sesuai pencarian atau filter.
          </p>
          <button
            onClick={() => {
              setActivePlatform('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Tampilkan Semua Postingan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const isLiked = likedPosts.includes(item.id);
            const totalLikes = (item.likes || 0) + (isLiked ? 1 : 0);

            return (
              <article
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                {/* Post Top Author Header */}
                <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${getPlatformBadge(
                        item.platform
                      )}`}
                    >
                      {getPlatformIcon(item.platform, 'w-5 h-5')}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm truncate font-display">
                          {item.authorName}
                        </span>
                        {item.isVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-amber-400">{item.authorHandle}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(item.publishedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={item.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                    title={`Buka di ${item.platform}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Media Preview Container */}
                <div className="relative bg-slate-950 overflow-hidden">
                  {item.platform === 'youtube' && item.embedUrl ? (
                    <div className="aspect-video relative group">
                      <img
                        src={
                          item.thumbnailUrl ||
                          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt="Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <a
                        href={item.postUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </a>
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/80 text-white text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-sm">
                        <Eye className="w-3 h-3 text-red-400" />
                        {item.views || 'YouTube Official'}
                      </span>
                    </div>
                  ) : (
                    <div className="h-56 sm:h-64 relative group overflow-hidden">
                      <img
                        src={item.mediaUrl}
                        alt="Media Feed"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.platform === 'tiktok' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700 text-amber-400 flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-amber-400 ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        {item.views && (
                          <span className="px-2.5 py-1 rounded bg-black/80 text-white text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-sm">
                            <Eye className="w-3 h-3 text-amber-400" />
                            {item.views}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 text-[10px] font-semibold backdrop-blur-sm uppercase">
                          {item.platform}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Text & Tags */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-amber-400 hover:text-amber-300 cursor-pointer"
                          onClick={() => setSearchQuery(t)}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Footer Actions */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex items-center gap-1.5 transition-colors font-semibold ${
                        isLiked ? 'text-red-500' : 'hover:text-red-400 text-slate-400'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                      />
                      <span>{totalLikes.toLocaleString('id-ID')}</span>
                    </button>

                    {/* Comments count */}
                    {item.comments !== undefined && (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <MessageSquare className="w-4 h-4 text-slate-500" />
                        <span>{item.comments.toLocaleString('id-ID')}</span>
                      </span>
                    )}

                    {/* Shares count */}
                    {item.shares !== undefined && (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Repeat className="w-4 h-4 text-slate-500" />
                        <span>{item.shares.toLocaleString('id-ID')}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Post */}
                    <button
                      onClick={() => handleSharePost(item)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="Salin tautan atau bagikan"
                    >
                      {copiedPostId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400 font-bold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Bagikan</span>
                        </>
                      )}
                    </button>

                    {/* Open External Post */}
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${getPlatformColor(
                        item.platform
                      )} hover:bg-slate-800`}
                    >
                      <span>Buka di {item.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
