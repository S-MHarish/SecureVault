'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import AccountDetailModal from '@/components/accounts/AccountDetailModal';
import { useVault } from '@/lib/store/vaultContext';
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Copy,
  Clock,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Fingerprint,
  Radio,
  ArrowRight,
  ShieldAlert,
  Archive,
} from 'lucide-react';

export default function SecurityCenterPage() {
  const {
    securityScore,
    accounts,
    breachRecords,
    runSecurityAudit,
    markAccountReviewed,
    deleteAccount,
    setSelectedAccountForModal,
    setIsAdvisorOpen,
  } = useVault();

  const [activeTab, setActiveTab] = useState<'health' | 'rotation' | 'abandoned' | 'advisor'>('health');

  // Classification subsets
  const weakAccounts = accounts.filter((a) => a.passwordStrength === 'Weak' || a.strengthScore < 40);
  const reusedAccounts = accounts.filter(
    (a, idx, self) =>
      self.some((o, oIdx) => oIdx !== idx && o.encryptedPassword === a.encryptedPassword) ||
      (a.notes?.includes('reused') ?? false)
  );
  const strongAccounts = accounts.filter((a) => a.passwordStrength === 'Strong' || a.passwordStrength === 'Very Strong');
  const abandonedAccounts = accounts.filter((a) => a.isAbandoned);

  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const staleAccounts = accounts.filter((a) => now - new Date(a.lastRotated || a.createdAt).getTime() > ninetyDaysMs);

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Banner with Run Audit CTA */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-vault-ivoryDark bg-gradient-to-r from-white/90 via-vault-blush/40 to-white/90 shadow-vault-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
                <Sparkles className="w-3.5 h-3.5 text-vault-maroon" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                  AI Security Intelligence
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-vault-maroon tracking-tight">
                Identity Health & Security Center
              </h1>
              <p className="text-xs text-vault-roseDust mt-1 max-w-xl">
                Comprehensive cryptographic hygiene audit, credential age tracking, duplicate detection, and abandoned account monitoring.
              </p>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              <div className="text-right">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block">
                  Overall Score
                </span>
                <span className="text-3xl font-extrabold text-vault-maroon font-display">
                  {securityScore.overallScore} / 100
                </span>
              </div>
              <button
                onClick={() => runSecurityAudit()}
                className="px-5 py-3 rounded-2xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-vault-cream" />
                <span>Run Ecosystem Audit</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-vault-ivoryDark pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-vault-maroon text-vault-cream shadow-vault-sm'
                  : 'bg-vault-ivory text-vault-maroon hover:bg-vault-blush'
              }`}
            >
              Password Health ({strongAccounts.length} Strong, {weakAccounts.length} Weak)
            </button>
            <button
              onClick={() => setActiveTab('rotation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rotation'
                  ? 'bg-vault-maroon text-vault-cream shadow-vault-sm'
                  : 'bg-vault-ivory text-vault-maroon hover:bg-vault-blush'
              }`}
            >
              Password Rotation Tracker ({staleAccounts.length} Stale)
            </button>
            <button
              onClick={() => setActiveTab('abandoned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'abandoned'
                  ? 'bg-vault-maroon text-vault-cream shadow-vault-sm'
                  : 'bg-vault-ivory text-vault-maroon hover:bg-vault-blush'
              }`}
            >
              Abandoned Account Detector ({abandonedAccounts.length})
            </button>
            <button
              onClick={() => setIsAdvisorOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-vault-blush hover:bg-vault-blushHover text-vault-maroon border border-vault-copper/30 transition-all flex items-center gap-1.5 ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-vault-copper" />
              <span>AI Advisor Drawer</span>
            </button>
          </div>

          {/* TAB 1: Password Health */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
                  <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Strong Passwords</span>
                  <span className="text-2xl font-bold text-vault-maroon font-display">{strongAccounts.length}</span>
                  <p className="text-[11px] text-vault-roseDust mt-0.5">High entropy & 16+ chars</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
                  <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Needs Attention</span>
                  <span className="text-2xl font-bold text-vault-copper font-display">{accounts.length - strongAccounts.length}</span>
                  <p className="text-[11px] text-vault-roseDust mt-0.5">Missing 2FA or passkeys</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
                  <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Weak Passwords</span>
                  <span className="text-2xl font-bold text-vault-roseMuted font-display">{weakAccounts.length}</span>
                  <p className="text-[11px] text-vault-roseDust mt-0.5">Vulnerable to brute-force</p>
                </div>
                <div className="p-4 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
                  <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Reused Passwords</span>
                  <span className="text-2xl font-bold text-vault-roseMuted font-display">{reusedAccounts.length}</span>
                  <p className="text-[11px] text-vault-roseDust mt-0.5">Shared duplicate keys</p>
                </div>
              </div>

              {/* Reused Password Alert Box */}
              {reusedAccounts.length > 0 && (
                <div className="glass-panel p-6 rounded-3xl border border-vault-copper/30 bg-gradient-to-r from-vault-blush/60 to-white shadow-vault-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-vault-roseMuted" />
                    <h3 className="text-sm font-bold text-vault-maroon">
                      Duplicate Passwords Detected Across {reusedAccounts.length} Accounts
                    </h3>
                  </div>
                  <p className="text-xs text-vault-roseDust">
                    Services like Canva and LinkedIn share identical credential signatures. A single credential stuffing attack will compromise both accounts simultaneously.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {reusedAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccountForModal(acc)}
                        className="p-3 rounded-xl bg-white border border-vault-ivoryDark flex items-center justify-between cursor-pointer hover:border-vault-copper/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs">
                            {acc.serviceName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-vault-maroon block">{acc.serviceName}</span>
                            <span className="text-[10px] text-vault-roseDust">{acc.email}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-vault-maroon underline">Rotate Key →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Password Rotation Tracker */}
          {activeTab === 'rotation' && (
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-vault-maroon font-display">
                  Credential Maintenance & Rotation Schedule
                </h3>
                <p className="text-xs text-vault-roseDust">
                  Track how long credentials have remained unchanged to prevent silent historical exposures.
                </p>
              </div>

              <div className="divide-y divide-vault-ivoryDark/70">
                {accounts.map((acc) => {
                  const daysOld = Math.floor(
                    (now - new Date(acc.lastRotated || acc.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isStale = daysOld > 90;
                  const isCritical = daysOld > 180;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => setSelectedAccountForModal(acc)}
                      className="py-3.5 flex items-center justify-between hover:bg-vault-blush/40 px-3 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs">
                          {acc.serviceName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-vault-maroon">{acc.serviceName}</span>
                            <span className="text-[10px] text-vault-roseDust font-mono">{acc.email}</span>
                          </div>
                          <span className="text-[11px] text-vault-roseDust flex items-center gap-1">
                            <Clock className="w-3 h-3 text-vault-copper" />
                            Last Rotated: {new Date(acc.lastRotated || acc.createdAt).toLocaleDateString()} ({daysOld} days ago)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCritical ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vault-blush text-vault-roseMuted border border-vault-roseDust flex items-center gap-1">
                            🚨 {Math.floor(daysOld / 30)} months ago (Rotate Now)
                          </span>
                        ) : isStale ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vault-ivory text-vault-copper border border-vault-copper/30 flex items-center gap-1">
                            ⚠ {Math.floor(daysOld / 30)} months ago
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vault-blush text-vault-maroon border border-vault-copper/25 flex items-center gap-1">
                            ✓ Updated recently
                          </span>
                        )}
                        <span className="text-xs font-bold text-vault-maroon hover:underline">Inspect →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Abandoned Account Detector */}
          {activeTab === 'abandoned' && (
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-vault-maroon font-display">
                  Abandoned & Inactive Account Detector
                </h3>
                <p className="text-xs text-vault-roseDust">
                  Unused accounts expand your digital attack surface. Safely mark them as reviewed or initiate closure.
                </p>
              </div>

              {abandonedAccounts.length === 0 ? (
                <div className="p-8 text-center text-xs text-vault-roseDust">
                  No abandoned accounts currently flagged in your vault.
                </div>
              ) : (
                <div className="space-y-3">
                  {abandonedAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-4 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs flex-shrink-0">
                          <Archive className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-vault-maroon">{acc.serviceName}</h4>
                          <p className="text-[11px] text-vault-roseDust font-mono">{acc.email || acc.username}</p>
                          <p className="text-[11px] text-vault-copper mt-0.5">
                            Potentially unused — last active {new Date(acc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                          onClick={() => markAccountReviewed(acc.id)}
                          className="px-3 py-1.5 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-semibold border border-vault-copper/30 transition-colors"
                        >
                          Mark as Reviewed
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Open account deletion guidance for ${acc.serviceName}?`)) {
                              window.open(acc.websiteUrl, '_blank');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-vault-ivory text-vault-roseMuted hover:text-vault-maroon text-xs font-semibold border border-vault-ivoryDark transition-colors"
                        >
                          Delete Account Guide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AccountDetailModal />
    </div>
  );
}
