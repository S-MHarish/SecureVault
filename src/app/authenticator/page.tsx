'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import { generateTOTP } from '@/lib/crypto/totp';
import {
  ShieldCheck,
  Radio,
  Copy,
  Check,
  Plus,
  Clock,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export default function AuthenticatorPage() {
  const { accounts, logActivity, setIsAddAccountOpen } = useVault();
  const totpAccounts = accounts.filter((a) => a.hasTotpConfigured && a.totpSecretEncrypted);

  const [codes, setCodes] = useState<Record<string, { code: string; remaining: number }>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const refreshCodes = async () => {
      const results: Record<string, { code: string; remaining: number }> = {};
      for (const acc of totpAccounts) {
        if (acc.totpSecretEncrypted) {
          const res = await generateTOTP(acc.totpSecretEncrypted);
          results[acc.id] = { code: res.code, remaining: res.secondsRemaining };
        }
      }
      if (isMounted) {
        setCodes(results);
      }
    };

    refreshCodes();
    const interval = setInterval(refreshCodes, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [totpAccounts]);

  const handleCopyCode = async (id: string, code: string, serviceName: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    logActivity('TOTP_GENERATED', `Copied 2FA TOTP code for ${serviceName}`, 'Auto-expires in 30 seconds');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
                <Radio className="w-3.5 h-3.5 text-vault-maroon animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                  RFC 6238 TOTP Engine
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
                Two-Factor Authenticator (2FA / TOTP)
              </h1>
              <p className="text-xs text-vault-roseDust mt-1">
                Generate dynamic 6-digit authentication codes with zero-knowledge encrypted seed secrets.
              </p>
            </div>

            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Link New TOTP Key</span>
            </button>
          </div>

          {/* Grid of Active TOTP Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {totpAccounts.map((acc) => {
              const current = codes[acc.id] || { code: '------', remaining: 30 };
              const isCopied = copiedId === acc.id;

              return (
                <div
                  key={acc.id}
                  className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vault-blush to-vault-ivory flex items-center justify-center text-vault-maroon font-bold text-sm border border-vault-copper/30 shadow-vault-sm">
                        {acc.serviceName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-vault-maroon">{acc.serviceName}</h3>
                        <p className="text-[11px] text-vault-roseDust truncate max-w-[150px]">{acc.email}</p>
                      </div>
                    </div>

                    {/* Circular Countdown Progress */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-vault-ivory border border-vault-ivoryDark text-xs font-mono font-bold text-vault-copper">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{current.remaining}s</span>
                    </div>
                  </div>

                  {/* 6-Digit Code Display */}
                  <div className="p-4 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark text-center">
                    <span className="font-mono text-3xl font-extrabold text-vault-maroon tracking-widest select-all">
                      {current.code.slice(0, 3)} {current.code.slice(3)}
                    </span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyCode(acc.id, current.code, acc.serviceName)}
                    className="w-full py-2.5 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-vault-cream" />
                        <span>Code Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Dynamic 2FA Code</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
