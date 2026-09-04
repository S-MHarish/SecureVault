'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

export default function LoginPage() {
  const router = useRouter();
  const { unlockVault } = useVault();

  const [email, setEmail] = useState('alex.vanguard@gmail.com');
  const [password, setPassword] = useState('SecureMasterPassword2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your Master Password');
      return;
    }
    setIsLoading(true);
    setError('');

    const success = await unlockVault(password);
    setIsLoading(false);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid master password. Please verify and retry.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT COLUMN: Large Branding & Hero Pitch */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-vault-blush border border-vault-copper/30 shadow-vault-sm">
            <ShieldCheck className="w-5 h-5 text-vault-maroon" />
            <span className="text-xs font-bold uppercase tracking-wider text-vault-maroon">
              Zero-Knowledge Identity Vault
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold font-display text-vault-maroon tracking-tight leading-[1.15]">
            Your Digital Life, <br />
            <span className="bg-gradient-to-r from-vault-maroon via-vault-roseMuted to-vault-copper bg-clip-text text-transparent">
              Secured.
            </span>
          </h1>

          <p className="text-sm md:text-base text-vault-roseDust max-w-md leading-relaxed">
            Securely organize every account, credential, recovery method, and security status in one intelligent vault.
          </p>

          <div className="space-y-3 pt-2 text-xs text-vault-maroon/90">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-vault-copper" />
              <span>AES-256-GCM client-side authenticated encryption</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-vault-copper" />
              <span>PBKDF2 master key derivation with zero server knowledge</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-vault-copper" />
              <span>AI Security scoring & identity exposure monitor</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Glass Authentication Card */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-lg relative overflow-hidden">
          {/* Subtle Glow Accents */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-vault-blush rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-vault-copperLight/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
                Unlock Secure Vault
              </h2>
              <p className="text-xs text-vault-roseDust mt-1">
                Enter your master credentials to decrypt local session keys.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-vault-maroon uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs text-vault-maroon"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-vault-maroon uppercase tracking-wider">
                    Master Password
                  </label>
                  <Link
                    href="/recovery"
                    className="text-[11px] font-medium text-vault-roseDust hover:text-vault-maroon transition-colors"
                  >
                    Forgot Master Password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter Master Password..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-xs font-mono text-vault-maroon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vault-roseDust hover:text-vault-maroon transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-vault-roseMuted font-medium mt-1.5">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream font-semibold text-xs transition-all shadow-vault-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-vault-cream border-t-transparent rounded-full animate-spin" />
                    Deriving AES-256 Key...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In & Decrypt Vault</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/register"
                  className="text-xs text-vault-roseDust hover:text-vault-maroon font-medium transition-colors"
                >
                  Need a new vault? <strong className="text-vault-maroon font-bold underline">Create Secure Vault</strong>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
