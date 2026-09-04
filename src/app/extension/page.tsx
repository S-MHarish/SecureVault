'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import {
  Laptop,
  ShieldCheck,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Download,
  Lock,
} from 'lucide-react';

export default function ExtensionPage() {
  const { setIsExtensionSimOpen } = useVault();
  const [pairingToken, setPairingToken] = useState('sv_pair_token_983kLs092jK');
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(pairingToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
                <Laptop className="w-3.5 h-3.5 text-vault-maroon" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                  Native Browser Integration
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
                Browser Extension & Auto-Fill Bridge
              </h1>
              <p className="text-xs text-vault-roseDust mt-1">
                Zero-knowledge in-browser autofill for Chrome, Firefox, Edge, and Safari with Manifest V3 architecture.
              </p>
            </div>

            <button
              onClick={() => setIsExtensionSimOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4 text-vault-copperLight" />
              <span>Launch Interactive Simulator</span>
            </button>
          </div>

          {/* Setup Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Browser Pairing Token */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-vault-maroon font-display">
                  Encrypted Local Bridge Token
                </h3>
                <p className="text-xs text-vault-roseDust">
                  Pairs your local browser extension with your zero-knowledge desktop vault.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-vault-ivory/80 border border-vault-ivoryDark font-mono text-xs text-vault-maroon flex items-center justify-between">
                <span className="truncate max-w-[240px]">{pairingToken}</span>
                <button
                  onClick={handleCopyToken}
                  className="px-3 py-1 rounded-lg bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-semibold border border-vault-copper/25 transition-colors flex items-center gap-1"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-2 text-xs text-vault-roseDust pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vault-copper" />
                  <span>Secure WebSockets over localhost (Port 48291)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vault-copper" />
                  <span>Diffie-Hellman key exchange per session</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vault-copper" />
                  <span>No plaintext secrets cached in browser storage</span>
                </div>
              </div>
            </div>

            {/* Box 2: Extension Architecture */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-vault-maroon font-display">
                  Supported Browser Ecosystems
                </h3>
                <p className="text-xs text-vault-roseDust">
                  Download package manifests for sideloading or extension store installation.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark flex items-center justify-between text-xs">
                  <span className="font-bold text-vault-maroon">Google Chrome / Chromium</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-vault-blush text-vault-maroon">
                    Manifest V3 Ready
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark flex items-center justify-between text-xs">
                  <span className="font-bold text-vault-maroon">Mozilla Firefox</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-vault-blush text-vault-maroon">
                    WebExtensions v2
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark flex items-center justify-between text-xs">
                  <span className="font-bold text-vault-maroon">Apple Safari (macOS & iOS)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-vault-blush text-vault-maroon">
                    App Extension
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
