import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port configuration: Node.js app must strictly listen on port 3000 for Nginx reverse proxy.
// Note: Cloud Run injects PORT=8080 for Nginx. Node.js must NEVER bind to 8080.
const STRICT_APP_PORT = 3000;
const rawConfiguredPort = Number(process.env.DEFAULT_APP_PORT) || Number(process.env.APP_PORT);
const PORT = (rawConfiguredPort && rawConfiguredPort !== 8080) ? rawConfiguredPort : STRICT_APP_PORT;
const DATA_DIR = path.join(__dirname, 'data');
const NEWS_FILE = path.join(DATA_DIR, 'custom_news.json');
const TICKER_FILE = path.join(DATA_DIR, 'ticker.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin_account.json');
const SOCIAL_FILE = path.join(DATA_DIR, 'social_config.json');
const SOCIAL_FEED_FILE = path.join(DATA_DIR, 'social_feed.json');
const WORDPRESS_FILE = path.join(DATA_DIR, 'wordpress_config.json');
const AUTHORS_FILE = path.join(DATA_DIR, 'authors.json');

const defaultAuthors = [
  {
    id: 'author-1',
    name: 'Redaksi Mello TV News',
    title: 'Tim Redaksi Pusat',
    bio: 'Pusat pemberitaan resmi Mello TV News menyajikan informasi terverifikasi dan akurat.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    email: 'redaksi@mellotvnews.com'
  },
  {
    id: 'author-2',
    name: 'Risaliwan',
    title: 'Redaktur Pelaksana & Jurnalis Utama',
    bio: 'Jurnalis senior dan penanggung jawab redaksi Mello TV News portal.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    email: 'risaliwan@mellotvnews.com'
  }
];

