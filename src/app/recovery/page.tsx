'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import { generateRecoveryKey } from '@/lib/crypto/webCrypto';
import {
  LifeBuoy,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Fingerprint,
} from 'lucide-react';

export default function RecoveryCenterPage() {
  const { logActivity } = useVault();

  const [recoveryEmail, setRecoveryEmail] = useState('alex.recovery@protonmail.com');
  const [recoveryPhone, setRecoveryPhone] = useState('+1 (555) 839-2049');
  const [backupCodes, setBackupCodes] = useState<string[]>([
    '8F92-K019-J821',
    '3L91-M928-V831',
    '9X20-Q831-C720',
    '5V82-P910-W829',
  ]);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerateNewCodes = () => {
    const newCodes = Array.from({ length: 4 }).map(() => {
      const key = generateRecoveryKey();
      return key.slice(0, 14);
    });
    setBackupCodes(newCodes);
    logActivity('SETTINGS_CHANGED', 'Regenerated emergency backup recovery codes');
  };

  const handleCopyCode = async (code: string, idx: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const handleSaveRecoverySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    logActivity('SETTINGS_CHANGED', 'Updated secondary recovery contact details');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
              <LifeBuoy className="w-3.5 h-3.5 text-vault-maroon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                Zero-Knowledge Continuity
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
              Recovery Center & Emergency Safeguards
            </h1>
            <p className="text-xs text-vault-roseDust mt-1">
              Maintain verifiable recovery channels and emergency backup keys without compromising vault encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Box: Secondary Recovery Channels */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md space-y-4">
              <div>
                <h3 className="text-sm font-bold text-vault-maroon font-display">
                  Secondary Identity Verifiers
                </h3>
                <p className="text-xs text-vault-roseDust">
                  Verified endpoints used for emergency vault verification workflows.
                </p>
              </div>

              <form onSubmit={handleSaveRecoverySettings} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                    Emergency Recovery Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                    Recovery Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={recoveryPhone}
                      onChange={(e) => setRecoveryPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark text-xs text-vault-roseDust flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-vault-copper" />
                    <span>Hardware FIDO2 Security Key Registered</span>
                  </div>
                  <span className="font-bold text-vault-maroon">Active ✓</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{isSaved ? 'Settings Saved' : 'Update Recovery Channels'}</span>
                </button>
              </form>
            </div>

            {/* Right Box: Encrypted Backup Codes Vault */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-vault-maroon font-display">
                    Offline Emergency Backup Codes
                  </h3>
                  <button
                    onClick={handleGenerateNewCodes}
                    className="p-1.5 rounded-lg bg-vault-ivory hover:bg-vault-blush text-vault-maroon transition-colors"
                    title="Generate New Codes"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-vault-roseDust mb-4">
                  Each one-time token bypasses multi-factor verification if your primary device is lost.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCopyCode(code, idx)}
                      className="p-3 rounded-xl bg-vault-ivory/80 hover:bg-vault-blush border border-vault-ivoryDark font-mono text-xs font-bold text-vault-maroon flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <span>{code}</span>
                      {copiedCodeIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-vault-maroon" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-vault-copper opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-vault-blush/60 border border-vault-copper/25 text-[11px] text-vault-roseDust">
                Store these codes securely on paper or in a physical safe. Never share recovery tokens online.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
