'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  KeyRound,
  MailSearch,
  Fingerprint,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';
import { analyzePassword } from '@/lib/crypto/passwordEngine';

export default function LandingPage() {
  const router = useRouter();
  const { unlockVault } = useVault();
  const [demoPass, setDemoPass] = useState('CrimsonVault#2026!');
  const analysis = analyzePassword(demoPass);

  const handleLaunchDemo = async () => {
    await unlockVault('DemoMasterPassword2026!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vault-maroon flex items-center justify-center text-vault-cream shadow-vault-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-vault-maroon tracking-tight block leading-tight">
              SecureVault <span className="text-vault-copper text-xs uppercase font-semibold">AI</span>
            </span>
            <span className="text-[11px] text-vault-roseDust font-medium">
              Zero-Knowledge Identity
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-vault-maroon/80">
          <a href="#features" className="hover:text-vault-maroon transition-colors">
            Vault Features
          </a>
          <a href="#security" className="hover:text-vault-maroon transition-colors">
            Zero-Knowledge Cryptography
          </a>
          <a href="#ai-score" className="hover:text-vault-maroon transition-colors">
            AI Security Scoring
          </a>
          <Link href="/generator" className="hover:text-vault-maroon transition-colors">
            Password Generator
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-vault-maroon hover:bg-vault-blush transition-colors"
          >
            Sign In
          </Link>
          <button
            onClick={handleLaunchDemo}
            className="px-4 py-2 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Live Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center relative z-10">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-vault-copper/30 shadow-vault-sm mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-vault-copper" />
          <span className="text-xs font-bold text-vault-maroon uppercase tracking-wider">
            AI-Powered Digital Account & Credential Ecosystem
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold font-display text-vault-maroon tracking-tight max-w-4xl leading-[1.1] mb-6">
          Remember Every Account. <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-vault-maroon via-vault-roseMuted to-vault-copper bg-clip-text text-transparent">
            Secure Every Identity.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-sm md:text-lg text-vault-roseDust max-w-2xl leading-relaxed mb-10">
          SecureVault AI intelligently organizes your digital accounts, strengthens your credentials,
          and gives you a complete 3D view of your digital security with client-side zero-knowledge encryption.
        </p>

        {/* Premium Hero CTAs */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-md sm:max-w-none">
          {/* Button 1: Create Secure Vault */}
          <button
            onClick={handleLaunchDemo}
            className="group relative inline-flex items-center justify-center gap-2.5 h-[52px] px-7 w-full sm:w-auto rounded-[14px] bg-[#4A121A] hover:bg-[#581620] text-[#FAF7F5] text-[15px] font-semibold tracking-[-0.01em] border border-white/15 shadow-[0_4px_16px_rgba(74,18,26,0.18),0_1px_3px_rgba(74,18,26,0.12)] hover:shadow-[0_8px_24px_rgba(74,18,26,0.28),0_2px_6px_rgba(74,18,26,0.16)] transition-all duration-300 ease-out hover:-translate-y-[2.5px] active:translate-y-0 overflow-hidden cursor-pointer"
          >
            {/* Surface Glass Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            
            {/* Subtle Light Sweep on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            <Lock className="w-[18px] h-[18px] text-[#FAF7F5]/95 transition-transform duration-300 ease-out group-hover:scale-105" />
            <span className="relative z-10">Create Secure Vault</span>
            <ArrowRight className="w-[18px] h-[18px] text-[#FAF7F5]/95 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </button>

          {/* Button 2: Explore Security Matrix */}
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2.5 h-[52px] px-7 w-full sm:w-auto rounded-[14px] bg-[#FAF5F3]/95 hover:bg-[#F6ECE9] text-[#4A121A] text-[15px] font-semibold tracking-[-0.01em] border border-[#B76E60]/30 hover:border-[#8E4651]/45 shadow-[0_2px_8px_rgba(74,18,26,0.06),0_1px_2px_rgba(183,110,96,0.06)] hover:shadow-[0_6px_18px_rgba(74,18,26,0.09),0_2px_4px_rgba(183,110,96,0.08)] transition-all duration-300 ease-out hover:-translate-y-[2.5px] active:translate-y-0 backdrop-blur-sm cursor-pointer"
          >
            <ShieldCheck className="w-[18px] h-[18px] text-[#A35D67] transition-transform duration-300 ease-out group-hover:scale-110" />
            <span>Explore Security Matrix</span>
          </Link>
        </div>

        {/* Live Interactive Password & Strength Calculator Showcase */}
        <div id="ai-score" className="w-full max-w-3xl glass-panel p-6 md:p-8 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-lg text-left space-y-5">
          <div className="flex items-center justify-between border-b border-vault-ivoryDark pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-vault-maroon">Interactive AI Entropy Analyzer</h3>
                <p className="text-[11px] text-vault-roseDust">Test cryptographic password strength in real time</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-vault-blush text-vault-maroon border border-vault-copper/30">
              Live Engine
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-vault-maroon uppercase tracking-wider block">
              Test Sample Password:
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={demoPass}
                onChange={(e) => setDemoPass(e.target.value)}
                placeholder="Type any password..."
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm font-mono text-vault-maroon"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block">Strength</span>
                <span className="text-sm font-bold text-vault-maroon">{analysis.strength}</span>
              </div>
              <div className="p-3 rounded-xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block">Entropy Score</span>
                <span className="text-sm font-bold text-vault-copper font-mono">{analysis.score}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block">Shannon Bits</span>
                <span className="text-sm font-bold text-vault-maroon font-mono">{analysis.entropy} bits</span>
              </div>
              <div className="p-3 rounded-xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block">Brute-Force Time</span>
                <span className="text-sm font-bold text-vault-maroon">{analysis.estimatedCrackTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="w-full max-w-5xl my-20 text-left">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-vault-maroon">
              Engineered for Modern Digital Identities
            </h2>
            <p className="text-xs md:text-sm text-vault-roseDust mt-1">
              Complete visibility and intelligent protection across every account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark space-y-3">
              <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                <MailSearch className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-vault-maroon">Where Did I Use This Email?</h3>
              <p className="text-xs text-vault-roseDust leading-relaxed">
                Map every service tied to your work, school, or personal emails to discover forgotten accounts and exposure vectors.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark space-y-3">
              <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-vault-maroon">AI Security Scoring (87/100)</h3>
              <p className="text-xs text-vault-roseDust leading-relaxed">
                Algorithmic multi-factor vulnerability scoring analyzes reuse clusters, missing 2FA, and stale credentials with 1-click fixes.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark space-y-3">
              <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-vault-maroon">Passkey Readiness Hub</h3>
              <p className="text-xs text-vault-roseDust leading-relaxed">
                Track modern WebAuthn / FIDO2 biometric authentication across 12+ major cloud services for phishing-resistant access.
              </p>
            </div>
          </div>
        </div>

        {/* Zero Knowledge Pillars */}
        <div id="security" className="w-full max-w-4xl p-8 rounded-3xl glass-panel bg-gradient-to-r from-vault-blush/80 via-white to-vault-ivory/80 border border-vault-copper/30 text-left mb-16">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-vault-maroon" />
            <h3 className="text-lg font-bold text-vault-maroon font-display">
              Zero-Knowledge Cryptographic Guarantee
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-vault-maroon/90">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-vault-copper flex-shrink-0 mt-0.5" />
              <span>Client-side key derivation via PBKDF2 (100,000+ SHA-256 iterations)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-vault-copper flex-shrink-0 mt-0.5" />
              <span>AES-256-GCM authenticated encryption for all passwords, TOTP keys & notes</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-vault-copper flex-shrink-0 mt-0.5" />
              <span>Inactivity auto-lock purges keys from device memory</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-vault-copper flex-shrink-0 mt-0.5" />
              <span>No plaintext passwords ever touch server logs or APIs</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-vault-ivoryDark bg-vault-cream/80 backdrop-blur-md text-xs text-vault-roseDust">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-vault-maroon" />
            <span className="font-bold text-vault-maroon">SecureVault AI</span>
            <span>— Advanced Digital Account & Credential Manager</span>
          </div>
          <p>© 2026 SecureVault AI. Zero-Knowledge Cryptography & AI Identity Defense.</p>
        </div>
      </footer>
    </div>
  );
}