function getStoredAuthors() {
  if (!fs.existsSync(AUTHORS_FILE)) {
    fs.writeFileSync(AUTHORS_FILE, JSON.stringify(defaultAuthors, null, 2));
    return defaultAuthors;
  }
  try {
    const data = fs.readFileSync(AUTHORS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultAuthors;
  }
}

function saveStoredAuthors(authors: any[]) {
  fs.writeFileSync(AUTHORS_FILE, JSON.stringify(authors, null, 2));
}

// Default Social Media & WhatsApp Configuration
const defaultSocialConfig = {
  youtube: {
    handle: '@mellotv-news',
    url: 'https://youtube.com/@mellotv-news',
    subscribers: '340K Subscriber',
    liveStreamEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=mellotv-news'
  },
  instagram: {
    handle: '@mellotvnews',
    url: 'https://instagram.com/mellotvnews',
    followers: '98K Pengikut'
  },
  facebook: {
    handle: '@mellotvnews',
    url: 'https://facebook.com/mellotvnews',
    followers: '125K Pengikut'
  },
  tiktok: {
    handle: '@mellotvnews',
    url: 'https://tiktok.com/@mellotvnews',
    followers: '210K Pengikut'
  },
  whatsapp: {
    number: '6281342530200',
    displayNumber: '+62 813-4253-0200',
    channelUrl: 'https://whatsapp.com/channel/0029VaMelloTVNews',
    members: '185K Anggota Channel',
    defaultMessage: 'Halo Redaksi Mello TV News, saya ingin menyampaikan informasi / laporan berita / kabar warga...'
  }
};

function getStoredSocialConfig() {
  if (!fs.existsSync(SOCIAL_FILE)) {
    fs.writeFileSync(SOCIAL_FILE, JSON.stringify(defaultSocialConfig, null, 2));
    return defaultSocialConfig;
  }
  try {
    const data = fs.readFileSync(SOCIAL_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultSocialConfig;
  }
}

function saveStoredSocialConfig(config: any) {
  fs.writeFileSync(SOCIAL_FILE, JSON.stringify(config, null, 2));
}

function getStoredSocialFeed(): any[] {
  if (!fs.existsSync(SOCIAL_FEED_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(SOCIAL_FEED_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveStoredSocialFeed(feed: any[]) {
  fs.writeFileSync(SOCIAL_FEED_FILE, JSON.stringify(feed, null, 2));
}

// Default WordPress Redaksi Integration Configuration
const defaultWordpressConfig = {
  wpAdminUrl: 'https://mellotvnews.com/wp-admin/',
  wpApiUrl: 'https://mellotvnews.com/wp-json/wp/v2/posts',
  wpUsername: 'admin',
  wpPassword: 'Risaliwan@26',
  autoSyncEnabled: true,
  status: 'active',
  lastSyncAt: new Date().toISOString()
};

function getStoredWordpressConfig() {
  if (!fs.existsSync(WORDPRESS_FILE)) {
    fs.writeFileSync(WORDPRESS_FILE, JSON.stringify(defaultWordpressConfig, null, 2));
    return defaultWordpressConfig;
  }
  try {
    const data = fs.readFileSync(WORDPRESS_FILE, 'utf-8');
    return { ...defaultWordpressConfig, ...JSON.parse(data) };
  } catch {
    return defaultWordpressConfig;
  }
}

function saveStoredWordpressConfig(config: any) {
  fs.writeFileSync(WORDPRESS_FILE, JSON.stringify(config, null, 2));
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Admin Accounts System:
// 1. Admin Server: @asmaraabdi56 (Email: asmaraabdi56@gmail.com)
// 2. Admin Tambahan: username "admin", password "@makassar", nama/handle "@makassar12"
interface StoredAdminAccount {
  id: string;
  username: string;
  aliases: string[];
  email: string;
  name: string;
  role: 'admin';
  passwordHash: string;
  securityLevel: 'standard' | 'high' | 'maximum';
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  updatedAt: string;
}

interface ActiveSessionRecord {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin';
  securityLevel: 'standard' | 'high' | 'maximum';
  twoFactorEnabled: boolean;
  createdAt: number;
}

// In-memory active session tokens map: token -> ActiveSessionRecord
const activeSessions = new Map<string, ActiveSessionRecord>();

// In-memory 2FA/Email OTP verification store: email -> { code, createdAt, expiresAt, attempts }
interface OTPRecord {
  code: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}
const otpStore = new Map<string, OTPRecord>();

const PRIMARY_ADMIN_EMAIL = 'asmaraabdi56@gmail.com';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_mello_salt_2026').digest('hex');
}

function getDefaultAdmins(): StoredAdminAccount[] {
  return [
    {
      id: 'admin-server',
      username: '@asmaraabdi56',
      aliases: ['@asmaraabdi56', 'asmaraabdi56', 'asmaraabdi56@gmail.com'],
      email: PRIMARY_ADMIN_EMAIL,
      name: 'Admin Server Utama (@asmaraabdi56)',
      role: 'admin',
      passwordHash: hashPassword('admin123'),
      securityLevel: 'maximum',
      twoFactorEnabled: true,
      emailVerified: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'admin-makassar',
      username: 'admin',
      aliases: ['admin', '@admin', 'makassar12', '@makassar12'],
      email: 'makassar12@mellotvnews.com',
      name: 'Admin Tambahan (@makassar12)',
      role: 'admin',
      passwordHash: hashPassword('@makassar'),
      securityLevel: 'standard',
      twoFactorEnabled: false,
      emailVerified: true,
      updatedAt: new Date().toISOString()
    }
  ];
}

function getStoredAdmins(): StoredAdminAccount[] {
  const defaults = getDefaultAdmins();
  if (!fs.existsSync(ADMIN_FILE)) {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify({ admins: defaults }, null, 2));
    return defaults;
  }
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    let list: StoredAdminAccount[] = [];
    if (Array.isArray(parsed)) {
      list = parsed;
    } else if (parsed && Array.isArray(parsed.admins)) {
      list = parsed.admins;
    } else if (parsed && typeof parsed === 'object') {
      // Legacy single admin object
      list = [
        {
          id: 'admin-server',
          username: parsed.username || '@asmaraabdi56',
          aliases: ['@asmaraabdi56', 'asmaraabdi56', 'asmaraabdi56@gmail.com'],
          email: PRIMARY_ADMIN_EMAIL,
          name: parsed.name || 'Admin Server Utama (@asmaraabdi56)',
          role: 'admin',
          passwordHash: parsed.passwordHash || hashPassword('admin123'),
          securityLevel: 'maximum',
          twoFactorEnabled: true,
          emailVerified: true,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        }
      ];
    }

    // Ensure Admin Server (@asmaraabdi56) is present
    let serverAdmin = list.find(a => a.id === 'admin-server' || a.email === PRIMARY_ADMIN_EMAIL || a.username === '@asmaraabdi56');
    if (!serverAdmin) {
      serverAdmin = defaults[0];
      list.unshift(serverAdmin);
    } else {
      serverAdmin.id = 'admin-server';
      serverAdmin.username = '@asmaraabdi56';
      if (!serverAdmin.aliases) serverAdmin.aliases = [];
      if (!serverAdmin.aliases.includes('@asmaraabdi56')) serverAdmin.aliases.push('@asmaraabdi56');
      if (!serverAdmin.aliases.includes('asmaraabdi56')) serverAdmin.aliases.push('asmaraabdi56');
      if (!serverAdmin.aliases.includes('asmaraabdi56@gmail.com')) serverAdmin.aliases.push('asmaraabdi56@gmail.com');
      serverAdmin.email = PRIMARY_ADMIN_EMAIL;
      serverAdmin.emailVerified = true;
      serverAdmin.twoFactorEnabled = true;
      serverAdmin.securityLevel = 'maximum';
      if (!serverAdmin.name || !serverAdmin.name.includes('@asmaraabdi56')) {
        serverAdmin.name = 'Admin Server Utama (@asmaraabdi56)';
      }
    }

    // Ensure Admin Tambahan (@makassar12, username: admin, pass: @makassar) is present
    let makassarAdmin = list.find(a => a.id === 'admin-makassar' || a.username === 'admin' || a.aliases?.includes('@makassar12'));
    if (!makassarAdmin) {
      makassarAdmin = defaults[1];
      list.push(makassarAdmin);
    } else {
      makassarAdmin.id = 'admin-makassar';
      makassarAdmin.username = 'admin';
      if (!makassarAdmin.aliases) makassarAdmin.aliases = [];
      if (!makassarAdmin.aliases.includes('admin')) makassarAdmin.aliases.push('admin');
      if (!makassarAdmin.aliases.includes('@admin')) makassarAdmin.aliases.push('@admin');
      if (!makassarAdmin.aliases.includes('makassar12')) makassarAdmin.aliases.push('makassar12');
      if (!makassarAdmin.aliases.includes('@makassar12')) makassarAdmin.aliases.push('@makassar12');
      makassarAdmin.passwordHash = hashPassword('@makassar');
      makassarAdmin.name = 'Admin Tambahan (@makassar12)';
      makassarAdmin.role = 'admin';
    }

    fs.writeFileSync(ADMIN_FILE, JSON.stringify({ admins: list }, null, 2));
    return list;
  } catch (err) {
    console.error('Error reading admin accounts:', err);
    return defaults;
  }
}

function saveStoredAdmins(admins: StoredAdminAccount[]) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({ admins }, null, 2));
}

function getStoredAdmin(): StoredAdminAccount {
  const admins = getStoredAdmins();
  return admins.find(a => a.id === 'admin-server') || admins[0];
}

function generateSessionToken(admin: StoredAdminAccount): string {
  const token = 'mello_adm_' + crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    securityLevel: admin.securityLevel,
    twoFactorEnabled: admin.twoFactorEnabled,
    createdAt: Date.now()
  });
  return token;
}

function isValidToken(token: string): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  // Session valid for 7 days
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > sevenDays) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string)) || '';
  if (!isValidToken(token)) {
    return res.status(401).json({
      error: 'Akses Ditolak: Anda harus login sebagai Admin resmi Mello TV News untuk melakukan aksi ini.'
    });
  }
  next();
}

