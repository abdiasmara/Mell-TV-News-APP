import React, { useState } from 'react';
import {
  MessageCircle,
  Youtube,
  Instagram,
  Facebook,
  Share2,
  X,
  Send,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import { SocialMediaConfig } from '../types';

interface FloatingSocialWidgetProps {
  socialConfig?: SocialMediaConfig;
}

export const FloatingSocialWidget: React.FC<FloatingSocialWidgetProps> = ({ socialConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'social'>('whatsapp');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // WhatsApp Draft Form
  const [reportType, setReportType] = useState('Laporan Berita Warga');
  const [senderName, setSenderName] = useState('');
  const [senderLocation, setSenderLocation] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const defaultWa = {
    number: '6281342530200',
    displayNumber: '+62 813-4253-0200',
    channelUrl: 'https://whatsapp.com/channel/0029VaMelloTVNews',
    members: '185K Anggota Channel',
    defaultMessage: 'Halo Redaksi Mello TV News...'
  };

  const waConfig = socialConfig?.whatsapp || defaultWa;
  const ytConfig = socialConfig?.youtube || { handle: '@mellotv-news', url: 'https://youtube.com/@mellotv-news' };
  const igConfig = socialConfig?.instagram || { handle: '@mellotvnews', url: 'https://instagram.com/mellotvnews' };
  const fbConfig = socialConfig?.facebook || { handle: '@mellotvnews', url: 'https://facebook.com/mellotvnews' };
  const ttConfig = socialConfig?.tiktok || { handle: '@mellotvnews', url: 'https://tiktok.com/@mellotvnews' };

  const handleSendWhatsAppMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    const formattedText = `*${reportType.toUpperCase()} - MELLO TV NEWS*\n` +
      `👤 *Nama:* ${senderName.trim() || 'Pembaca Mello TV'}\n` +
      `📍 *Lokasi:* ${senderLocation.trim() || 'Indonesia'}\n` +
      `📝 *Pesan / Informasi:* ${messageBody.trim()}\n\n` +
      `_Dikirim melalui Portal Resmi Mello TV News (mellotvnews.com)_`;

    const waUrl = `https://api.whatsapp.com/send?phone=${waConfig.number}&text=${encodeURIComponent(formattedText)}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(waConfig.displayNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end space-y-3 pointer-events-auto">
      {/* Expanded Widget Modal */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn space-y-0">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                  <span>Hotline Redaksi Mello TV</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono">WhatsApp: {waConfig.displayNumber}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'social'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Semua Media Sosial</span>
            </button>
          </div>

          {/* Tab Content: WhatsApp Form */}
          {activeTab === 'whatsapp' && (
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* WhatsApp Quick Info */}
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-300">
                  <span className="font-semibold flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" /> Hotline WhatsApp Redaksi
                  </span>
                  <button
                    onClick={handleCopyNumber}
                    className="p-1 hover:text-white flex items-center gap-1 text-[10px]"
                    title="Salin Nomor WhatsApp"
                  >
                    {copiedNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNumber ? 'Tersalin' : 'Salin Nomor'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Kirimkan liputan warga, rilis pers, berita breaking, atau pertanyaan langsung ke nomor WhatsApp resmi Redaksi Mello TV News.
                </p>
              </div>

              <form onSubmit={handleSendWhatsAppMessage} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Kategori Laporan:</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Laporan Berita Warga">📢 Laporan Berita Warga (Citizen Journalism)</option>
                    <option value="Hak Jawab & Ralat Berita">⚖️ Hak Jawab & Ralat Berita</option>
                    <option value="Undangan Preslis & Liputan">📰 Rilis Pers & Undangan Media</option>
                    <option value="Pertanyaan & Saran">💬 Pertanyaan & Saran Redaksi</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Nama Anda..."
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Kota / Lokasi..."
                      value={senderLocation}
                      onChange={(e) => setSenderLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Tulis pesan atau ringkasan informasi berita Anda di sini..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan via WhatsApp Redaksi</span>
                </button>
              </form>

              {/* Join Channel Banner */}
              <a
                href={waConfig.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-600 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Gabung WhatsApp Channel Mello TV
                    </div>
                    <div className="text-[10px] text-slate-400">{waConfig.members || '185K Anggota'}</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </a>
            </div>
          )}

          {/* Tab Content: All Social Media Icons */}
          {activeTab === 'social' && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Kanal Resmi Penyiaran & Informasi Mello TV News:
              </p>

              <div className="space-y-2">
                <a
                  href={ytConfig.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-600 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <Youtube className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-red-400">YouTube Official</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ytConfig.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <a
                  href={igConfig.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-600 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-pink-400">Instagram Official</div>
                      <div className="text-[10px] text-slate-400 font-mono">{igConfig.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <a
                  href={fbConfig.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-600 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400">Facebook Official</div>
                      <div className="text-[10px] text-slate-400 font-mono">{fbConfig.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <a
                  href={ttConfig.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-500 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white">
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.32V9.05a8.16 8.16 0 0 0 4.69 1.48V7.08a4.84 4.84 0 0 1-.76-.39z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400">TikTok Official</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ttConfig.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>
              </div>
            </div>
          )}

          {/* Footer badge */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" /> Redaksi Terverifikasi
            </span>
            <span>mellotvnews.com</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95 border border-emerald-400/40"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-emerald-600 animate-ping" />
        </div>
        <span className="font-display font-bold tracking-tight">WhatsApp & Social Media</span>
      </button>
    </div>
  );
};
