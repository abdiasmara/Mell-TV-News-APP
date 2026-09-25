import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { WelcomeSplash } from './components/WelcomeSplash';
import { WebsiteView } from './components/WebsiteView';
import { SocialHub } from './components/SocialHub';
import { NewsFeed } from './components/NewsFeed';
import { ReadLaterView } from './components/ReadLaterView';
import { ArticleModal } from './components/ArticleModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { TermsAndProhibitionsModal } from './components/TermsAndProhibitionsModal';
import { FloatingSocialWidget } from './components/FloatingSocialWidget';
import { PWAInstallButton } from './components/PWAInstallButton';
import { NewsArticle, AppTab, UserRole, AdminUser, SocialMediaConfig, Author } from './types';
import { MelloLogo } from './components/MelloLogo';
import { Shield, Sparkles, Tv, Globe, Share2, Newspaper, Heart, Radio, ExternalLink, Scale, FileText, Bell, X } from 'lucide-react';
import { PushNotificationService } from './firebase';
import { ShareAppModal } from './components/ShareAppModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mello_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('mello_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isLight = theme === 'light';

  const [adminToken, setAdminToken] = useState<string>(() => {
    return localStorage.getItem('mello_admin_token') || '';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('mello_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showShareAppModal, setShowShareAppModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [termsInitialTab, setTermsInitialTab] = useState<'all' | 'protected' | 'prohibited' | 'ethics' | 'comments'>('all');
  const [latestBreakingNotification, setLatestBreakingNotification] = useState<NewsArticle | null>(null);

  const handleOpenTerms = (tab: 'all' | 'protected' | 'prohibited' | 'ethics' | 'comments' = 'all') => {
    setTermsInitialTab(tab);
    setShowTermsModal(true);
  };

  // Articles, Social Config & Ticker Data
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [socialConfig, setSocialConfig] = useState<SocialMediaConfig | undefined>(undefined);
  const [tickerItems, setTickerItems] = useState<string[]>([
    'SELAMAT DATANG SAHABAT MELLO TV NEWS - PORTAL MEDIA TERPERCAYA',
    'Ikuti Akun Resmi Kami di Facebook @mellotvnews, Instagram @mellotvnews, TikTok @mellotvnews & YouTube @mellotv-news',
  ]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mello_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mello_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleToggleBookmark = (articleOrId: NewsArticle | string) => {
    const id = typeof articleOrId === 'string' ? articleOrId : articleOrId.id;
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveBookmark = (articleId: string) => {
    setBookmarks((prev) => prev.filter((id) => id !== articleId));
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
  };

  // Verify Admin Session on load
  useEffect(() => {
    const verifySession = async () => {
      if (!adminToken) return;
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.valid && data.user) {
            setUserRole('admin');
            setAdminUser(data.user);
            localStorage.setItem('mello_admin_user', JSON.stringify(data.user));
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch {
        // Offline or transient error - keep local state if valid
      }
    };

    verifySession();
  }, [adminToken]);

  // Fetch initial articles & tickers & authors & initialize FCM Push Notifications
  const fetchAllData = async () => {
    try {
      // 1. Fetch custom/admin news from backend API
      const newsRes = await fetch('/api/news');
      let customNews: NewsArticle[] = [];
      if (newsRes.ok) {
        customNews = await newsRes.json();
      }

      // 2. Fetch live website news from mellotvnews.com API endpoint
      const webRes = await fetch('/api/website-news');
      let webNews: NewsArticle[] = [];
      if (webRes.ok) {
        webNews = await webRes.json();
      }

      // Combine articles with Admin articles first
      const combined = [...customNews, ...webNews];
      setArticles(combined);

      // 3. Fetch authors
      const authorsRes = await fetch('/api/authors');
      if (authorsRes.ok) {
        const auths = await authorsRes.json();
        setAuthors(auths);
      }

      // 4. Fetch running tickers
      const tickerRes = await fetch('/api/ticker');
      if (tickerRes.ok) {
        const tickers = await tickerRes.json();
        setTickerItems(tickers);
      }

      // 5. Fetch social media configuration
      const socialRes = await fetch('/api/social-config');
      if (socialRes.ok) {
        const sc = await socialRes.json();
        setSocialConfig(sc);
      }
    } catch (err) {
      console.log('Error fetching portal data:', err);
    }
  };

  const handleCreateAuthor = async (authorData: Partial<Author>) => {
    const res = await fetch('/api/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(authorData),
    });
    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }
    if (res.ok) {
      await fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal membuat profil penulis.');
    }
  };

  const handleUpdateAuthor = async (id: string, authorData: Partial<Author>) => {
    const res = await fetch(`/api/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(authorData),
    });
    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }
    if (res.ok) {
      await fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memperbarui profil penulis.');
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    const res = await fetch(`/api/authors/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }
    if (res.ok) {
      await fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menghapus penulis.');
    }
  };

  useEffect(() => {
    fetchAllData();
    // Initialize Push Notification service & subscribe to breaking news alerts
    PushNotificationService.init();
    const unsubscribe = PushNotificationService.subscribeToBreakingNews((article) => {
      setLatestBreakingNotification(article);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);



  // Admin Login and Logout Handlers
  const handleLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    setUserRole('admin');
    localStorage.setItem('mello_admin_token', token);
    localStorage.setItem('mello_admin_user', JSON.stringify(user));
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch {
        // proceed
      }
    }
    setAdminToken('');
    setAdminUser(null);
    setUserRole('public');
    localStorage.removeItem('mello_admin_token');
    localStorage.removeItem('mello_admin_user');
  };

  const handleUpdateAdminProfile = (updatedUser: AdminUser) => {
    setAdminUser(updatedUser);
    localStorage.setItem('mello_admin_user', JSON.stringify(updatedUser));
  };

  // Protected Admin News Actions
  const handleCreateArticle = async (articleData: Partial<NewsArticle>) => {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(articleData),
    });

    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }

    if (res.ok) {
      await fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal membuat berita.');
    }
  };

  const handleUpdateArticle = async (id: string, updatedData: Partial<NewsArticle>) => {
    const res = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }

    if (res.ok) {
      await fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memperbarui berita.');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const res = await fetch(`/api/news/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }

    if (res.ok) {
      await fetchAllData();
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menghapus berita.');
    }
  };

  const handleSaveTicker = async (newTickers: string[]) => {
    const res = await fetch('/api/ticker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ tickerList: newTickers }),
    });

    if (res.status === 401) {
      handleLogout();
      setShowLoginModal(true);
      return;
    }

    if (res.ok) {
      setTickerItems(newTickers);
    } else {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menyimpan running text.');
    }
  };

  const handleToggleRoleClick = () => {
    if (userRole === 'admin') {
      handleLogout();
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col font-sans selection:bg-red-600 selection:text-white`}>
      {/* Welcome Splash Overlay */}
      {showWelcome && (
        <WelcomeSplash
          onEnter={(targetTab) => {
            setShowWelcome(false);
            if (targetTab) setActiveTab(targetTab);
          }}
          onOpenSocials={() => {
            setShowWelcome(false);
            setActiveTab('social');
          }}
          onOpenTerms={() => {
            handleOpenTerms('all');
          }}
        />
      )}

      {/* Header Contract & Clock */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        adminUser={adminUser}
        onToggleRoleClick={handleToggleRoleClick}
        onOpenWelcome={() => setShowWelcome(true)}
        onOpenTerms={handleOpenTerms}
        theme={theme}
        onToggleTheme={toggleTheme}
        bookmarkCount={bookmarks.length}
        onOpenShareApp={() => setShowShareAppModal(true)}
      />

      {/* Breaking News Marquee */}
      <BreakingNewsTicker tickerItems={tickerItems} />

      {/* Breaking News Push Notification Toast Alert */}
      {latestBreakingNotification && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-xl border-b border-red-700 animate-slide-down relative z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-white/20 animate-pulse">
                <Bell className="w-4 h-4 text-white" />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-800 px-2 py-0.5 rounded text-white mr-2">
                  BREAKING NEWS ALERT
                </span>
                <strong className="text-xs sm:text-sm font-bold font-display">{latestBreakingNotification.title}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedArticle(latestBreakingNotification);
                  setLatestBreakingNotification(null);
                }}
                className="px-3 py-1 rounded bg-white text-red-700 font-bold text-xs hover:bg-slate-100 transition-colors shadow"
              >
                Baca
              </button>
              <button
                onClick={() => setLatestBreakingNotification(null)}
                className="p-1 rounded hover:bg-red-700 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Tab 1: Portal Utama (Home View) */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Quick Greeting Banner */}
            <div className={`relative overflow-hidden border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-6 ${isLight ? 'bg-gradient-to-r from-red-100 via-white to-white border-slate-200 text-slate-900' : 'bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-slate-800 text-white'}`}>
              <div className="flex items-center gap-5">
                <MelloLogo size="lg" />
                <div className="space-y-1">
                  <span className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    PORTAL MEDIA TERPERCAYA
                  </span>
                  <h1 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    SELAMAT DATANG SAHABAT MELLO TV NEWS
                  </h1>
                  <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Akses sajian berita terbaru, siaran langsung Mello TV, dan hubungkan pengalaman Anda langsung dengan website resmi{' '}
                    <strong className="text-blue-500 font-semibold">mellotvnews.com</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('social')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Feed Media Sosial</span>
                </button>

                <button
                  onClick={() => setActiveTab('website')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Lihat mellotvnews.com</span>
                </button>
              </div>
            </div>

            {/* PWA App Installation Banner for Android & Windows */}
            <PWAInstallButton variant="banner" />

            {/* News Feed Grid */}
            <NewsFeed
              articles={articles}
              onSelectArticle={(article) => setSelectedArticle(article)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onOpenWebsiteTab={() => setActiveTab('website')}
              theme={theme}
            />
          </div>
        )}

        {/* Tab 2: Embedded Website View */}
        {activeTab === 'website' && <WebsiteView />}

        {/* Tab 3: Berita Terkini & Video Feed */}
        {activeTab === 'news' && (
          <NewsFeed
            articles={articles}
            onSelectArticle={(article) => setSelectedArticle(article)}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenWebsiteTab={() => setActiveTab('website')}
            theme={theme}
          />
        )}

        {/* Tab 4: Social Media Hub */}
        {activeTab === 'social' && <SocialHub socialConfig={socialConfig} />}

        {/* Tab 5: Read-Later Queue */}
        {activeTab === 'read-later' && (
          <ReadLaterView
            bookmarks={bookmarks}
            articles={articles}
            onSelectArticle={(article) => setSelectedArticle(article)}
            onRemoveBookmark={handleRemoveBookmark}
            onClearBookmarks={handleClearBookmarks}
            isLight={isLight}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Tab 5: Admin Panel */}
        {activeTab === 'admin' && (
          <AdminPanel
            userRole={userRole}
            adminUser={adminUser}
            adminToken={adminToken}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onUpdateAdminProfile={handleUpdateAdminProfile}
            onOpenTerms={handleOpenTerms}
            articles={articles}
            onCreateArticle={handleCreateArticle}
            onUpdateArticle={handleUpdateArticle}
            onDeleteArticle={handleDeleteArticle}
            tickerItems={tickerItems}
            onSaveTicker={handleSaveTicker}
            bookmarks={bookmarks}
            authors={authors}
            onCreateAuthor={handleCreateAuthor}
            onUpdateAuthor={handleUpdateAuthor}
            onDeleteAuthor={handleDeleteAuthor}
          />
        )}
      </main>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isBookmarked={bookmarks.includes(selectedArticle.id)}
          onToggleBookmark={handleToggleBookmark}
          onOpenTerms={handleOpenTerms}
          authors={authors}
        />
      )}

      {/* Dedicated Admin Login Modal with Username & Password */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Comprehensive Terms & Prohibitions Modal */}
      <TermsAndProhibitionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        initialTab={termsInitialTab}
      />

      {/* Share App & Main Menu Modal */}
      <ShareAppModal
        isOpen={showShareAppModal}
        onClose={() => setShowShareAppModal(false)}
      />

      {/* Floating WhatsApp & Social Launcher Widget */}
      <FloatingSocialWidget socialConfig={socialConfig} />

      {/* Floating PWA Install Launcher */}
      <PWAInstallButton variant="floating" />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <MelloLogo size="sm" />
              <div>
                <span className="font-display font-extrabold text-white text-base">MELLO TV NEWS</span>
                <p className="text-[11px] text-slate-500">Portal Media Terpercaya · mellotvnews.com</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <a href="https://facebook.com/mellotvnews" target="_blank" rel="noreferrer" className="hover:text-amber-400">Facebook @mellotvnews</a>
              <span>·</span>
              <a href="https://instagram.com/mellotvnews" target="_blank" rel="noreferrer" className="hover:text-amber-400">Instagram @mellotvnews</a>
              <span>·</span>
              <a href="https://tiktok.com/@mellotvnews" target="_blank" rel="noreferrer" className="hover:text-amber-400">TikTok @mellotvnews</a>
              <span>·</span>
              <a href="https://youtube.com/@mellotv-news" target="_blank" rel="noreferrer" className="hover:text-amber-400">YouTube @mellotv-news</a>
            </div>
          </div>

          {/* Quick Legal and Prohibitions Navigation Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-200">
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-xs text-white">Ketentuan Hukum & Pedoman Penyiaran:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => handleOpenTerms('protected')}
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-medium"
              >
                <span>🛡️ Hak yang Dilindungi</span>
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={() => handleOpenTerms('prohibited')}
                className="text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 font-medium"
              >
                <span>🚫 Larangan Konten & Hoaks</span>
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={() => handleOpenTerms('ethics')}
                className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-medium"
              >
                <span>📋 Kode Etik Jurnalistik</span>
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={() => handleOpenTerms('comments')}
                className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-medium"
              >
                <span>💬 Tata Tertib Komentar</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Mello TV News. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleOpenTerms('all')}
                className="text-amber-400 hover:underline font-semibold"
              >
                Syarat & Ketentuan Lengkap
              </button>
              <span>·</span>
              <p className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Sistem Perlindungan Akun Redaksi & Penyiaran</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
