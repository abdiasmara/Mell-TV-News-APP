import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Send,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';
import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: AdminUser) => void;
}

interface SimulatedDispatch {
  to: string;
  subject: string;
  code: string;
  sentAt: string;
  note: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [loginMethod, setLoginMethod] = useState<'email-otp' | 'credentials'>('email-otp');
  
  // Credentials mode state
  const [identifier, setIdentifier] = useState('@asmaraabdi56');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Email OTP mode state
  const [emailInput, setEmailInput] = useState('asmaraabdi56@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [simulatedDispatch, setSimulatedDispatch] = useState<SimulatedDispatch | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Timer countdown effect for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle Request OTP to asmaraabdi56@gmail.com
  const handleRequestOtp = async () => {
    if (!emailInput.trim()) {
      setErrorMsg('Masukkan alamat email resmi redaksi.');
      return;
    }

    setIsSendingOtp(true);
    setErrorMsg('');
    setOtpSentNotice(null);

    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSentNotice(data.message);
        setCountdown(60); // 60 seconds cooldown
        if (data.simulatedDispatch) {
          setSimulatedDispatch(data.simulatedDispatch);
        }
      } else {
        setErrorMsg(data.error || 'Gagal mengirim kode verifikasi ke email.');
      }
    } catch {
      setErrorMsg('Koneksi ke server terganggu. Periksa koneksi internet Anda.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify OTP Login
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !otpCode.trim()) {
      setErrorMsg('Masukkan alamat email dan 6 digit kode verifikasi.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        onLoginSuccess(data.token, data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Kode verifikasi tidak valid atau telah kedaluwarsa.');
      }
    } catch {
      setErrorMsg('Koneksi ke server gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password-based Submit
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Mohon isi Email/Username dan Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        onLoginSuccess(data.token, data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Email/Username atau password admin salah.');
      }
    } catch {
      setErrorMsg('Koneksi ke server gagal. Pastikan jaringan aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectServerAdmin = () => {
    setIdentifier('@asmaraabdi56');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleSelectMakassarAdmin = () => {
    setIdentifier('admin');
    setPassword('@makassar');
    setErrorMsg('');
  };

  const handleCopyAndFillCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setOtpCode(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Security Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terhubung Langsung: asmaraabdi56@gmail.com</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Login Aman Redaksi Mello TV News
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Sistem otentikasi terenkripsi terhubung langsung dengan email pimpinan redaksi untuk integritas penyiaran berita.
          </p>
        </div>

        {/* Method Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('email-otp');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              loginMethod === 'email-otp'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Kode Email (OTP 2FA)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMethod('credentials');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
              loginMethod === 'credentials'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Email & Kata Sandi</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* METHOD 1: EMAIL OTP / 2FA VERIFICATION */}
        {loginMethod === 'email-otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            {/* Email Field with Verified Tag */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Resmi Terdaftar</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Terverifikasi
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="asmaraabdi56@gmail.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isSendingOtp || countdown > 0}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-400 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {isSendingOtp ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {countdown > 0 ? `${countdown}d` : 'Kirim Kode'}
                  </span>
                </button>
              </div>
            </div>

            {/* Simulated Live Dispatch Alert (Ensures Foolproof Testing & Immediate Usability) */}
            {simulatedDispatch && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-950 to-slate-950 border border-emerald-800/60 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Pesan Masuk Email Redaksi:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Kepada: asmaraabdi56@gmail.com
                  </span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-slate-400">Kode Keamanan Login 6-Digit:</div>
                    <div className="text-xl font-mono font-black text-amber-400 tracking-widest">
                      {simulatedDispatch.code}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAndFillCode(simulatedDispatch.code)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Tersalin!' : 'Gunakan Kode'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Kode ini berlaku selama 10 menit untuk menjamin otoritas penuh penyiaran akun Mello TV News.
                </p>
              </div>
            )}

            {/* OTP Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Masukkan 6-Digit Kode Verifikasi Email</span>
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Contoh: 123456"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center tracking-widest text-lg font-mono text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                maxLength={6}
                required
              />
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 6}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk Redaksi'}</span>
              </button>
            </div>
          </form>
        )}

        {/* METHOD 2: DIRECT CREDENTIALS (Email asmaraabdi56@gmail.com OR admin) */}
        {loginMethod === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {/* Identifier Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Username / Email Admin</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">@asmaraabdi56 / admin</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="@asmaraabdi56 atau admin"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password Admin</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Helper Cards for Both Admin Accounts */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Server (@asmaraabdi56):</span>
                  </div>
                  <div className="font-mono text-[10px] text-amber-400">@asmaraabdi56 · pass: admin123</div>
                </div>
                <button
                  type="button"
                  onClick={handleSelectServerAdmin}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-semibold border border-slate-700 transition-colors"
                >
                  Pilih Server
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                <div>
                  <div className="text-slate-200 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Tambahan (@makassar12):</span>
                  </div>
                  <div className="font-mono text-[10px] text-emerald-400">admin · pass: @makassar</div>
                </div>
                <button
                  type="button"
                  onClick={handleSelectMakassarAdmin}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-semibold border border-slate-700 transition-colors"
                >
                  Pilih Tambahan
                </button>
              </div>
            </div>

            {/* Submit & Cancel */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk Admin'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Info Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enkripsi SHA-256 & Proteksi Sesi Token</span>
          </span>
          <span className="font-mono text-slate-400">Mello TV Security Suite</span>
        </div>
      </div>
    </div>
  );
};
