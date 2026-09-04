'use client';

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import VaultHeroVisualization from '@/components/dashboard/VaultHeroVisualization';
import SecurityScoreCard from '@/components/dashboard/SecurityScoreCard';
import QuickMetricsGrid from '@/components/dashboard/QuickMetricsGrid';
import AccountCard from '@/components/accounts/AccountCard';
import AccountDetailModal from '@/components/accounts/AccountDetailModal';
import { useVault } from '@/lib/store/vaultContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  MailSearch,
  Fingerprint,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    accounts,
    selectedCategoryForFocus,
    setIsAddAccountOpen,
    setIsAdvisorOpen,
    aiRecommendations,
  } = useVault();

  // Filter accounts if a 3D category is focused
  const displayedAccounts = selectedCategoryForFocus
    ? accounts.filter((a) => a.category === selectedCategoryForFocus)
    : accounts;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* 1. Hero 3D Security Ecosystem Visualization */}
          <VaultHeroVisualization />

          {/* 2. Security Score Card & AI Recommendation Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Score Card */}
            <div className="lg:col-span-1">
              <SecurityScoreCard />
            </div>

            {/* Right Top Priority AI Advice Deck */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/70 shadow-vault-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                      <Sparkles className="w-4 h-4 text-vault-maroon" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-vault-maroon">AI Security Advisor Insights</h3>
                      <p className="text-[11px] text-vault-roseDust">Tailored identity hardening actions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAdvisorOpen(true)}
                    className="text-xs font-semibold text-vault-maroon hover:text-vault-maroonLight flex items-center gap-1 group"
                  >
                    <span>View All ({aiRecommendations.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {aiRecommendations.slice(0, 2).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-vault-ivory/70 border border-vault-ivoryDark hover:border-vault-copper/40 transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="text-xs font-bold text-vault-maroon line-clamp-1">{rec.title}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-vault-blush text-vault-maroon font-mono flex-shrink-0">
                            +{rec.impactScore} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-vault-roseDust line-clamp-2 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-vault-ivoryDark/60 flex items-center justify-between text-[11px]">
                        <span className="text-vault-copper font-medium">{rec.tags[0]}</span>
                        <button
                          onClick={() => setIsAdvisorOpen(true)}
                          className="font-bold text-vault-maroon hover:underline"
                        >
                          Remedy →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Pills */}
              <div className="mt-4 pt-4 border-t border-vault-ivoryDark flex items-center gap-2 flex-wrap text-xs">
                <span className="text-vault-roseDust text-[11px] font-medium">Quick Tools:</span>
                <Link
                  href="/email-lookup"
                  className="px-3 py-1 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-maroon border border-vault-ivoryDark transition-colors flex items-center gap-1"
                >
                  <MailSearch className="w-3 h-3 text-vault-copper" />
                  <span>Email Map</span>
                </Link>
                <Link
                  href="/generator"
                  className="px-3 py-1 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-maroon border border-vault-ivoryDark transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-vault-copper" />
                  <span>Password Generator</span>
                </Link>
                <Link
                  href="/passkeys"
                  className="px-3 py-1 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-maroon border border-vault-ivoryDark transition-colors flex items-center gap-1"
                >
                  <Fingerprint className="w-3 h-3 text-vault-copper" />
                  <span>Passkey Hub</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Quick Security Metrics Grid (7 Indicators) */}
          <QuickMetricsGrid />

          {/* 4. Vault Account Grid Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-vault-maroon font-display flex items-center gap-2">
                  <span>
                    {selectedCategoryForFocus ? `${selectedCategoryForFocus} Accounts` : 'Vault Monitored Accounts'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-vault-blush text-vault-maroon font-bold font-mono">
                    {displayedAccounts.length}
                  </span>
                </h3>
                <p className="text-xs text-vault-roseDust">
                  {selectedCategoryForFocus
                    ? `Showing accounts in ${selectedCategoryForFocus} cluster`
                    : 'All accounts encrypted with zero-knowledge AES-256 keys'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Account</span>
                </button>
                <Link
                  href="/accounts"
                  className="px-3.5 py-1.5 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-maroon text-xs font-medium border border-vault-ivoryDark transition-colors"
                >
                  Manage All
                </Link>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedAccounts.slice(0, 6).map((acc) => (
                <AccountCard key={acc.id} account={acc} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Account Detail Modal Triggered from context */}
      <AccountDetailModal />
    </div>
  );
}
