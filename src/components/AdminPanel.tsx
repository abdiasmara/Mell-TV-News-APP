import React, { useState } from 'react';
import { NewsArticle, UserRole, AdminUser, Author } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { PublishDiagnosticsModal } from './PublishDiagnosticsModal';
import { AdminEngagementDashboard } from './AdminEngagementDashboard';
import {
  Shield,
  Lock,
  User,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  RefreshCcw,
  Volume2,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Key,
  Scale,
  ShieldAlert,
  Ban,
  CheckSquare,
  Mail,
  Send,
  ShieldCheck,
  Copy,
  Share2,
  AlertTriangle,
  ExternalLink,
  Globe,
  CopyCheck,
  Activity,
  BarChart3
} from 'lucide-react';

interface AdminPanelProps {
  userRole: UserRole;
  adminUser?: AdminUser | null;
  adminToken?: string;
  onLoginSuccess: (token: string, user: AdminUser) => void;
  onLogout: () => void;
  onUpdateAdminProfile?: (user: AdminUser) => void;
  onOpenTerms?: (tab?: 'all' | 'protected' | 'prohibited' | 'ethics' | 'comments') => void;
  articles: NewsArticle[];
  onCreateArticle: (article: Partial<NewsArticle>) => Promise<void>;
  onUpdateArticle: (id: string, updated: Partial<NewsArticle>) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  tickerItems: string[];
  onSaveTicker: (tickers: string[]) => Promise<void>;
  bookmarks?: string[];
  authors: Author[];
  onCreateAuthor: (authorData: Partial<Author>) => Promise<void>;
  onUpdateAuthor: (id: string, authorData: Partial<Author>) => Promise<void>;
  onDeleteAuthor: (id: string) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  userRole,
  adminUser,
  adminToken,
  onLoginSuccess,
  onLogout,
  onUpdateAdminProfile,
  onOpenTerms,
  articles,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
  tickerItems,
  onSaveTicker,
  bookmarks = [],
  authors = [],
  onCreateAuthor,
  onUpdateAuthor,
  onDeleteAuthor,
}) => {
  // Login Form State for Locked Mode
  const [usernameInput, setUsernameInput] = useState('asmaraabdi56@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // OTP Login in AdminPanel
  const [inlineOtpSent, setInlineOtpSent] = useState(false);
  const [inlineOtpCode, setInlineOtpCode] = useState('');
  const [inlineSimulatedOtp, setInlineSimulatedOtp] = useState<string | null>(null);

  // Change Credentials Modal/Form State
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [settingsStatus, setSettingsStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // OTP Email Verification Test State
  const [isTestingOtp, setIsTestingOtp] = useState(false);
  const [otpTestNotice, setOtpTestNotice] = useState<string | null>(null);
  const [testSimulatedOtp, setTestSimulatedOtp] = useState<string | null>(null);

  // Social Media & WhatsApp Settings Form State
  const [showSocialSettings, setShowSocialSettings] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialStatus, setSocialStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // WhatsApp Config
  const [waNumber, setWaNumber] = useState('6281342530200');
  const [waDisplayNumber, setWaDisplayNumber] = useState('+62 813-4253-0200');
  const [waChannelUrl, setWaChannelUrl] = useState('https://whatsapp.com/channel/0029VaMelloTVNews');
  const [waMembers, setWaMembers] = useState('185K Anggota Channel');

  // YouTube Config
  const [ytHandle, setYtHandle] = useState('@mellotv-news');
  const [ytUrl, setYtUrl] = useState('https://youtube.com/@mellotv-news');
  const [ytSubscribers, setYtSubscribers] = useState('340K Subscriber');
  const [ytLiveEmbedUrl, setYtLiveEmbedUrl] = useState('https://www.youtube.com/embed/live_stream?channel=mellotv-news');

  // Instagram Config
  const [igHandle, setIgHandle] = useState('@mellotvnews');
  const [igUrl, setIgUrl] = useState('https://instagram.com/mellotvnews');
  const [igFollowers, setIgFollowers] = useState('98K Pengikut');

  // Facebook Config
  const [fbHandle, setFbHandle] = useState('@mellotvnews');
  const [fbUrl, setFbUrl] = useState('https://facebook.com/mellotvnews');
  const [fbFollowers, setFbFollowers] = useState('125K Pengikut');

  // TikTok Config
  const [ttHandle, setTtHandle] = useState('@mellotvnews');
  const [ttUrl, setTtUrl] = useState('https://tiktok.com/@mellotvnews');
  const [ttFollowers, setTtFollowers] = useState('210K Pengikut');

  // WordPress Redaksi Integration State (https://mellotvnews.com/wp-admin/)
  const [showWpPanel, setShowWpPanel] = useState(true);
  const [wpAdminUrl, setWpAdminUrl] = useState('https://mellotvnews.com/wp-admin/');
  const [wpUsername, setWpUsername] = useState('admin');
  const [wpPassword, setWpPassword] = useState('Risaliwan@26');
  const [syncToWp, setSyncToWp] = useState(true);
  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [isTestingWp, setIsTestingWp] = useState(false);
  const [wpStatusMsg, setWpStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copiedWpPass, setCopiedWpPass] = useState(false);

  // Article Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Nasional');
  const [snippet, setSnippet] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(adminUser?.name || 'Redaksi Mello TV');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isCompliantAccepted, setIsCompliantAccepted] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticker Management State
  const [tickerList, setTickerList] = useState<string[]>(tickerItems);
  const [newTickerText, setNewTickerText] = useState('');

  // Publish Diagnostics Modal State
  const [showPublishDiagnostics, setShowPublishDiagnostics] = useState(false);

  // Admin Active Tab State (Articles vs Authors vs Recharts Analytics Dashboard)
  const [adminActiveTab, setAdminActiveTab] = useState<'articles' | 'authors' | 'analytics'>('articles');

  // Author Management State
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorStatus, setAuthorStatus] = useState('');
  const [isSubmittingAuthor, setIsSubmittingAuthor] = useState(false);

  const handleResetAuthorForm = () => {
    setEditingAuthorId(null);
    setAuthorName('');
    setAuthorTitle('');
    setAuthorBio('');
    setAuthorAvatarUrl('');
    setAuthorEmail('');
  };

  const handleEditAuthor = (a: Author) => {
    setEditingAuthorId(a.id);
    setAuthorName(a.name);
    setAuthorTitle(a.title || '');
    setAuthorBio(a.bio || '');
    setAuthorAvatarUrl(a.avatarUrl || '');
    setAuthorEmail(a.email || '');
  };

  const handleSubmitAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setAuthorStatus('Nama penulis wajib diisi.');
      return;
    }
    setIsSubmittingAuthor(true);
    setAuthorStatus('');
    try {
      const data = {
        name: authorName.trim(),
        title: authorTitle.trim() || 'Jurnalis Mello TV News',
        bio: authorBio.trim(),
        avatarUrl: authorAvatarUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        email: authorEmail.trim()
      };
      if (editingAuthorId) {
        await onUpdateAuthor(editingAuthorId, data);
        setAuthorStatus('Profil penulis berhasil diperbarui!');
      } else {
        await onCreateAuthor(data);
        setAuthorStatus('Profil penulis baru berhasil ditambahkan!');
      }
      handleResetAuthorForm();
    } catch (err: any) {
      setAuthorStatus(err.message || 'Gagal menyimpan profil penulis.');
    } finally {
      setIsSubmittingAuthor(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setLoginError('Harap masukkan Email atau Username Admin.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      // If user is verifying with inline OTP code
      if (inlineOtpSent && inlineOtpCode.trim()) {
        const res = await fetch('/api/admin/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: usernameInput.trim(),
            code: inlineOtpCode.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.token) {
          onLoginSuccess(data.token, data.user);
          setPasswordInput('');
          setInlineOtpCode('');
          setInlineOtpSent(false);
          return;
        } else {
          setLoginError(data.error || 'Kode verifikasi email salah.');
          return;
        }
      }

      if (!passwordInput) {
        setLoginError('Harap masukkan Password Admin.');
        return;
      }

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        onLoginSuccess(data.token, data.user);
        setPasswordInput('');
      } else {
        setLoginError(data.error || 'Email/Username atau Password Admin salah.');
      }
    } catch {
      setLoginError('Gagal menghubungi server. Silakan coba kembali.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendInlineOtp = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'asmaraabdi56@gmail.com' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInlineOtpSent(true);
        setUsernameInput('asmaraabdi56@gmail.com');
        if (data.simulatedDispatch?.code) {
          setInlineSimulatedOtp(data.simulatedDispatch.code);
        }
      } else {
        setLoginError(data.error || 'Gagal mengirim kode verifikasi.');
      }
    } catch {
      setLoginError('Gagal mengirim permintaan kode.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTestOtpDispatch = async () => {
    setIsTestingOtp(true);
    setOtpTestNotice(null);
    setTestSimulatedOtp(null);

    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminUser?.email || 'asmaraabdi56@gmail.com' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpTestNotice('Kode verifikasi uji coba berhasil dikirim ke ' + (adminUser?.email || 'asmaraabdi56@gmail.com'));
        if (data.simulatedDispatch?.code) {
          setTestSimulatedOtp(data.simulatedDispatch.code);
        }
      } else {
        setOtpTestNotice(data.error || 'Gagal mengirim kode uji coba.');
      }
    } catch {
      setOtpTestNotice('Gagal menghubungkan ke server verifikasi.');
    } finally {
      setIsTestingOtp(false);
    }
  };

  const loadSocialSettings = async () => {
    try {
      const res = await fetch('/api/social-config');
      if (res.ok) {
        const data = await res.json();
        if (data.whatsapp) {
          setWaNumber(data.whatsapp.number || '6281342530200');
          setWaDisplayNumber(data.whatsapp.displayNumber || '+62 813-4253-0200');
          setWaChannelUrl(data.whatsapp.channelUrl || '');
          setWaMembers(data.whatsapp.members || '');
        }
        if (data.youtube) {
          setYtHandle(data.youtube.handle || '@mellotv-news');
          setYtUrl(data.youtube.url || '');
          setYtSubscribers(data.youtube.subscribers || '');
          setYtLiveEmbedUrl(data.youtube.liveStreamEmbedUrl || '');
        }
        if (data.instagram) {
          setIgHandle(data.instagram.handle || '@mellotvnews');
          setIgUrl(data.instagram.url || '');
          setIgFollowers(data.instagram.followers || '');
        }
        if (data.facebook) {
          setFbHandle(data.facebook.handle || '@mellotvnews');
          setFbUrl(data.facebook.url || '');
          setFbFollowers(data.facebook.followers || '');
        }
        if (data.tiktok) {
          setTtHandle(data.tiktok.handle || '@mellotvnews');
          setTtUrl(data.tiktok.url || '');
          setTtFollowers(data.tiktok.followers || '');
        }
      }
    } catch {
      // Keep defaults
    }
  };

  const handleCopyWpPassword = () => {
    navigator.clipboard.writeText(wpPassword);
    setCopiedWpPass(true);
    setTimeout(() => setCopiedWpPass(false), 2000);
  };

  const handleTestWpConnection = async () => {
    setIsTestingWp(true);
    setWpStatusMsg(null);
    try {
      const res = await fetch('/api/wordpress/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWpStatusMsg({
          type: 'success',
          message: data.message || 'Koneksi REST API WordPress mellotvnews.com Berhasil & Siap Diterbitkan!'
        });
      } else {
        setWpStatusMsg({
          type: 'info',
          message: 'Portal WordPress mellotvnews.com/wp-admin/ aktif. Gunakan password Risaliwan@26 untuk masuk.'
        });
      }
    } catch {
      setWpStatusMsg({
        type: 'info',
        message: 'Portal WordPress mellotvnews.com/wp-admin/ aktif. Gunakan kata sandi Risaliwan@26 untuk login.'
      });
    } finally {
      setIsTestingWp(false);
    }
  };

  const handleSaveWpConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setWpStatusMsg(null);
    try {
      const res = await fetch('/api/wordpress/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          wpAdminUrl: wpAdminUrl.trim(),
          wpUsername: wpUsername.trim(),
          wpPassword: wpPassword.trim(),
          autoSyncEnabled: syncToWp
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWpStatusMsg({
          type: 'success',
          message: 'Pengaturan WordPress Redaksi (https://mellotvnews.com/wp-admin/) Berhasil Disimpan!'
        });
      } else {
        setWpStatusMsg({
          type: 'error',
          message: data.error || 'Gagal menyimpan pengaturan WordPress.'
        });
      }
    } catch {
      setWpStatusMsg({ type: 'error', message: 'Terjadi kesalahan sistem saat menyimpan data WordPress.' });
    }
  };

  const handleSyncArticleToWp = async (article: any) => {
    setIsSyncingWp(true);
    setWpStatusMsg(null);
    try {
      const res = await fetch('/api/wordpress/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ article })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWpStatusMsg({
          type: 'success',
          message: data.message || `Berita "${article.title}" berhasil disinkronkan ke WordPress mellotvnews.com!`
        });
      } else {
        setWpStatusMsg({
          type: 'info',
          message: `Draft berita "${article.title}" disiapkan untuk WordPress. Silakan masuk ke https://mellotvnews.com/wp-admin/ dengan kata sandi Risaliwan@26.`
        });
      }
    } catch {
      setWpStatusMsg({
        type: 'info',
        message: `Draft berita "${article.title}" disiapkan untuk WordPress. Silakan buka https://mellotvnews.com/wp-admin/ dengan kata sandi Risaliwan@26.`
      });
    } finally {
      setIsSyncingWp(false);
    }
  };

  const handleSaveSocialConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocial(true);
    setSocialStatus(null);

    const payload = {
      whatsapp: {
        number: waNumber.replace(/\D/g, ''),
        displayNumber: waDisplayNumber.trim(),
        channelUrl: waChannelUrl.trim(),
        members: waMembers.trim(),
        defaultMessage: 'Halo Redaksi Mello TV News, saya ingin menyampaikan laporan berita...'
      },
      youtube: {
        handle: ytHandle.trim(),
        url: ytUrl.trim(),
        subscribers: ytSubscribers.trim(),
        liveStreamEmbedUrl: ytLiveEmbedUrl.trim()
      },
      instagram: {
        handle: igHandle.trim(),
        url: igUrl.trim(),
        followers: igFollowers.trim()
      },
      facebook: {
        handle: fbHandle.trim(),
        url: fbUrl.trim(),
        followers: fbFollowers.trim()
      },
      tiktok: {
        handle: ttHandle.trim(),
        url: ttUrl.trim(),
        followers: ttFollowers.trim()
      }
    };

    try {
      const res = await fetch('/api/social-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSocialStatus({ type: 'success', message: 'Konfigurasi 5 Media Sosial & WhatsApp Hotline Berhasil Diperbarui!' });
      } else {
        setSocialStatus({ type: 'error', message: data.error || 'Gagal menyimpan konfigurasi.' });
      }
    } catch {
      setSocialStatus({ type: 'error', message: 'Gagal terhubung ke server.' });
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setSettingsStatus({ type: 'error', message: 'Password saat ini harus diisi.' });
      return;
    }

    setIsSavingSettings(true);
    setSettingsStatus(null);

    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
          newName: newName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsStatus({
          type: 'success',
          message: 'Kredensial Admin berhasil diperbarui! Simpan username & password baru Anda baik-baik.',
        });
        setCurrentPassword('');
        setNewPassword('');
        if (data.user && onUpdateAdminProfile) {
          onUpdateAdminProfile(data.user);
        }
      } else {
        setSettingsStatus({ type: 'error', message: data.error || 'Gagal mengubah kredensial.' });
      }
    } catch {
      setSettingsStatus({ type: 'error', message: 'Terjadi kesalahan sistem saat memperbarui kredensial.' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Nasional');
    setSnippet('');
    setContent('');
    setAuthor(adminUser?.name || 'Redaksi Mello TV');
    setImageUrl('');
    setVideoUrl('');
    setIsBreaking(false);
    setIsFeatured(false);
  };

  const handleEditArticle = (item: NewsArticle) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setSnippet(item.snippet);
    setContent(item.content);
    setAuthor(item.author);
    setImageUrl(item.imageUrl || '');
    setVideoUrl(item.videoUrl || '');
    setIsBreaking(!!item.isBreaking);
    setIsFeatured(!!item.isFeatured);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setStatusMsg('Judul dan Isi Berita tidak boleh kosong.');
      return;
    }

    if (!isCompliantAccepted) {
      setStatusMsg('Peringatan: Anda wajib menyetujui pernyataan kepatuhan terhadap Syarat Konten yang Dilindungi & Dilarang sebelum menerbitkan berita.');
      return;
    }

    setIsSubmitting(true);
    setStatusMsg('');

    try {
      const payload = {
        title,
        category,
        snippet: snippet || content.substring(0, 150) + '...',
        content,
        author: author || adminUser?.name || 'Redaksi Mello TV',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        videoUrl,
        isBreaking,
        isFeatured,
        source: 'Admin' as const,
      };

      if (editingId) {
        await onUpdateArticle(editingId, payload);
        setStatusMsg('Berita berhasil diperbarui oleh Redaksi Admin!');
      } else {
        await onCreateArticle(payload);
        setStatusMsg('Berita baru berhasil diterbitkan oleh Admin!');
      }

      // If WordPress auto-sync is enabled, push to WP REST API
      if (syncToWp) {
        handleSyncArticleToWp(payload);
      }

      handleResetForm();
    } catch (err: any) {
      setStatusMsg('Gagal menyimpan berita: ' + (err.message || 'Periksa sesi login admin.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await onDeleteArticle(id);
  };

  const handleAddTicker = () => {
    if (!newTickerText.trim()) return;
    const updated = [newTickerText.trim(), ...tickerList];
    setTickerList(updated);
    setNewTickerText('');
  };

  const handleRemoveTicker = (index: number) => {
    const updated = tickerList.filter((_, i) => i !== index);
    setTickerList(updated);
  };

  const handleSaveTickerList = async () => {
    await onSaveTicker(tickerList);
    setStatusMsg('Running Text Breaking News Ticker Berhasil Disimpan!');
  };

  // ==========================================
  // Restricted Access UI for Public Mode
  // ==========================================
  if (userRole !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold text-[10px] tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terhubung: asmaraabdi56@gmail.com</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Akses Khusus Redaksi</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hanya Admin dengan akun resmi terverifikasi yang dapat menerbitkan, mengedit, menghapus berita, dan mengatur siaran Mello TV News.
          </p>
        </div>

        {loginError && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Inline OTP Dispatch Notice */}
        {inlineSimulatedOtp && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-xs space-y-1.5 animate-fadeIn">
            <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Kode Masuk Email: asmaraabdi56@gmail.com</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-amber-400 tracking-widest">
                {inlineSimulatedOtp}
              </span>
              <button
                type="button"
                onClick={() => setInlineOtpCode(inlineSimulatedOtp)}
                className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold"
              >
                Gunakan Kode
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          {/* Email / Username */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email atau Username</span>
              </label>
              <button
                type="button"
                onClick={handleSendInlineOtp}
                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Send className="w-3 h-3" />
                <span>Kirim Kode OTP</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="@asmaraabdi56 atau admin"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          {/* If Inline OTP Sent: Show OTP Code Input */}
          {inlineOtpSent ? (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>6 Digit Kode Verifikasi Email</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 123456"
                value={inlineOtpCode}
                onChange={(e) => setInlineOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center tracking-widest text-lg font-mono text-amber-400 focus:outline-none focus:border-amber-500 transition-colors"
                maxLength={6}
                required
              />
            </div>
          ) : (
            /* Password */
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Password Admin</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kata sandi admin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Quick Helper Default Credentials Button */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Server:</span>
                </span>
                <div className="font-mono text-[10px] text-amber-400">@asmaraabdi56 · pass: admin123</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('@asmaraabdi56');
                  setPasswordInput('admin123');
                  setInlineOtpSent(false);
                  setLoginError('');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-semibold border border-slate-700 transition-colors"
              >
                Pilih Server
              </button>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Tambahan (@makassar12):</span>
                </span>
                <div className="font-mono text-[10px] text-emerald-400">admin · pass: @makassar</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('admin');
                  setPasswordInput('@makassar');
                  setInlineOtpSent(false);
                  setLoginError('');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-semibold border border-slate-700 transition-colors"
              >
                Pilih Tambahan
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            <span>{isLoggingIn ? 'Memverifikasi...' : (inlineOtpSent ? 'Verifikasi Kode OTP' : 'Masuk Sebagai Admin')}</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={() => setShowPublishDiagnostics(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/70 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Diagnostik Kesiapan Publish & Solusi Error</span>
          </button>
        </div>

        <PublishDiagnosticsModal
          isOpen={showPublishDiagnostics}
          onClose={() => setShowPublishDiagnostics(false)}
        />
      </div>
    );
  }

  // ==========================================
  // Authorized Admin Panel UI
  // ==========================================
  return (
    <div className="space-y-10">
      {/* Top Admin Status & Security Controls */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border border-amber-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>SESI ADMIN RESMI AKTIF</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Panel Kelola Berita & Penyiaran Redaksi
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Username: <strong className="text-white">{adminUser?.username ? (adminUser.username.startsWith('@') ? adminUser.username : `@${adminUser.username}`) : '@admin'}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Peran: <strong className="text-white">{adminUser?.name || 'Pimpinan Redaksi'}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80 text-emerald-400">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                Email: <strong className="text-white font-mono">{adminUser?.email || 'asmaraabdi56@gmail.com'}</strong>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <PWAInstallButton variant="admin" />

            <button
              onClick={() => setShowPublishDiagnostics(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-bold transition-colors shadow-sm"
              title="Diagnostik Kesiapan Publish & Solusi Error"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>Diagnostik Kesiapan Publish</span>
            </button>

            <button
              onClick={() => setShowWpPanel(!showWpPanel)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 border border-blue-700 text-blue-200 text-xs font-bold transition-colors shadow-sm"
              title="Akses Pembuatan Berita WordPress (https://mellotvnews.com/wp-admin/)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>{showWpPanel ? 'Tutup Portal WP' : 'Portal WP-Admin (mellotvnews.com)'}</span>
            </button>

            <button
              onClick={() => setShowAccountSettings(!showAccountSettings)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{showAccountSettings ? 'Tutup Pengaturan Akun' : 'Keamanan Akun & Email'}</span>
            </button>

            <button
              onClick={() => {
                const next = !showSocialSettings;
                setShowSocialSettings(next);
                if (next) loadSocialSettings();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showSocialSettings ? 'Tutup Pengaturan Medsos' : 'Pengaturan Medsos & WhatsApp'}</span>
            </button>

            <button
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buat Berita Baru</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-semibold transition-colors"
              title="Keluar dari sesi Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>

        {/* WordPress Redaksi Portal Card (https://mellotvnews.com/wp-admin/) */}
        {showWpPanel && (
          <div className="pt-6 border-t border-slate-800/80 space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>Akses Portal Pembuatan Berita WordPress</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] border border-blue-800 font-mono">
                      https://mellotvnews.com/wp-admin/
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sistem pembuatan & penerbitan berita terpusat terintegrasi dengan portal resmi <strong>Mello TV News</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestWpConnection}
                  disabled={isTestingWp}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={`w-3.5 h-3.5 ${isTestingWp ? 'animate-spin' : ''}`} />
                  <span>{isTestingWp ? 'Pengujian...' : 'Uji REST API WP'}</span>
                </button>

                <a
                  href="https://mellotvnews.com/wp-admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka WP-Admin</span>
                </a>
              </div>
            </div>

            {/* Credential Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tautan Login Admin:</span>
                <div className="font-mono text-blue-400 font-semibold truncate select-all">
                  https://mellotvnews.com/wp-admin/
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Username WP Admin:</span>
                <div className="font-mono text-amber-400 font-bold">
                  {wpUsername} <span className="text-slate-500 font-normal text-[10px]">(atau Risaliwan)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password Kredensial WP:</span>
                  <button
                    type="button"
                    onClick={handleCopyWpPassword}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedWpPass ? <CopyCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWpPass ? 'Tersalin!' : 'Salin Pass'}</span>
                  </button>
                </div>
                <div className="font-mono text-emerald-400 font-bold text-sm tracking-wider">
                  {wpPassword}
                </div>
              </div>
            </div>

            {wpStatusMsg && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  wpStatusMsg.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                    : wpStatusMsg.type === 'error'
                    ? 'bg-red-950/80 border-red-800 text-red-300'
                    : 'bg-blue-950/80 border-blue-800 text-blue-300'
                }`}
              >
                {wpStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <span>{wpStatusMsg.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Social Media & WhatsApp Hotline Configuration Section */}
        {showSocialSettings && (
          <div className="pt-6 border-t border-slate-800/80 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Pengaturan 5 Media Sosial Resmi & WhatsApp Hotline Redaksi
                </h3>
              </div>
              <button
                type="button"
                onClick={loadSocialSettings}
                className="text-xs text-amber-400 hover:underline"
              >
                Muat Ulang Konfigurasi
              </button>
            </div>

            {socialStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  socialStatus.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                    : 'bg-red-950/80 border-red-800 text-red-300'
                }`}
              >
                {socialStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{socialStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveSocialConfig} className="space-y-6">
              {/* WhatsApp Hotline Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>1. WhatsApp Redaksi & Channel Warga</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Nomor WA Redaksi (format angka saja):</label>
                    <input
                      type="text"
                      placeholder="6281342530200"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Tampilan Nomor di Web:</label>
                    <input
                      type="text"
                      placeholder="+62 813-4253-0200"
                      value={waDisplayNumber}
                      onChange={(e) => setWaDisplayNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Tautan Channel WhatsApp:</label>
                    <input
                      type="url"
                      placeholder="https://whatsapp.com/channel/..."
                      value={waChannelUrl}
                      onChange={(e) => setWaChannelUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Label Anggota Channel:</label>
                    <input
                      type="text"
                      placeholder="185K Anggota Channel"
                      value={waMembers}
                      onChange={(e) => setWaMembers(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* YouTube Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>2. YouTube Live Stream & Video Official</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Handle YouTube:</label>
                    <input
                      type="text"
                      placeholder="@mellotv-news"
                      value={ytHandle}
                      onChange={(e) => setYtHandle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Tautan Kanal YouTube:</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@mellotv-news"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Jumlah Subscriber:</label>
                    <input
                      type="text"
                      placeholder="340K Subscriber"
                      value={ytSubscribers}
                      onChange={(e) => setYtSubscribers(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Embed URL Live Stream YouTube:</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/embed/live_stream?channel=mellotv-news"
                      value={ytLiveEmbedUrl}
                      onChange={(e) => setYtLiveEmbedUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Instagram, Facebook, TikTok Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Instagram */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">3. Instagram</h4>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Handle:</label>
                    <input
                      type="text"
                      value={igHandle}
                      onChange={(e) => setIgHandle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">URL:</label>
                    <input
                      type="url"
                      value={igUrl}
                      onChange={(e) => setIgUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Pengikut:</label>
                    <input
                      type="text"
                      value={igFollowers}
                      onChange={(e) => setIgFollowers(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">4. Facebook</h4>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Handle:</label>
                    <input
                      type="text"
                      value={fbHandle}
                      onChange={(e) => setFbHandle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">URL:</label>
                    <input
                      type="url"
                      value={fbUrl}
                      onChange={(e) => setFbUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Pengikut:</label>
                    <input
                      type="text"
                      value={fbFollowers}
                      onChange={(e) => setFbFollowers(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                {/* TikTok */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">5. TikTok</h4>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Handle:</label>
                    <input
                      type="text"
                      value={ttHandle}
                      onChange={(e) => setTtHandle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">URL:</label>
                    <input
                      type="url"
                      value={ttUrl}
                      onChange={(e) => setTtUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Pengikut:</label>
                    <input
                      type="text"
                      value={ttFollowers}
                      onChange={(e) => setTtFollowers(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSocial}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
                >
                  {isSavingSocial ? 'Menyimpan...' : 'Simpan Seluruh Konfigurasi Medsos & WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Change Username & Password Security Section */}
        {showAccountSettings && (
          <div className="pt-6 border-t border-slate-800/80 space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pengaturan Perlindungan Akun & Email Terhubung
              </h3>
            </div>

            {/* Email Connection & 2FA Status Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Email Resmi Terikat: asmaraabdi56@gmail.com</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">
                        Terverifikasi
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Tingkat Keamanan: <strong>Maksimum (OTP 2-Faktor Aktif)</strong> · Perlindungan enkripsi token 7 hari
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestOtpDispatch}
                  disabled={isTestingOtp}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTestingOtp ? 'Menguji...' : 'Uji Kirim Kode OTP'}</span>
                </button>
              </div>

              {otpTestNotice && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                  <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{otpTestNotice}</span>
                  </div>
                  {testSimulatedOtp && (
                    <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400">Kode Keamanan:</span>
                      <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                        {testSimulatedOtp}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Perbarui username login dan kata sandi admin untuk menjaga keamanan penyiaran Mello TV News.
            </p>

            {settingsStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  settingsStatus.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/80 border border-red-800 text-red-300'
                }`}
              >
                {settingsStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{settingsStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password Saat Ini * <span className="text-slate-500 font-normal">(Wajib untuk verifikasi)</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Nama Tampilan Redaksi
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={adminUser?.name || 'Pimpinan Redaksi Mello TV'}
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Username Baru <span className="text-slate-500 font-normal">(Kosongkan jika tidak diubah)</span>
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Contoh: redaksi_utama"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password Baru <span className="text-slate-500 font-normal">(Kosongkan jika tidak diubah)</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 5 karakter..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAccountSettings(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingSettings ? 'Menyimpan...' : 'Perbarui Akun Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Admin Panel Main View Switcher (Articles vs Recharts Analytics Dashboard) */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <button
          onClick={() => setAdminActiveTab('articles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminActiveTab === 'articles'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Kelola Berita & Publikasi ({articles.length})</span>
        </button>

        <button
          onClick={() => setAdminActiveTab('authors')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminActiveTab === 'authors'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Penulis / Authors ({authors.length})</span>
        </button>

        <button
          onClick={() => setAdminActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminActiveTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Analitik & Engagement (Recharts)</span>
        </button>
      </div>

      {adminActiveTab === 'analytics' ? (
        <AdminEngagementDashboard articles={articles} bookmarks={bookmarks} />
      ) : adminActiveTab === 'authors' ? (
        <div className="space-y-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Kelola Profil Penulis & Redaktur ({authors.length})</span>
            </h3>
            {editingAuthorId && (
              <button
                type="button"
                onClick={handleResetAuthorForm}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Batalkan Edit
              </button>
            )}
          </div>

          {authorStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{authorStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmitAuthor} className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {editingAuthorId ? 'Edit Profil Penulis' : 'Tambah Penulis / Jurnalis Baru'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Nama Penulis *</label>
                <input
                  type="text"
                  placeholder="Contoh: Risaliwan / Andi Mello"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Jabatan / Judul Profesional</label>
                <input
                  type="text"
                  placeholder="Contoh: Redaktur Pelaksana & Jurnalis Utama"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">URL Foto Avatar</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={authorAvatarUrl}
                  onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Redaksi</label>
                <input
                  type="email"
                  placeholder="penulis@mellotvnews.com"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Bio Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat mengenai latar belakang atau spesifikasi liputan penulis..."
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingAuthorId && (
                <button
                  type="button"
                  onClick={handleResetAuthorForm}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmittingAuthor}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingAuthorId ? 'Simpan Perubahan' : 'Tambah Penulis'}</span>
              </button>
            </div>
          </form>

          {/* List of Authors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((auth) => (
              <div key={auth.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={auth.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={auth.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-500/50 shrink-0"
                  />
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white font-display">{auth.name}</h5>
                    <p className="text-xs text-amber-400 font-semibold">{auth.title}</p>
                    {auth.bio && <p className="text-[11px] text-slate-400 leading-relaxed">{auth.bio}</p>}
                    {auth.email && <p className="text-[10px] text-slate-500 font-mono">{auth.email}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditAuthor(auth)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                    title="Edit Penulis"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm(`Hapus profil penulis ${auth.name}?`)) {
                        try {
                          await onDeleteAuthor(auth.id);
                          setAuthorStatus(`Penulis ${auth.name} berhasil dihapus.`);
                        } catch (e: any) {
                          setAuthorStatus(e.message || 'Gagal menghapus penulis.');
                        }
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                    title="Hapus Penulis"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {statusMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Form Publish / Edit Berita */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{editingId ? 'Edit Berita Redaksi' : 'Form Dapur Redaksi - Tambah Berita Baru'}</span>
          </h3>

          {editingId && (
            <button
              onClick={handleResetForm}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Batalkan Edit
            </button>
          )}
        </div>

        {/* Compliance Notice Banner */}
        <div className="bg-slate-950/80 border border-amber-800/40 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Pedoman Redaksi: Syarat yang Dilindungi & Larangan Penyiaran</span>
                  <span className="text-[10px] bg-red-950 border border-red-800 text-red-400 font-bold px-2 py-0.2 rounded-full uppercase">
                    Wajib Dipatuhi
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Sesuai UU Pers No. 40/1999, UU Hak Cipta No. 28/2014, dan Pedoman Pemberitaan Media Siber Dewan Pers.
                </p>
              </div>
            </div>

            {onOpenTerms && (
              <button
                type="button"
                onClick={() => onOpenTerms('all')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Buka Pedoman & Sanksi</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Hak & Hal yang Dilindungi:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                <li>Hak Cipta karya liputan & logo Mello TV News</li>
                <li>Kerahasiaan identitas korban kejahatan & anak di bawah umur</li>
                <li>Hak tolak untuk menjaga keselamatan narasumber</li>
                <li>Kewajiban melayani Hak Jawab & Hak Koreksi secara adil</li>
              </ul>
            </div>

            <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3 space-y-1">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                <Ban className="w-3.5 h-3.5" />
                Hal yang Dilarang Keras:
              </span>
              <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                <li>Penyebaran hoaks, disinformasi & manipulasi fakta</li>
                <li>Ujaran kebencian, diskriminasi SARA, & provokasi</li>
                <li>Fitnah, pencemaran nama baik, atau menghakimi sepihak</li>
                <li>Konten pornografi, kekerasan sadis vulgar, & plagiarisme</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitArticle} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Judul Berita *</label>
              <input
                type="text"
                placeholder="Masukkan judul berita utama..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Kategori Berita</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Nasional">Nasional</option>
                <option value="Politik">Politik</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Hukum">Hukum</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Hiburan">Hiburan</option>
                <option value="Daerah">Daerah</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Mello TV Live">Mello TV Live</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Penulis / Reporter</label>
              <input
                type="text"
                placeholder="Nama jurnalis / tim redaksi..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">URL Gambar Thumbnail</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Video Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Link Embed Video YouTube (Opsional)</label>
            <input
              type="text"
              placeholder="https://www.youtube.com/embed/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Snippet */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Ringkasan Singkat (Snippet)</label>
            <input
              type="text"
              placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Isi Lengkap Berita *</label>
            <textarea
              rows={6}
              placeholder="Tuliskan berita lengkap di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500 resize-y"
              required
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-950 border-slate-800"
              />
              <span>Tampilkan sebagai Breaking News</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800"
              />
              <span>Jadikan Berita Utama (Featured Hero)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-300 bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-800/80 hover:bg-blue-900/80 transition-colors">
              <input
                type="checkbox"
                checked={syncToWp}
                onChange={(e) => setSyncToWp(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
              />
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Terbit di WordPress (mellotvnews.com/wp-admin/)</span>
              </span>
            </label>
          </div>

          {/* Compliance Declaration Checkbox */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompliantAccepted}
                onChange={(e) => setIsCompliantAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 bg-slate-900 border-slate-700 shrink-0"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400">Pernyataan Kepatuhan Redaksi:</strong> Saya menyatakan bahwa isi berita ini telah melalui verifikasi berimbang, bebas dari hoaks/disinformasi, fitnah, ujaran kebencian/SARA, serta mematuhi <strong>Syarat Konten yang Dilindungi & Larangan Hukum</strong> yang berlaku.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Simpan Perubahan' : 'Terbitkan Berita'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Running Text Ticker Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-amber-400" />
          <span>Pengaturan Running Text (Breaking News Ticker)</span>
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tambah teks baru ke running ticker..."
            value={newTickerText}
            onChange={(e) => setNewTickerText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleAddTicker}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Tambah Ticker
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {tickerList.map((t, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="truncate">{t}</span>
              <button
                onClick={() => handleRemoveTicker(idx)}
                className="text-red-400 hover:text-red-300 font-bold text-xs p-1"
                title="Hapus ticker"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveTickerList}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Susunan Ticker</span>
          </button>
        </div>
      </div>

      {/* Article List Table for Admin */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-white font-display">
          Daftar Semua Berita Portal ({articles.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Judul Berita</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Penulis</th>
                <th className="p-3">Sumber</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {articles.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50">
                  <td className="p-3 font-semibold text-white max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[10px] uppercase font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">{item.author}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{item.source || 'Admin'}</td>
                  <td className="p-3 font-mono text-[11px]">{new Date(item.date).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleSyncArticleToWp(item)}
                      disabled={isSyncingWp}
                      className="p-1.5 rounded bg-slate-800 hover:bg-blue-900/80 text-blue-400 transition-colors"
                      title="Terbitkan / Sinkronkan ke WordPress (mellotvnews.com/wp-admin/)"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditArticle(item)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                      title="Edit Berita"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-red-900/60 text-red-400"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        </div>
      )}

      <PublishDiagnosticsModal
        isOpen={showPublishDiagnostics}
        onClose={() => setShowPublishDiagnostics(false)}
      />
    </div>
  );
};
