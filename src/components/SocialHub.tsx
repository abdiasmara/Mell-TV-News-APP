import React, { useState } from 'react';
import { SocialLink, SocialMediaConfig } from '../types';
import { SocialMediaFeed } from './SocialMediaFeed';
import {
  Youtube,
  Instagram,
  Facebook,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Play,
  Sparkles,
  MessageCircle,
  Heart,
  Radio,
  Send,
  PhoneCall,
  ShieldCheck,
  Video,
  Grid,
  TrendingUp
} from 'lucide-react';

interface SocialHubProps {
  socialConfig?: SocialMediaConfig;
}

export const SocialHub: React.FC<SocialHubProps> = ({ socialConfig }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'whatsapp'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // WhatsApp Message Composer State
  const [waSubject, setWaSubject] = useState('Laporan Berita Warga');
  const [waName, setWaName] = useState('');
  const [waCity, setWaCity] = useState('');
  const [waContent, setWaContent] = useState('');

  const defaultWa = {
    number: '6281342530200',
    displayNumber: '+62 813-4253-0200',
    channelUrl: 'https://whatsapp.com/channel/0029VaMelloTVNews',
    members: '185K Anggota Channel',
    defaultMessage: 'Halo Redaksi Mello TV News...'
  };

  const wa = socialConfig?.whatsapp || defaultWa;
  const yt = socialConfig?.youtube || {
    handle: '@mellotv-news',
    url: 'https://youtube.com/@mellotv-news',
    subscribers: '340K Subscriber',
    liveStreamEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=mellotv-news'
  };
  const ig = socialConfig?.instagram || { handle: '@mellotvnews', url: 'https://instagram.com/mellotvnews', followers: '98K Pengikut' };
  const fb = socialConfig?.facebook || { handle: '@mellotvnews', url: 'https://facebook.com/mellotvnews', followers: '125K Pengikut' };
  const tt = socialConfig?.tiktok || { handle: '@mellotvnews', url: 'https://tiktok.com/@mellotvnews', followers: '210K Pengikut' };

  const socialLinks: SocialLink[] = [
    {
      id: 'wa',
      platform: 'whatsapp',
      handle: wa.displayNumber,
      url: `https://api.whatsapp.com/send?phone=${wa.number}&text=${encodeURIComponent(wa.defaultMessage)}`,
      color: 'from-emerald-600 to-teal-800',
      description: 'Hotline WhatsApp & Channel Resmi Redaksi Mello TV News. Kirimkan laporan warga, rilis pers, dan informasi berita secara realtime.',
      followers: wa.members,
      category: 'hotline'
    },
    {
      id: 'yt',
      platform: 'youtube',
      handle: yt.handle,
      url: yt.url,
      color: 'from-red-600 to-red-800',
      description: 'Kanal YouTube Resmi Mello TV News. Streaming siaran langsung 24/7, program berita unggulan, dan dokumenter liputan.',
      followers: yt.subscribers,
      category: 'video'
    },
    {
      id: 'ig',
      platform: 'instagram',
      handle: ig.handle,
      url: ig.url,
      color: 'from-pink-600 via-purple-600 to-amber-500',
      description: 'Akun Instagram Resmi Mello TV News. Infografis berita terkini, kuis interaktif, serta momen di balik layar penyiaran.',
      followers: ig.followers,
      category: 'social'
    },
    {
      id: 'fb',
      platform: 'facebook',
      handle: fb.handle,
      url: fb.url,
      color: 'from-blue-600 to-blue-800',
      description: 'Halaman Facebook Resmi Mello TV News. Dapatkan berita harian, diskusi publik, dan siaran langsung interaktif.',
      followers: fb.followers,
      category: 'social'
    },
    {
      id: 'tt',
      platform: 'tiktok',
      handle: tt.handle,
      url: tt.url,
      color: 'from-slate-900 to-slate-950 border border-slate-700',
      description: 'Akun TikTok Resmi Mello TV News. Video berita durasi pendek, rangkuman fakta cepat, dan sorotan berita viral.',
      followers: tt.followers,
      category: 'video'
    },
  ];

  const handleCopyHandle = (handle: string, id: string) => {
    navigator.clipboard.writeText(handle);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waContent.trim()) return;

    const formattedText = `*${waSubject.toUpperCase()} - MELLO TV NEWS*\n` +
      `👤 *Pengirim:* ${waName.trim() || 'Pembaca Mello TV'}\n` +
      `📍 *Kota / Lokasi:* ${waCity.trim() || 'Indonesia'}\n` +
      `📝 *Isi Informasi:* ${waContent.trim()}\n\n` +
      `_Melalui Hub Redaksi Portal mellotvnews.com_`;

    const waUrl = `https://api.whatsapp.com/send?phone=${wa.number}&text=${encodeURIComponent(formattedText)}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle className="w-6 h-6 text-white" />;
      case 'facebook':
        return <Facebook className="w-6 h-6 text-white" />;
      case 'instagram':
        return <Instagram className="w-6 h-6 text-white" />;
      case 'tiktok':
        return (
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
          </svg>
        );
      case 'youtube':
        return <Youtube className="w-6 h-6 text-white" />;
      default:
        return <Share2 className="w-6 h-6 text-white" />;
    }
  };

  const filteredLinks = activeTab === 'all'
    ? socialLinks
    : socialLinks.filter((item) => item.platform === activeTab);

  return (
    <div className="space-y-10">
      {/* Header Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Integrasi Multimedia 5 Platform Media Sosial</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            Terhubung Langsung Dengan YouTube, Instagram, Facebook, TikTok & WhatsApp Redaksi
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pusat komunikasi resmi Mello TV News. Saksikan siaran live stream, pantau berita viral di Instagram & TikTok, diskusi di Facebook, serta kirim berita langsung ke WhatsApp Redaksi.
          </p>
        </div>
      </div>

      {/* Platform Filter Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Platform (5)
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Redaksi</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'youtube' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4" />
            <span>YouTube Live</span>
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'instagram' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'facebook' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'tiktok' ? 'bg-slate-800 text-white border border-slate-700 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>TikTok</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 px-2 font-mono hidden lg:block">
          Terverifikasi @mellotvnews
        </div>
      </div>

      {/* Social Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((item) => (
          <div
            key={item.id}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
          >
            {/* Background Accent Gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />

            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    {getPlatformIcon(item.platform)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors capitalize font-display">
                      {item.platform}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                      <span>{item.handle}</span>
                      <button
                        onClick={() => handleCopyHandle(item.handle, item.id)}
                        className="p-1 hover:text-white transition-colors"
                        title="Salin Kontak"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {item.followers && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700 shrink-0">
                    {item.followers}
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity`}
              >
                <span>Buka {item.platform.toUpperCase()} ({item.handle})</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* LATEST SOCIAL MEDIA FEED & POSTS STREAM */}
      <SocialMediaFeed
        initialPlatform={
          activeTab === 'all' || activeTab === 'whatsapp'
            ? 'all'
            : (activeTab as 'facebook' | 'instagram' | 'tiktok' | 'youtube')
        }
      />

      {/* SPECIAL SECTION 1: WHATSAPP HOTLINE REDAKSI & COMPOSER */}
      {(activeTab === 'all' || activeTab === 'whatsapp') && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300 text-[10px] font-bold uppercase mb-1">
                  <PhoneCall className="w-3 h-3" /> Hotline Langsung
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  WhatsApp Redaksi & Laporan Warga Mello TV News
                </h3>
              </div>
            </div>

            <a
              href={wa.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/60 text-emerald-400 font-bold text-xs hover:bg-emerald-900/40 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Gabung WhatsApp Channel ({wa.members})</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Direct Form Composer */}
            <form onSubmit={handleSendWhatsApp} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Kirim Pesan Langsung ke WhatsApp Redaksi</span>
              </h4>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Pilih Kategori Pesan:</label>
                <select
                  value={waSubject}
                  onChange={(e) => setWaSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Laporan Berita Warga">📢 Laporan Berita Warga (Citizen Journalism)</option>
                  <option value="Hak Jawab & Ralat Berita">⚖️ Hak Jawab & Klarifikasi Berita</option>
                  <option value="Rilis Pers & Undangan Media">📰 Rilis Pers & Undangan Peliputan</option>
                  <option value="Kerjasama Iklan & Sponsorship">💼 Kerjasama Iklan & Penyiaran</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda..."
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Kota / Daerah..."
                  value={waCity}
                  onChange={(e) => setWaCity(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <textarea
                rows={4}
                placeholder="Tuliskan berita, kronologi kejadian, rilis, atau pertanyaan Anda di sini..."
                value={waContent}
                onChange={(e) => setWaContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                required
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Buka WhatsApp & Kirim Ke {wa.displayNumber}</span>
              </button>
            </form>

            {/* Information Cards */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Nomor Hotline WhatsApp Redaksi</span>
                </h5>
                <div className="text-xl font-mono font-bold text-emerald-400">
                  {wa.displayNumber}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Layanan hotline ini dipantau oleh Tim Desk Informasi & Redaksi Mello TV News selama jam penyiaran untuk menangani setiap masukan publik dan laporan kejadian penting secara cepat.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Jaminan Kerahasiaan Whistleblower</span>
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sesuai Undang-Undang Pers No. 40/1999 Pasal 4 Ayat 4, Mello TV News menjamin Hak Tolak dan kerahasiaan identitas narasumber warga yang menyampaikan laporan berita sensitif.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL SECTION 2: YOUTUBE LIVE & VIDEO STREAM PLAYER */}
      {(activeTab === 'all' || activeTab === 'youtube') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Siaran Live Stream YouTube {yt.handle}
                </h3>
                <p className="text-xs text-slate-400">Siaran Langsung & Video Penyiaran Mello TV News</p>
              </div>
            </div>

            <a
              href={yt.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>Subscribe {yt.handle} ({yt.subscribers})</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-video relative shadow-inner">
              <iframe
                src={yt.liveStreamEmbedUrl || "https://www.youtube.com/embed/live_stream?channel=mellotv-news"}
                title="YouTube Mello TV Live Stream"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col justify-between bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950 border border-red-800 text-red-400 text-xs font-bold uppercase mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  LIVE STREAMING 24/7
                </div>
                <h4 className="font-bold text-white text-base leading-snug mb-2 font-display">
                  Mello TV News Live Broadcast
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Saksikan tayangan langsung breaking news, analisis isu politik nasional, kabar daerah, dan dialog spesial di YouTube resmi Mello TV.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500" /> Komunitas YouTube
                  </span>
                  <span className="text-white font-mono">{yt.subscribers}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-blue-400" /> Format Siaran
                  </span>
                  <span className="text-emerald-400 font-bold">HD 1080p Live</span>
                </div>
              </div>

              <a
                href={yt.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Kunjungi Kanal YouTube</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL SECTION 3: INSTAGRAM, FACEBOOK & TIKTOK PREVIEWS */}
      {(activeTab === 'all' || activeTab === 'instagram' || activeTab === 'facebook' || activeTab === 'tiktok') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Instagram Feature Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-display">Instagram {ig.handle}</h4>
                  <p className="text-[11px] text-pink-400 font-semibold">{ig.followers}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Infografis berita terkini, reels momen eksklusif redaksi, serta kuis kabar mingguan bagi generasi muda.
              </p>
            </div>

            <a
              href={ig.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow {ig.handle}</span>
            </a>
          </div>

          {/* Facebook Feature Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-display">Facebook {fb.handle}</h4>
                  <p className="text-[11px] text-blue-400 font-semibold">{fb.followers}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ruang diskusi publik warga, artikel analisis mendalam, serta ruang tanggapan mengenai berita daerah.
              </p>
            </div>

            <a
              href={fb.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span>Ikuti {fb.handle}</span>
            </a>
          </div>

          {/* TikTok Feature Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-white">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-display">TikTok {tt.handle}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold">{tt.followers}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rangkuman berita berdurasi singkat, fakta ringkas 60 detik, dan liputan lapangan seru.
              </p>
            </div>

            <a
              href={tt.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-md transition-colors"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span>Tonton {tt.handle}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
