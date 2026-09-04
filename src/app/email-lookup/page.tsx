'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import AccountDetailModal from '@/components/accounts/AccountDetailModal';
import { useVault } from '@/lib/store/vaultContext';
import {
  MailSearch,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function EmailLookupPage() {
  const { accounts, breachRecords, setSelectedAccountForModal } = useVault();

  // Extract unique emails from accounts
  const uniqueEmails = useMemo(() => {
    const set = new Set<string>();
    accounts.forEach((a) => {
      if (a.email) set.add(a.email.toLowerCase());
    });
    return Array.from(set);
  }, [accounts]);

  const [selectedEmail, setSelectedEmail] = useState(
    uniqueEmails[0] || 'alex.vanguard@gmail.com'
  );
  const [customInput, setCustomInput] = useState('');

  const activeEmail = (customInput || selectedEmail).toLowerCase();

  // Matched accounts for the active email
  const matchedAccounts = useMemo(() => {
    return accounts.filter((a) => a.email.toLowerCase().includes(activeEmail));
  }, [accounts, activeEmail]);

  // Associated breach records for this email domain / identity
  const relevantBreaches = useMemo(() => {
    return breachRecords.filter((b) =>
      b.exposedData.some((e) => e.toLowerCase().includes('email'))
    );
  }, [breachRecords]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
              <MailSearch className="w-3.5 h-3.5 text-vault-maroon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                Identity Mapping Hub
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
              Where Did I Use This Email?
            </h1>
            <p className="text-xs text-vault-roseDust mt-1">
              Trace every digital service, credential cluster, and exposure vector associated with any of your email identities.
            </p>
          </div>

          {/* Email Selector & Search Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-vault-ivoryDark bg-white/80 space-y-4 shadow-vault-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex-1 relative">
                <Mail className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Type or paste any email identity (e.g. user@gmail.com)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono text-vault-maroon"
                />
              </div>

              {/* Quick Pick Pill Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider whitespace-nowrap mr-1">
                  Saved Identities:
                </span>
                {uniqueEmails.map((em) => (
                  <button
                    key={em}
                    onClick={() => {
                      setSelectedEmail(em);
                      setCustomInput('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                      activeEmail === em
                        ? 'bg-vault-maroon text-vault-cream shadow-vault-sm font-bold'
                        : 'bg-vault-ivory hover:bg-vault-blush text-vault-maroon border border-vault-ivoryDark font-medium'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email Identity Diagnostic Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Connected Accounts
              </span>
              <span className="text-2xl font-bold text-vault-maroon font-display">
                {matchedAccounts.length}
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Active services in vault</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                2FA Coverage
              </span>
              <span className="text-2xl font-bold text-vault-maroon font-display">
                {matchedAccounts.filter((a) => a.twoFactorStatus === 'Enabled').length} / {matchedAccounts.length || 1}
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">
                {Math.round(
                  (matchedAccounts.filter((a) => a.twoFactorStatus === 'Enabled').length /
                    (matchedAccounts.length || 1)) *
                    100
                )}% verified
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Average Password Health
              </span>
              <span className="text-2xl font-bold text-vault-copper font-display">
                {matchedAccounts.length > 0
                  ? Math.round(
                      matchedAccounts.reduce((s, a) => s + a.strengthScore, 0) /
                        matchedAccounts.length
                    )
                  : 0}
                /100
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Combined entropy index</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-white/75 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Identity Breach Status
              </span>
              <span className="text-2xl font-bold text-vault-roseMuted font-display">
                1 Alert
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Historical exposure found</p>
            </div>
          </div>

          {/* Visual Interactive Email Usage Map */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-vault-ivoryDark bg-gradient-to-b from-white/90 to-vault-blush/30 shadow-vault-md space-y-6">
            <div className="flex items-center justify-between border-b border-vault-ivoryDark pb-4">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-vault-maroon" />
                <div>
                  <h3 className="text-sm font-bold text-vault-maroon font-display">
                    Identity Topology Graph — {activeEmail}
                  </h3>
                  <p className="text-[11px] text-vault-roseDust">
                    Click any node to reveal credentials, 2FA tokens, and recovery keys
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Node-Link Network Display */}
            <div className="flex flex-col items-center justify-center py-6 space-y-8">
              {/* Central Identity Root Node */}
              <div className="p-4 rounded-2xl bg-vault-maroon text-vault-cream shadow-vault-lg border border-vault-maroonDark flex items-center gap-3 animate-pulse-subtle">
                <Mail className="w-6 h-6 text-vault-cream" />
                <div>
                  <span className="text-[10px] font-bold text-vault-cream/70 uppercase tracking-wider block">
                    Primary Identity Anchor
                  </span>
                  <span className="text-sm font-bold font-mono">{activeEmail}</span>
                </div>
              </div>

              {/* Connecting Beam Lines */}
              <div className="w-full max-w-2xl h-0.5 bg-gradient-to-r from-transparent via-vault-copper/50 to-transparent" />

              {/* Connected Account Nodes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-4xl">
                {matchedAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccountForModal(acc)}
                    className="p-3.5 rounded-2xl bg-white/85 hover:bg-vault-blush border border-vault-ivoryDark hover:border-vault-copper/40 transition-all text-left shadow-vault-sm group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs group-hover:scale-105 transition-transform">
                          {acc.serviceName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-vault-ivory text-vault-roseDust">
                          {acc.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-vault-maroon">{acc.serviceName}</p>
                      <p className="text-[10px] text-vault-roseDust truncate">{acc.username || acc.email}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-vault-ivoryDark/60 flex items-center justify-between text-[10px]">
                      <span className="text-vault-copper font-mono font-bold">{acc.strengthScore}/100</span>
                      <span className="text-vault-maroon font-semibold group-hover:underline">Inspect →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Breach Exposure Alert for this Email */}
          <div className="glass-panel p-6 rounded-3xl border border-vault-copper/30 bg-gradient-to-r from-vault-blush/60 to-white shadow-vault-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-vault-roseMuted" />
              <h3 className="text-sm font-bold text-vault-maroon">
                External Security Breach History for {activeEmail}
              </h3>
            </div>
            <p className="text-xs text-vault-roseDust leading-relaxed">
              We cross-referenced this email identity with verified historical breach datasets. 1 incident was found associated with an external graphic design forum from 2025.
            </p>
            <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark flex items-center justify-between text-xs">
              <span className="font-semibold text-vault-maroon">GraphicDesignMarket Archive</span>
              <span className="text-vault-roseDust text-[11px]">Exposed: Username + Hashed password</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-vault-blush text-vault-roseMuted">
                Action: Change Password
              </span>
            </div>
          </div>
        </main>
      </div>

      <AccountDetailModal />
    </div>
  );
}
