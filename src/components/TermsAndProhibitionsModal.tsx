import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Lock,
  Scale,
  X,
  Search,
  CheckCircle,
  Copy,
  ExternalLink,
  BookOpen,
  Info,
  UserX,
  Flame,
  Ban
} from 'lucide-react';

interface TermsAndProhibitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'all' | 'protected' | 'prohibited' | 'ethics' | 'comments';
}

export const TermsAndProhibitionsModal: React.FC<TermsAndProhibitionsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'protected' | 'prohibited' | 'ethics' | 'comments'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Synchronize when opened with initialTab
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const protectedItems = [
    {
      id: 'prot-1',
      category: 'protected',
      title: 'Hak Cipta & Kekayaan Intelektual Karya Jurnalistik',
      legalBasis: 'UU No. 28 Tahun 2014 tentang Hak Cipta & UU No. 40 Tahun 1999 tentang Pers',
      summary: 'Seluruh materi berita, teks investigasi, foto jurnalistik, video streaming, rekaman suara narasi, tata letak, dan logo 3D Mello TV News dilindungi oleh hukum.',
      details: [
        'Penggunaan komersial tanpa izin tertulis dari Redaksi Mello TV News merupakan pelanggaran hak cipta.',
        'Pengutipan untuk tujuan non-komersial atau pendidikan diperkenankan maksimal 2-3 paragraf dengan kewajiban mencantumkan kredit aktif: Sumber: Mello TV News (mellotvnews.com).',
        'Dilarang melakukan framing ulang atau memotong konteks kutipan yang mengubah makna pemberitaan asli.'
      ],
      icon: ShieldCheck,
      badgeColor: 'emerald'
    },
    {
      id: 'prot-2',
      category: 'protected',
      title: 'Perlindungan Identitas Korban & Anak di Bawah Umur',
      legalBasis: 'UU No. 11 Tahun 2012 tentang Sistem Peradilan Pidana Anak & Kode Etik Jurnalistik Pasal 5',
      summary: 'Identitas anak yang berhadapan dengan hukum serta korban kejahatan kesusilaan wajib dilindungi kerahasiaannya secara mutlak.',
      details: [
        'Wartawan dan Redaksi dilarang membuka identitas (nama lengkap, foto wajah, alamat rumah, nama orang tua, sekolah) anak di bawah usia 18 tahun.',
        'Korban kekerasan seksual, anak-anak, dan saksi rentan wajib disamarkan menggunakan inisial serta foto yang diburamkan (blur).',
        'Perlindungan ini berlaku pada seluruh kanal: Portal Web, YouTube, TikTok, Facebook, dan Instagram @mellotvnews.'
      ],
      icon: Lock,
      badgeColor: 'blue'
    },
    {
      id: 'prot-3',
      category: 'protected',
      title: 'Hak Tolak & Kerahasiaan Narasumber (Whistleblower)',
      legalBasis: 'Pasal 4 Ayat (4) UU Pers No. 40 Tahun 1999',
      summary: 'Wartawan Mello TV News memiliki Hak Tolak untuk merahasiakan nama, identitas, dan keberadaan narasumber investigasi.',
      details: [
        'Narasumber yang meminta status anonim atau "off the record" dilindungi identitasnya demi keselamatan jiwa dan keamanan hukum.',
        'Data dokumen peniup suara (whistleblower) dienkripsi dan dijaga kerahasiaannya oleh Dewan Redaksi Mello TV News.'
      ],
      icon: Scale,
      badgeColor: 'indigo'
    },
    {
      id: 'prot-4',
      category: 'protected',
      title: 'Hak Jawab, Hak Koreksi, dan Klarifikasi Publik',
      legalBasis: 'Pasal 1 & Pasal 5 UU Pers No. 40 Tahun 1999',
      summary: 'Setiap individu, lembaga, atau korporasi yang merasa dirugikan oleh suatu pemberitaan berhak mendapatkan ruang Hak Jawab.',
      details: [
        'Mello TV News berkomitmen memuat Hak Jawab secara proporsional dan tidak memungut biaya apapun.',
        'Jika ditemukan kekeliruan data atau salah ketik fakta, Redaksi wajib menerbitkan Ralat / Hak Koreksi secepatnya dan menyematkan catatan revisi pada artikel terkait.'
      ],
      icon: FileText,
      badgeColor: 'amber'
    },
    {
      id: 'prot-5',
      category: 'protected',
      title: 'Integritas Sistem & Keamanan Akun Penyiaran Admin',
      legalBasis: 'Sistem Keamanan Siber & Tata Kelola Server Mello TV News',
      summary: 'Akses penerbitan berita, penyuntingan konten, dan running text dilindungi enkripsi berlapis dan kredensial khusus redaksi.',
      details: [
        'Setiap upaya penerobosan akun admin, injeksi skrip perusak, atau manipulasi server akan dilaporkan kepada pihak berwajib.',
        'Sesi Admin dilindungi autentikasi token kriptografis untuk mencegah penyalahgunaan publikasi informasi.'
      ],
      icon: ShieldAlert,
      badgeColor: 'purple'
    }
  ];

  const prohibitedItems = [
    {
      id: 'prohib-1',
      category: 'prohibited',
      title: 'Larangan Penyebaran Berita Palsu (Hoaks & Misinformasi)',
      legalBasis: 'Pasal 28 Ayat (1) UU ITE & Pasal 14-15 UU No. 1 Tahun 1946',
      summary: 'Dilarang keras menyebarkan atau mempublikasikan berita bohong, informasi rekayasa, atau manipulasi fakta yang menyesatkan masyarakat.',
      details: [
        'Setiap berita di Mello TV News wajib melalui uji verifikasi fakta (fact-checking) dan konfirmasi sumber yang dapat dipertanggungjawabkan.',
        'Dilarang membuat judul berita umpan klik (clickbait) yang secara esensial bertentangan dengan isi materi berita.'
      ],
      icon: Ban,
      severity: 'Kritis / Pidana'
    },
    {
      id: 'prohib-2',
      category: 'prohibited',
      title: 'Larangan Ujaran Kebencian, Provokasi & Isu SARA',
      legalBasis: 'Pasal 28 Ayat (2) UU ITE & Pasal 156 KUHP',
      summary: 'Dilarang menyebarkan konten yang memicu kebencian, diskriminasi, atau permusuhan berdasarkan Suku, Agama, Ras, dan Antargolongan (SARA).',
      details: [
        'Dilarang menghasut perpecahan, konflik antarkelompok, atau penyerangan terhadap kelompok rentan dan minoritas.',
        'Semua artikel dan komentar publik yang mengandung unsur penistaan agama atau rasisme akan dihapus seketika dan akun terkait dapat diblokir.'
      ],
      icon: Flame,
      severity: 'Kritis / Pidana'
    },
    {
      id: 'prohib-3',
      category: 'prohibited',
      title: 'Larangan Pencemaran Nama Baik & Menghakimi (Trial by Press)',
      legalBasis: 'Pasal 27 Ayat (3) UU ITE & Asas Praduga Tak Bersalah Kode Etik Jurnalistik',
      summary: 'Dilarang memvonis bersalah seseorang yang sedang dalam proses hukum sebelum adanya putusan pengadilan yang berkekuatan hukum tetap.',
      details: [
        'Pemberitaan wajib menjunjung tinggi asas praduga tak bersalah (presumption of innocence).',
        'Dilarang melakukan pembunuhan karakter (character assassination) atau fitnah tanpa bukti konfirmasi berimbang (cover both sides).'
      ],
      icon: AlertTriangle,
      severity: 'Pelanggaran Etika & Hukum'
    },
    {
      id: 'prohib-4',
      category: 'prohibited',
      title: 'Larangan Pornografi, Kesusilaan & Kekerasan Vulgar/Sadis',
      legalBasis: 'UU No. 44 Tahun 2008 tentang Pornografi & Pasal 27 Ayat (1) UU ITE',
      summary: 'Dilarang menampilkan konten visual atau tulisan yang menggambarkan adegan seksual vulgar, mutilasi, darah berlebih, atau korban bencana secara eksplisit.',
      details: [
        'Foto dan video kecelakaan atau tindak kriminal wajib disensor atau diburamkan (blur) untuk menghormati martabat korban dan keluarganya.',
        'Dilarang mengeksploitasi gambar jenazah secara tidak pantas.'
      ],
      icon: UserX,
      severity: 'Pidana / Dilarang Keras'
    },
    {
      id: 'prohib-5',
      category: 'prohibited',
      title: 'Larangan Plagiarisme & Penggandaan Tanpa Izin',
      legalBasis: 'Pasal 113 UU Hak Cipta No. 28 Tahun 2014',
      summary: 'Dilarang menyalin seluruh isi berita (copypaste utuh) dari portal lain maupun membajak karya Mello TV News.',
      details: [
        'Redaksi mewajibkan para jurnalis melakukan peliputan langsung atau penulisan ulang mandiri disertai rujukan sumber awal.',
        'Situs pihak ketiga dilarang melakukan scraping otomatis atau sindikasi komersial tanpa perjanjian tertulis.'
      ],
      icon: BookOpen,
      severity: 'Pelanggaran Hak Cipta'
    },
    {
      id: 'prohib-6',
      category: 'prohibited',
      title: 'Larangan Promosi Judi Online, Narkotika & Penipuan (Scam)',
      legalBasis: 'Pasal 27 Ayat (2) UU ITE & Pasal 303 KUHP',
      summary: 'Dilarang keras menyisipkan tautan, iklan terselubung, atau promosi perjudian daring (slot/togel), narkoba, atau investasi bodong.',
      details: [
        'Kolom komentar pembaca dipantau secara berkala dari pesan spam judi online atau tautan phishing mencurigakan.',
        'Setiap komentar promosi ilegal akan langsung dibersihkan dan dilaporkan.'
      ],
      icon: Ban,
      severity: 'Pidana Ilegal'
    }
  ];

  const ethicsRules = [
    {
      rule: 'Independensi & Kejujuran',
      desc: 'Wartawan Mello TV News bersikap independen, menghasilkan berita yang akurat, berimbang, dan tidak beriktikad buruk.'
    },
    {
      rule: 'Uji Informasi (Cover Both Sides)',
      desc: 'Menempuh cara-cara yang profesional dalam melaksanakan tugas jurnalistik dengan menguji kebenaran informasi dari kedua belah pihak yang berselisih.'
    },
    {
      rule: 'Pemisahan Fakta & Opini',
      desc: 'Mengedepankan fakta yang jelas dan memisahkan opini pribadi dari laporan peristiwa nyata.'
    },
    {
      rule: 'Kewajiban Meralat Kekeliruan',
      desc: 'Segera mencabut, meralat, dan memperbaiki berita yang keliru disertai permintaan maaf jika menimbulkan kerugian.'
    }
  ];

  const commentRules = [
    {
      icon: '✅',
      title: 'Gunakan Bahasa Santun',
      desc: 'Sampaikan kritik, saran, dan opini publik dengan bahasa yang konstruktif dan menghormati sesama pembaca.'
    },
    {
      icon: '🚫',
      title: 'Bebas Ujaran SARA & Kebencian',
      desc: 'Dilarang melontarkan hinaan rasial, sentimen agama, diskriminasi gender, atau hasutan kebencian.'
    },
    {
      icon: '🚫',
      title: 'Dilarang Spam & Tautan Ilegal',
      desc: 'Dilarang memasukkan tautan promosi judi online, penipuan, tautan afiliasi mencurigakan, atau spam berulang.'
    },
    {
      icon: '⚖️',
      title: 'Tanggung Jawab Pribadi',
      desc: 'Komentar adalah tanggung jawab mutlak dari penulisnya masing-masing sesuai hukum perundang-undangan Republik Indonesia.'
    }
  ];

  // Filtering based on search query
  const filteredProtected = useMemo(() => {
    if (!searchQuery.trim()) return protectedItems;
    const q = searchQuery.toLowerCase();
    return protectedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.legalBasis.toLowerCase().includes(q) ||
        item.details.some((d) => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredProhibited = useMemo(() => {
    if (!searchQuery.trim()) return prohibitedItems;
    const q = searchQuery.toLowerCase();
    return prohibitedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.legalBasis.toLowerCase().includes(q) ||
        item.details.some((d) => d.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCopyTermsSummary = () => {
    const text = `PEDOMAN KONTEN YANG DILINDUNGI & DILARANG - MELLO TV NEWS
Website Resmi: https://mellotvnews.com

1. KONTEN YANG DILINDUNGI:
- Hak Cipta Karya Jurnalistik (UU No. 28/2014)
- Perlindungan Identitas Korban & Anak di Bawah Umur (UU SPPA)
- Hak Tolak & Kerahasiaan Narasumber (UU Pers No. 40/1999)
- Hak Jawab, Hak Koreksi & Ralat Berita
- Keamanan Akun Penyiaran Redaksi

2. KONTEN & TINDAKAN YANG DILARANG:
- Penyebaran Berita Bohong / Hoaks (UU ITE Pasal 28)
- Ujaran Kebencian & Diskriminasi SARA
- Fitnah & Pencemaran Nama Baik Tanpa Fakta
- Konten Pornografi & Kekerasan Sadis Eksplisit
- Plagiarisme & Pembajakan Konten Tanpa Izin
- Promosi Judi Online, Scam & Narkotika

Mello TV News - Portal Media Terpercaya`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-800/80 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3 h-3" />
                <span>KEBIJAKAN HUKUM & ETIKA PENYIARAN</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Syarat yang Dilindungi & Larangan Konten Mello TV News
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTermsSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Salin ringkasan pedoman hukum"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
              title="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection & Search Navigation */}
        <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Semua Ringkasan
            </button>

            <button
              onClick={() => setActiveTab('protected')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'protected'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Yang Dilindungi ({protectedItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prohibited')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'prohibited'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Ban className="w-3.5 h-3.5 text-rose-300" />
              <span>Yang Dilarang ({prohibitedItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ethics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'ethics'
                  ? 'bg-amber-600 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Kode Etik Jurnalistik</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'comments'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Tata Tertib Komentar</span>
            </button>
          </div>

          {/* Quick Search inside Modal */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci: hoaks, hak cipta..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Introductory Highlight Banner */}
          <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-5 flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300">
              <h4 className="font-bold text-white text-sm">Landasan Komitmen Jurnalistik Mello TV News</h4>
              <p className="leading-relaxed">
                Sebagai portal media pers terpercaya yang mengudara secara daring melalui{' '}
                <strong className="text-blue-400">mellotvnews.com</strong>, Mello TV News tunduk pada{' '}
                <strong>Undang-Undang No. 40 Tahun 1999 tentang Pers</strong>,{' '}
                <strong>Undang-Undang Hak Cipta No. 28 Tahun 2014</strong>,{' '}
                <strong>UU Informasi & Transaksi Elektronik (ITE)</strong>, serta{' '}
                <strong>Pedoman Pemberitaan Media Siber Dewan Pers Indonesia</strong>.
              </p>
            </div>
          </div>

          {/* SECTION 1: KONTEN YANG DILINDUNGI */}
          {(activeTab === 'all' || activeTab === 'protected') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  1. Syarat Konten & Hak-Hak yang Dilindungi Hukum
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProtected.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-3 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold text-white font-display leading-tight">{item.title}</h4>
                        </div>
                      </div>

                      <div className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                        {item.legalBasis}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

                      <ul className="space-y-1.5 pt-2 border-t border-slate-900 text-xs text-slate-400">
                        {item.details.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 text-sm leading-none">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: KONTEN & TINDAKAN YANG DILARANG KERAS */}
          {(activeTab === 'all' || activeTab === 'prohibited') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Ban className="w-5 h-5 text-rose-500" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  2. Syarat Konten & Tindakan yang Dilarang Keras
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProhibited.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-3 hover:border-rose-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold text-white font-display leading-tight">{item.title}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950 border border-red-800 text-red-400 shrink-0">
                          {item.severity}
                        </span>
                      </div>

                      <div className="text-[10px] text-rose-300 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block">
                        {item.legalBasis}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>

                      <ul className="space-y-1.5 pt-2 border-t border-slate-900 text-xs text-slate-400">
                        {item.details.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 text-sm leading-none">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: KODE ETIK JURNALISTIK REDAKSI */}
          {(activeTab === 'all' || activeTab === 'ethics') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  3. Kode Etik & Standar Operasional Jurnalistik Redaksi
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ethicsRules.map((rule, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{rule.rule}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-7">{rule.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: TATA TERTIB KOMENTAR PEMBACA */}
          {(activeTab === 'all' || activeTab === 'comments') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  4. Tata Tertib & Ketentuan Komentar Pembaca
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {commentRules.map((cr, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <span className="text-xl shrink-0">{cr.icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">{cr.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{cr.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact / Redaksi Clarification Footer */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-white font-bold">Layanan Pengaduan & Hak Jawab:</span>
              <p>
                Hubungi Redaksi Mello TV News di <strong className="text-amber-400">redaksi@mellotvnews.com</strong> atau website resmi{' '}
                <a href="https://mellotvnews.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  mellotvnews.com
                </a>
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors shrink-0"
            >
              Saya Memahami Ketentuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