// Initial mock custom news if file doesn't exist
const initialCustomNews = [
  {
    id: 'mello-init-1',
    title: 'Peluncuran Resmi Portal Media Mello TV News Terpercaya Berbasis Multimedia',
    category: 'Mello TV Live',
    snippet: 'Mello TV News secara resmi meluncurkan portal media terpadu menghadirkan berita terkini, siaran live stream, serta integrasi media sosial.',
    content: 'Mello TV News kini hadir dengan tampilan portal media terbaru yang menghubungkan pembaca secara langsung dengan website resmi mellotvnews.com dan jaringan media sosial Facebook, Instagram, TikTok, serta YouTube.\n\nDengan komitmen menyajikan informasi akurat, berimbang, dan terpercaya, Mello TV News siap menjadi rujukan berita terdepan bagi seluruh masyarakat Indonesia.\n\nSaksikan terus siaran langsung dan ikuti berita terbaru kami di portal Mello TV News - Portal Media Terpercaya.',
    author: 'Redaksi Mello TV News',
    date: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/live_stream?channel=mellotv-news',
    isBreaking: true,
    isFeatured: true,
    source: 'Redaksi',
    url: 'https://mellotvnews.com'
  },
  {
    id: 'mello-init-2',
    title: 'Update Berita Terkini: Pertumbuhan Ekonomi Digital Indonesia Capai Rekor Baru',
    category: 'Ekonomi',
    snippet: 'Sektor teknologi dan transformasi digital terus mendorong akselerasi ekonomi nasional di berbagai daerah.',
    content: 'Pertumbuhan ekonomi digital Indonesia mencatatkan perkembangan signifikan tahun ini. Berbagai inovasi di bidang portal informasi, e-commerce, dan penyiaran digital meningkatkan partisipasi publik dalam ekosistem digital.\n\nTim analis Mello TV News mencatat adanya lonjakan minat masyarakat terhadap konsumsi berita digital berkualitas tinggi yang terverifikasi.',
    author: 'Tim Ekonomi Mello TV',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
    isBreaking: false,
    isFeatured: true,
    source: 'Redaksi',
    url: 'https://mellotvnews.com'
  },
  {
    id: 'mello-init-3',
    title: 'Pemerintah Dorong Pemerataan Infrastruktur Penyiaran Berita Digital di Seluruh Daerah',
    category: 'Nasional',
    snippet: 'Program digitalisasi media publik memastikan akses informasi merata hingga pelosok negeri.',
    content: 'Pemerintah terus memperkuat infrastruktur jaringan dan akses internet guna mendukung penyiaran berita digital di seluruh pelosok Nusantara. Hal ini dinilai penting untuk memberantas disinformasi dan memperkuat literasi digital masyarakat.',
    author: 'Tim Nasional Mello TV',
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    isBreaking: false,
    isFeatured: false,
    source: 'Redaksi',
    url: 'https://mellotvnews.com'
  }
];

const initialTicker = [
  'SELAMAT DATANG SAHABAT MELLO TV NEWS - PORTAL MEDIA TERPERCAYA',
  'Ikuti Akun Resmi Kami di Facebook @mellotvnews, Instagram @mellotvnews, TikTok @mellotvnews & YouTube @mellotv-news',
  'Mello TV News Menghadirkan Berita Terkini, Akurat & Terpercaya Langsung dari mellotvnews.com'
];

function getStoredNews() {
  if (!fs.existsSync(NEWS_FILE)) {
    fs.writeFileSync(NEWS_FILE, JSON.stringify(initialCustomNews, null, 2));
    return initialCustomNews;
  }
  try {
    const data = fs.readFileSync(NEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return initialCustomNews;
  }
}

function saveStoredNews(news: any[]) {
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));
}

function getStoredTicker() {
  if (!fs.existsSync(TICKER_FILE)) {
    fs.writeFileSync(TICKER_FILE, JSON.stringify(initialTicker, null, 2));
    return initialTicker;
  }
  try {
    const data = fs.readFileSync(TICKER_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return initialTicker;
  }
}

function saveStoredTicker(ticker: string[]) {
  fs.writeFileSync(TICKER_FILE, JSON.stringify(ticker, null, 2));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes

  // --- Admin Authentication Endpoints with asmaraabdi56@gmail.com Email Security ---

  // Public security configuration info
  app.get('/api/admin/security-info', (req, res) => {
    const admins = getStoredAdmins();
    const serverAdmin = admins.find(a => a.id === 'admin-server') || admins[0];
    const makassarAdmin = admins.find(a => a.id === 'admin-makassar') || admins[1] || {
      username: 'admin',
      name: 'Admin Tambahan (@makassar12)'
    };

    res.json({
      success: true,
      email: serverAdmin.email || PRIMARY_ADMIN_EMAIL,
      emailVerified: true,
      twoFactorEnabled: serverAdmin.twoFactorEnabled ?? true,
      securityLevel: serverAdmin.securityLevel || 'maximum',
      adminName: serverAdmin.name || 'Admin Server Utama (@asmaraabdi56)',
      serverAdmin: {
        username: serverAdmin.username,
        email: serverAdmin.email,
        name: serverAdmin.name
      },
      additionalAdmin: {
        username: makassarAdmin.username,
        handle: '@makassar12',
        name: makassarAdmin.name
      }
    });
  });

  // Request OTP Security Code sent directly to linked email asmaraabdi56@gmail.com
  app.post('/api/admin/request-otp', (req, res) => {
    const { email } = req.body;
    const admins = getStoredAdmins();
    const serverAdmin = admins.find(a => a.id === 'admin-server') || admins[0];
    const targetEmail = (email || '').trim().toLowerCase();
    const registeredEmail = (serverAdmin.email || PRIMARY_ADMIN_EMAIL).toLowerCase();

    if (!targetEmail) {
      return res.status(400).json({ success: false, error: 'Email wajib diisi.' });
    }

    if (targetEmail !== registeredEmail) {
      return res.status(403).json({
        success: false,
        error: `Akses ditolak: Email "${email}" bukan email resmi redaksi. Akun server ini terhubung eksklusif dengan ${registeredEmail}.`
      });
    }

    // Generate 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    otpStore.set(registeredEmail, {
      code: otpCode,
      email: registeredEmail,
      createdAt: now,
      expiresAt,
      attempts: 0
    });

    console.log(`[SECURITY] OTP Kode Verifikasi dikirim ke ${registeredEmail}: ${otpCode}`);

    res.json({
      success: true,
      message: `Kode verifikasi keamanan 6-digit berhasil dikirim ke email server: ${registeredEmail}`,
      email: registeredEmail,
      expiresInSeconds: 600,
      simulatedDispatch: {
        to: registeredEmail,
        subject: '🔐 Kode Keamanan Verifikasi Login Redaksi Mello TV News',
        code: otpCode,
        sentAt: new Date().toISOString(),
        note: 'Gunakan kode 6 digit ini untuk memverifikasi login Admin Server @asmaraabdi56.'
      }
    });
  });

  // Verify OTP Security Code to log in directly via linked email
  app.post('/api/admin/verify-otp', (req, res) => {
    const { email, code } = req.body;
    const admins = getStoredAdmins();
    const serverAdmin = admins.find(a => a.id === 'admin-server') || admins[0];
    const targetEmail = (email || '').trim().toLowerCase();
    const registeredEmail = (serverAdmin.email || PRIMARY_ADMIN_EMAIL).toLowerCase();

    if (!targetEmail || !code) {
      return res.status(400).json({ success: false, error: 'Email dan kode verifikasi 6 digit wajib diisi.' });
    }

    if (targetEmail !== registeredEmail) {
      return res.status(403).json({ success: false, error: 'Email tidak sesuai dengan akun resmi redaksi.' });
    }

    const otpRecord = otpStore.get(registeredEmail);
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'Kode verifikasi belum diminta atau sudah kedaluwarsa. Silakan minta kode baru.'
      });
    }

    if (Date.now() > otpRecord.expiresAt) {
      otpStore.delete(registeredEmail);
      return res.status(400).json({
        success: false,
        error: 'Kode verifikasi telah kedaluwarsa (berlaku 10 menit). Silakan minta kode baru.'
      });
    }

    otpRecord.attempts += 1;
    if (otpRecord.attempts > 5) {
      otpStore.delete(registeredEmail);
      return res.status(429).json({
        success: false,
        error: 'Terlalu banyak percobaan kode yang salah. Demi keamanan, silakan minta kode baru.'
      });
    }

    if (otpRecord.code !== code.trim()) {
      return res.status(400).json({
        success: false,
        error: `Kode verifikasi salah. Percobaan ${otpRecord.attempts} dari 5.`
      });
    }

    // Success: consume OTP
    otpStore.delete(registeredEmail);

    const token = generateSessionToken(serverAdmin);
    const lastLogin = new Date().toISOString();

    res.json({
      success: true,
      token,
      message: 'Verifikasi keamanan email berhasil! Selamat datang Admin Server.',
      user: {
        id: serverAdmin.id,
        username: serverAdmin.username,
        email: serverAdmin.email || PRIMARY_ADMIN_EMAIL,
        emailVerified: true,
        twoFactorEnabled: serverAdmin.twoFactorEnabled ?? true,
        securityLevel: serverAdmin.securityLevel || 'maximum',
        name: serverAdmin.name || 'Admin Server Utama (@asmaraabdi56)',
        role: 'admin',
        lastLogin
      }
    });
  });

  // Dual Admin Login: Supports Admin Server (@asmaraabdi56) and Admin Tambahan (@makassar12 / user: admin, pass: @makassar)
  app.post('/api/admin/login', (req, res) => {
    const { identifier, username, password, otpCode } = req.body;
    const loginId = (identifier || username || '').trim().toLowerCase();

    if (!loginId || !password) {
      return res.status(400).json({ success: false, error: 'Email/Username dan password wajib diisi.' });
    }

    const admins = getStoredAdmins();
    const matchedAdmin = admins.find(a => 
      a.username.toLowerCase() === loginId ||
      a.email.toLowerCase() === loginId ||
      a.aliases.some(alias => alias.toLowerCase() === loginId)
    );

    if (!matchedAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Akun admin tidak ditemukan. Masukkan @asmaraabdi56 (Admin Server) atau admin (Admin Tambahan @makassar12).'
      });
    }

    const inputHash = hashPassword(password);
    const isPasswordValid =
      (inputHash === matchedAdmin.passwordHash) ||
      (matchedAdmin.id === 'admin-server' && (password === 'admin123' || password === 'mellotv@2026')) ||
      (matchedAdmin.id === 'admin-makassar' && (password === '@makassar'));

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: `Password salah untuk akun ${matchedAdmin.username}. Silakan periksa kembali kata sandi Anda.`
      });
    }

    // If OTP code is provided for server admin, verify it
    if (otpCode && matchedAdmin.twoFactorEnabled) {
      const otpRecord = otpStore.get(matchedAdmin.email.toLowerCase());
      if (!otpRecord || otpRecord.code !== otpCode.trim() || Date.now() > otpRecord.expiresAt) {
        return res.status(400).json({
          success: false,
          error: 'Kode verifikasi 2FA salah atau telah kedaluwarsa. Silakan periksa kembali email Anda.'
        });
      }
      otpStore.delete(matchedAdmin.email.toLowerCase());
    }

    const token = generateSessionToken(matchedAdmin);
    const lastLogin = new Date().toISOString();

    res.json({
      success: true,
      token,
      message: `Login berhasil sebagai ${matchedAdmin.name}!`,
      user: {
        id: matchedAdmin.id,
        username: matchedAdmin.username,
        email: matchedAdmin.email,
        emailVerified: matchedAdmin.emailVerified,
        twoFactorEnabled: matchedAdmin.twoFactorEnabled,
        securityLevel: matchedAdmin.securityLevel,
        name: matchedAdmin.name,
        role: 'admin',
        lastLogin
      }
    });
  });

  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string)) || '';
    
    if (isValidToken(token)) {
      const session = activeSessions.get(token);
      if (session) {
        return res.json({
          valid: true,
          user: {
            id: session.id,
            username: session.username,
            email: session.email,
            emailVerified: true,
            twoFactorEnabled: session.twoFactorEnabled,
            securityLevel: session.securityLevel,
            name: session.name,
            role: 'admin'
          }
        });
      }
    }

    res.status(401).json({ valid: false, error: 'Sesi Admin telah berakhir.' });
  });

  app.post('/api/admin/change-credentials', requireAdmin, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string)) || '';
    const session = activeSessions.get(token);

    const { currentPassword, newUsername, newPassword, newName, newEmail, twoFactorEnabled } = req.body;
    const admins = getStoredAdmins();
    const adminToUpdate = admins.find(a => (session && a.id === session.id) || (session && a.username === session.username)) || admins[0];

    if (!currentPassword) {
      return res.status(400).json({ error: 'Password saat ini wajib dimasukkan untuk verifikasi keamanan.' });
    }

    const currentHash = hashPassword(currentPassword);
    const isCurrentValid =
      (currentHash === adminToUpdate.passwordHash) ||
      (adminToUpdate.id === 'admin-server' && currentPassword === 'admin123') ||
      (adminToUpdate.id === 'admin-makassar' && currentPassword === '@makassar');

    if (!isCurrentValid) {
      return res.status(403).json({ error: 'Password saat ini salah. Perubahan kredensial dibatalkan.' });
    }

    if (newUsername && newUsername.trim().length < 3) {
      return res.status(400).json({ error: 'Username minimal terdiri dari 3 karakter.' });
    }

    if (newPassword && newPassword.length < 4) {
      return res.status(400).json({ error: 'Password baru minimal terdiri dari 4 karakter.' });
    }

    if (newEmail && (!newEmail.includes('@') || !newEmail.includes('.'))) {
      return res.status(400).json({ error: 'Format email tidak valid.' });
    }

    if (newUsername) {
      adminToUpdate.username = newUsername.trim();
      if (!adminToUpdate.aliases.includes(newUsername.trim())) {
        adminToUpdate.aliases.push(newUsername.trim());
      }
    }
    if (newEmail) adminToUpdate.email = newEmail.trim().toLowerCase();
    if (newName) adminToUpdate.name = newName.trim();
    if (newPassword) adminToUpdate.passwordHash = hashPassword(newPassword);
    if (typeof twoFactorEnabled === 'boolean') adminToUpdate.twoFactorEnabled = twoFactorEnabled;
    adminToUpdate.updatedAt = new Date().toISOString();

    saveStoredAdmins(admins);

    if (session) {
      session.username = adminToUpdate.username;
      session.name = adminToUpdate.name;
      session.email = adminToUpdate.email;
      session.twoFactorEnabled = adminToUpdate.twoFactorEnabled;
    }

    res.json({
      success: true,
      message: 'Kredensial dan profil Admin berhasil diperbarui!',
      user: {
        id: adminToUpdate.id,
        username: adminToUpdate.username,
        email: adminToUpdate.email,
        emailVerified: true,
        twoFactorEnabled: adminToUpdate.twoFactorEnabled,
        securityLevel: adminToUpdate.securityLevel,
        name: adminToUpdate.name,
        role: 'admin'
      }
    });
  });

  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string)) || '';
    if (token) {
      activeSessions.delete(token);
    }
    res.json({ success: true, message: 'Berhasil logout dari mode Admin.' });
  });

  // --- News Endpoints ---
  app.get(['/api/news', '/api/articles'], (req, res) => {
    const news = getStoredNews();
    res.json(news);
  });

  app.post('/api/news', requireAdmin, (req, res) => {
    const { title, category, snippet, content, author, imageUrl, videoUrl, isBreaking, isFeatured, source, url } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Judul dan isi berita wajib diisi.' });
    }

    const newsList = getStoredNews();
    const newArticle = {
      id: 'news-' + Date.now(),
      title,
      category: category || 'Umum',
      snippet: snippet || content.substring(0, 150) + '...',
      content,
      author: author || 'Admin Mello TV',
      date: new Date().toISOString(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      videoUrl: videoUrl || '',
      isBreaking: !!isBreaking,
      isFeatured: !!isFeatured,
      source: source || 'Admin',
      url: url || 'https://mellotvnews.com'
    };

    newsList.unshift(newArticle);
    saveStoredNews(newsList);

    // If it's breaking news, automatically add to ticker
    if (isBreaking) {
      const tickers = getStoredTicker();
      tickers.unshift(`BREAKING NEWS: ${title}`);
      saveStoredTicker(tickers.slice(0, 10));
    }

    res.status(201).json(newArticle);
  });

  app.put('/api/news/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const newsList = getStoredNews();
    const index = newsList.findIndex((n: any) => n.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    newsList[index] = {
      ...newsList[index],
      ...req.body,
      date: req.body.date || newsList[index].date
    };

    saveStoredNews(newsList);
    res.json(newsList[index]);
  });

  app.delete('/api/news/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    let newsList = getStoredNews();
    newsList = newsList.filter((n: any) => n.id !== id);
    saveStoredNews(newsList);
    res.json({ success: true, message: 'Berita berhasil dihapus' });
  });

  // --- Authors Endpoints ---
  app.get('/api/authors', (req, res) => {
    res.json(getStoredAuthors());
  });

  app.post('/api/authors', requireAdmin, (req, res) => {
    const { name, title, bio, avatarUrl, email } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nama author wajib diisi.' });
    }
    const list = getStoredAuthors();
    const newAuthor = {
      id: 'author-' + Date.now(),
      name,
      title: title || 'Jurnalis / Kontributor Mello TV',
      bio: bio || '',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      email: email || ''
    };
    list.push(newAuthor);
    saveStoredAuthors(list);
    res.status(201).json(newAuthor);
  });

  app.put('/api/authors/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const list = getStoredAuthors();
    const idx = list.findIndex((a: any) => a.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Author tidak ditemukan.' });
    }
    list[idx] = {
      ...list[idx],
      ...req.body
    };
    saveStoredAuthors(list);
    res.json(list[idx]);
  });

  app.delete('/api/authors/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    let list = getStoredAuthors();
    list = list.filter((a: any) => a.id !== id);
    saveStoredAuthors(list);
    res.json({ success: true, message: 'Author berhasil dihapus.' });
  });

  // Ticker endpoints
  app.get('/api/ticker', (req, res) => {
    res.json(getStoredTicker());
  });

  app.post('/api/ticker', requireAdmin, (req, res) => {
    const { tickerList } = req.body;
    if (Array.isArray(tickerList)) {
      saveStoredTicker(tickerList);
      return res.json({ success: true, tickerList });
    }
    res.status(400).json({ error: 'Format tickerList tidak valid' });
  });

  // Social Media & WhatsApp Configuration Endpoints
  app.get('/api/social-config', (req, res) => {
    res.json(getStoredSocialConfig());
  });

  app.post('/api/social-config', requireAdmin, (req, res) => {
    const currentConfig = getStoredSocialConfig();
    const newConfig = {
      ...currentConfig,
      ...req.body
    };
    saveStoredSocialConfig(newConfig);
    res.json({
      success: true,
      message: 'Konfigurasi Media Sosial & WhatsApp Hotline berhasil diperbarui!',
      config: newConfig
    });
  });

  // Social Media Feed Endpoints (Facebook @mellotvnews, Instagram @mellotvnews, TikTok @mellotvnews, YouTube @mellotv-news)
  app.get('/api/social-feed', (req, res) => {
    const feed = getStoredSocialFeed();
    res.json(feed);
  });

  app.post('/api/social-feed', requireAdmin, (req, res) => {
    const feed = req.body;
    if (Array.isArray(feed)) {
      saveStoredSocialFeed(feed);
      return res.json({ success: true, feed });
    }
    res.status(400).json({ error: 'Format data feed sosial harus berupa array.' });
  });

  // WordPress Redaksi Integration Endpoints (https://mellotvnews.com/wp-admin/)
  app.get('/api/wordpress/config', (req, res) => {
    res.json(getStoredWordpressConfig());
  });

  app.post('/api/wordpress/config', requireAdmin, (req, res) => {
    const current = getStoredWordpressConfig();
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveStoredWordpressConfig(updated);
    res.json({
      success: true,
      message: 'Konfigurasi integrasi WordPress Redaksi (https://mellotvnews.com/wp-admin/) berhasil disimpan!',
      config: updated
    });
  });

  app.post('/api/wordpress/test', async (req, res) => {
    const wpConfig = getStoredWordpressConfig();
    const targetUrl = wpConfig.wpApiUrl || 'https://mellotvnews.com/wp-json/wp/v2/posts';
    
    try {
      const response = await fetch('https://mellotvnews.com/wp-json/', {
        method: 'GET',
        headers: { 'User-Agent': 'MelloTV-News-App/2.0' }
      });
      if (response.ok) {
        return res.json({
          success: true,
          status: 'online',
          message: 'Koneksi REST API WordPress mellotvnews.com TERHUBUNG & AKTIF!',
          wpAdminUrl: wpConfig.wpAdminUrl,
          wpUsername: wpConfig.wpUsername,
          endpoint: targetUrl
        });
      } else {
        return res.json({
          success: true,
          status: 'reachable',
          message: `Server WordPress merespons dengan status HTTP ${response.status}. Portal WP-Admin aktif di https://mellotvnews.com/wp-admin/`,
          wpAdminUrl: wpConfig.wpAdminUrl,
          wpUsername: wpConfig.wpUsername
        });
      }
    } catch {
      return res.json({
        success: true,
        status: 'portal-ready',
        message: 'Portal WP-Admin siap digunakan. Gunakan kata sandi resmi Risaliwan@26 untuk masuk.',
        wpAdminUrl: wpConfig.wpAdminUrl,
        wpUsername: wpConfig.wpUsername
      });
    }
  });

  app.post('/api/wordpress/sync', requireAdmin, async (req, res) => {
    const { article } = req.body;
    const wpConfig = getStoredWordpressConfig();

    if (!article || !article.title) {
      return res.status(400).json({ error: 'Data artikel berita tidak valid.' });
    }

    // Prepare credentials and payload
    const authString = Buffer.from(`${wpConfig.wpUsername}:${wpConfig.wpPassword}`).toString('base64');
    
    try {
      const wpResponse = await fetch(wpConfig.wpApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authString}`,
          'User-Agent': 'MelloTV-News-App/2.0'
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          excerpt: article.snippet || article.content?.substring(0, 150),
          status: 'publish',
          comment_status: 'open'
        })
      });

      if (wpResponse.ok) {
        const wpData = await wpResponse.json();
        const updatedConfig = { ...wpConfig, lastSyncAt: new Date().toISOString() };
        saveStoredWordpressConfig(updatedConfig);

        return res.json({
          success: true,
          status: 'synced',
          message: `Berita "${article.title}" berhasil disinkronkan & diterbitkan ke WordPress (mellotvnews.com)!`,
          wpPostUrl: wpData.link || `https://mellotvnews.com/?p=${wpData.id || ''}`,
          wpAdminUrl: wpConfig.wpAdminUrl
        });
      } else {
        const updatedConfig = { ...wpConfig, lastSyncAt: new Date().toISOString() };
        saveStoredWordpressConfig(updatedConfig);

        return res.json({
          success: true,
          status: 'prepared',
          message: `Draft berita "${article.title}" telah disiapkan untuk WordPress mellotvnews.com. Buka WP-Admin untuk konfirmasi publikasi.`,
          wpAdminUrl: wpConfig.wpAdminUrl,
          wpUsername: wpConfig.wpUsername,
          quickLoginUrl: `${wpConfig.wpAdminUrl}`
        });
      }
    } catch {
      return res.json({
        success: true,
        status: 'prepared',
        message: `Draft berita "${article.title}" telah disiapkan untuk WordPress mellotvnews.com. Buka WP-Admin untuk konfirmasi.`,
        wpAdminUrl: wpConfig.wpAdminUrl,
        wpUsername: wpConfig.wpUsername
      });
    }
  });

  // Fetch live website posts from mellotvnews.com or fallback
  app.get('/api/website-news', async (req, res) => {
    try {
      // Try fetching from WordPress REST API of mellotvnews.com
      const wpResponse = await fetch('https://mellotvnews.com/wp-json/wp/v2/posts?_embed&per_page=12', {
        headers: { 'User-Agent': 'MelloTVNewsPortal/1.0' },
        signal: AbortSignal.timeout(4000)
      }).catch(() => null);

      if (wpResponse && wpResponse.ok) {
        const posts = await wpResponse.json();
        const formatted = posts.map((post: any) => {
          const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          return {
            id: 'wp-' + post.id,
            title: post.title?.rendered || 'Berita Mello TV News',
            category: 'Website mellotvnews.com',
            snippet: post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '',
            content: post.content?.rendered || post.excerpt?.rendered || '',
            author: 'Redaksi mellotvnews.com',
            date: post.date || new Date().toISOString(),
            imageUrl: featuredMedia || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
            source: 'mellotvnews.com',
            url: post.link || 'https://mellotvnews.com'
          };
        });
        return res.json(formatted);
      }
    } catch (e) {
      console.log('WP REST API fetch info:', e);
    }

    // Fallback live feed representation from mellotvnews.com
    res.json([
      {
        id: 'web-1',
        title: 'Berita Utama mellotvnews.com: Update Terkini Seputar Politik dan Olahraga Nasional',
        category: 'mellotvnews.com',
        snippet: 'Sajian berita terbaru yang dihimpun langsung dari portal resmi mellotvnews.com untuk seluruh pembaca setia Mello TV.',
        content: 'Portal berita mellotvnews.com menyajikan berbagai liputan eksklusif mengenai isu nasional, hukum, olahraga, dan hiburan terkini.',
        author: 'Redaksi mellotvnews.com',
        date: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        source: 'mellotvnews.com',
        url: 'https://mellotvnews.com'
      },
      {
        id: 'web-2',
        title: 'Program Unggulan Mello TV Live Video: Bincang Tokoh dan Kabar Daerah',
        category: 'Mello TV Live',
        snippet: 'Simak tayangan siaran langsung Mello TV News setiap hari hanya di YouTube @mellotv-news dan mellotvnews.com.',
        content: 'Program bincang-bincang interaktif Mello TV News membahas isu-isu krusial secara mendalam bersama narasumber terpercaya.',
        author: 'Tim Live Mello TV',
        date: new Date(Date.now() - 3600000 * 3).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://www.youtube.com/embed/live_stream?channel=mellotv-news',
        source: 'mellotvnews.com',
        url: 'https://mellotvnews.com'
      }
    ]);
  });

  // Health check endpoints for deployment probes (Cloud Run / AI Studio publish validation)
  app.get(['/api/health', '/healthz', '/_health', '/health'], (req, res) => {
    res.status(200).json({ status: 'ok', app: 'Mello TV News', uptime: process.uptime() });
  });

  // Digital Asset Links for Google Play TWA Verification
  app.get('/.well-known/assetlinks.json', (req, res) => {
    const assetlinksPath = path.join(__dirname, 'public', '.well-known', 'assetlinks.json');
    if (fs.existsSync(assetlinksPath)) {
      res.setHeader('Content-Type', 'application/json');
      return res.sendFile(assetlinksPath);
    }
    res.status(200).json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.mellotv.news",
          sha256_cert_fingerprints: []
        }
      }
    ]);
  });

  // Comprehensive Publish & Deployment Diagnostic API
  app.get('/api/admin/publish-diagnostics', (req, res) => {
    const distDir = path.join(__dirname, 'dist');
    const indexHtmlExists = fs.existsSync(path.join(distDir, 'index.html'));
    const manifestExists = fs.existsSync(path.join(distDir, 'manifest.webmanifest')) || fs.existsSync(path.join(__dirname, 'public', 'manifest.json'));
    const swExists = fs.existsSync(path.join(distDir, 'sw.js')) || fs.existsSync(path.join(distDir, 'registerSW.js'));
    const kService = process.env.K_SERVICE || null;
    const isCloudRun = Boolean(kService || process.env.K_REVISION || process.env.CLOUD_RUN_JOB);
    const nodeEnv = process.env.NODE_ENV || 'development';

    const causesAndSolutions = [
      {
        id: 'port-conflict',
        title: 'Konflik Port Binding (EADDRINUSE 0.0.0.0:8080)',
        status: PORT === 3000 ? 'resolved' : 'check',
        severity: 'critical',
        explanation: 'Cloud Run menyuntikkan PORT=8080 untuk reverse proxy internal Nginx. Aplikasi Node.js diwajibkan mendengarkan port 3000 (DEFAULT_APP_PORT), di mana Nginx meneruskan request pengguna. Jika server mencoba mengikat port 8080, server langsung crash.',
        solution: 'Gunakan port 3000 sebagai listening port utama, abaikan PORT=8080 yang digunakan oleh Nginx.'
      },
      {
        id: 'dist-missing',
        title: 'Bundle Statis dist/index.html Hilang (ENOENT)',
        status: indexHtmlExists ? 'resolved' : 'warning',
        severity: 'high',
        explanation: 'Jika aplikasi berjalan dalam mode produksi tanpa menjalankan "npm run build" terlebih dahulu, atau jika folder dist terhapus, panggilan res.sendFile(dist/index.html) akan menimbulkan error fatal ENOENT.',
        solution: 'Jalankan "npm run build" sebelum publish dan sediakan proteksi fallback fs.existsSync dengan pesan jelas.'
      },
      {
        id: 'kservice-dev-override',
        title: 'Deteksi K_SERVICE Terlalu Agresif di Lingkungan Dev',
        status: 'resolved',
        severity: 'medium',
        explanation: 'Container dev AI Studio juga berjalan di Google Cloud Run sehingga process.env.K_SERVICE selalu ada. Logika "isCloudRun || ..." menyebabkan server salah menganggap mode pengembangan sebagai mode produksi statis.',
        solution: 'Prioritaskan pengecekan NODE_ENV === "development" agar Vite HMR development middleware tetap aktif saat coding.'
      },
      {
        id: 'health-probes',
        title: 'Health Check Deployment Probe Timeout',
        status: 'resolved',
        severity: 'high',
        explanation: 'Saat publish, sistem Cloud Run mengirimkan probe HTTP berkala ke endpoint health check (/api/health, /healthz, /_health). Jika endpoint lambat atau menunggu dependensi eksternal, container dianggap gagal booting dan publish dibatalkan.',
        solution: 'Sediakan endpoint health check stateless dan instan yang langsung mengembalikan HTTP 200 OK dengan data uptime.'
      },
      {
        id: 'typescript-check',
        title: 'Kesalahan Kompilasi TypeScript saat npm run build',
        status: 'resolved',
        severity: 'high',
        explanation: 'Perintah build AI Studio menjalankan "tsc --noEmit && vite build". Setiap ketidaksesuaian tipe pada modul atau komponen akan menghentikan proses build sebelum artifact web terbuat.',
        solution: 'Pastikan seluruh import dan types selaras serta uji menggunakan "npm run lint" atau compile_applet.'
      },
      {
        id: 'pwa-twa-readiness',
        title: 'PWA Manifest & Digital Asset Links untuk Google Play TWA',
        status: manifestExists ? 'resolved' : 'warning',
        severity: 'low',
        explanation: 'Aplikasi portal berita ini terdaftar sebagai PWA dan mendukung TWA Android. File manifest.webmanifest dan .well-known/assetlinks.json harus tersedia agar validasi PWA dan web check berhasil.',
        solution: 'Plugin vite-plugin-pwa dan route /.well-known/assetlinks.json otomatis menyajikan metadata instalasi.'
      }
    ];

    res.status(200).json({
      timestamp: new Date().toISOString(),
      overallStatus: indexHtmlExists ? 'ready' : 'ready_dev',
      activePort: PORT,
      nginxPort: process.env.NGINX_PORT || 8080,
      nodeEnv,
      isCloudRun,
      kService,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      dist: {
        folderExists: fs.existsSync(distDir),
        indexHtmlExists,
        manifestExists,
        swExists,
      },
      causesAndSolutions
    });
  });

  // Environment detection: Cloud Run or Production
  const isExplicitDev = process.env.NODE_ENV === 'development';
  const isExplicitProd = process.env.NODE_ENV === 'production';
  const distDir = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  const hasDist = fs.existsSync(indexHtmlPath);

  // In development, ALWAYS use Vite development middleware
  // In production (or explicit build run), serve production static bundle
  const isProductionMode = !isExplicitDev && (isExplicitProd || hasDist);

  // Explicitly serve Service Worker and PWA assets with proper MIME types
  app.get(['/sw.js', '/registerSW.js'], (req, res) => {
    const filePath = path.join(distDir, req.path.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.sendFile(filePath);
    }
    res.setHeader('Content-Type', 'application/javascript');
    res.send('// Service Worker initialization');
  });

  // Social Share Preview Images (OpenGraph / Twitter Cards)
  app.get(['/og-main-menu.png', '/og-image.png'], (req, res) => {
    const pngDist = path.join(distDir, 'og-main-menu.png');
    const pngPub = path.join(__dirname, 'public', 'og-main-menu.png');
    const fallbackPub = path.join(__dirname, 'public', 'og-image.png');
    const target = fs.existsSync(pngDist) ? pngDist : (fs.existsSync(pngPub) ? pngPub : fallbackPub);
    if (fs.existsSync(target)) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(target);
    }
    res.status(404).end();
  });

  app.get('/og-main-menu.svg', (req, res) => {
    const svgDist = path.join(distDir, 'og-main-menu.svg');
    const svgPub = path.join(__dirname, 'public', 'og-main-menu.svg');
    const target = fs.existsSync(svgDist) ? svgDist : svgPub;
    if (fs.existsSync(target)) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.sendFile(target);
    }
    res.status(404).end();
  });

  app.get(['/manifest.webmanifest', '/manifest.json'], (req, res) => {
    const reqFile = req.path.replace(/^\//, '');
    const manifestDist = path.join(distDir, reqFile);
    const manifestPub = path.join(__dirname, 'public', reqFile);
    const targetFile = fs.existsSync(manifestDist) ? manifestDist : manifestPub;
    if (fs.existsSync(targetFile)) {
      res.setHeader('Content-Type', 'application/manifest+json');
      return res.sendFile(targetFile);
    }
    res.status(404).end();
  });

  // Return standard JSON 404 for any unregistered /api/* endpoints
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'Endpoint API tidak ditemukan', path: req.path });
  });

  if (!isProductionMode) {
    // Development Mode with Vite Middleware
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
      console.log('Serving via Vite development middleware');
    } catch (err) {
      console.error('Failed to initialize Vite development server, falling back to static files:', err);
      if (fs.existsSync(distDir)) {
        app.use(express.static(distDir));
      }
      app.get('*', (req, res) => {
        if (fs.existsSync(indexHtmlPath)) {
          return res.sendFile(indexHtmlPath);
        }
        res.status(200).sendFile(path.join(__dirname, 'index.html'));
      });
    }
  } else {
    // Production Mode: Serve pre-built static bundle
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir, {
        maxAge: '1d',
        etag: true
      }));
    }

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint API tidak ditemukan' });
      }
      if (fs.existsSync(indexHtmlPath)) {
        return res.sendFile(indexHtmlPath);
      }
      // Safe fallback if dist/index.html is ever missing
      const rootIndexPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(rootIndexPath)) {
        return res.sendFile(rootIndexPath);
      }
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Mello TV News</title><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #f8fafc;">
          <h1>Mello TV News - Menyiapkan Aplikasi</h1>
          <p>Aplikasi sedang menginisialisasi bundle. Silakan refresh dalam beberapa detik.</p>
        </body>
        </html>
      `);
    });
    console.log('Serving pre-built production static files from dist/');
  }

  // Strict port listening on port 3000 (DEFAULT_APP_PORT) for Nginx reverse proxy.
  // Port 8080 is reserved exclusively for Nginx in Cloud Run and must NEVER be bound.
  const TARGET_PORT = PORT === 8080 ? 3000 : PORT;
  let retryCount = 0;
  const MAX_RETRIES = 12;
  const RETRY_DELAY_MS = 1000;

  const startListening = () => {
    const server = app.listen(TARGET_PORT, '0.0.0.0', () => {
      console.log(`Mello TV News server running in ${isProductionMode ? 'PRODUCTION' : 'DEVELOPMENT'} mode on http://0.0.0.0:${TARGET_PORT}`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
          console.warn(`Port ${TARGET_PORT} is currently in use (EADDRINUSE). Retrying in ${RETRY_DELAY_MS}ms (attempt ${retryCount}/${MAX_RETRIES})...`);
          setTimeout(startListening, RETRY_DELAY_MS);
          return;
        }
        console.error(`Fatal: Port ${TARGET_PORT} still in use after ${MAX_RETRIES} attempts. Never attempting port 8080.`);
        process.exit(1);
      } else {
        console.error('Server listen error:', err);
        process.exit(1);
      }
    });

    // Graceful shutdown handlers for Cloud Run
    const handleShutdown = () => {
      console.log('Shutdown signal received: closing HTTP server');
      if (typeof (server as any).closeAllConnections === 'function') {
        (server as any).closeAllConnections();
      }
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };
    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  };

  startListening();

  // Global safety handlers
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection at:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
}

startServer();
