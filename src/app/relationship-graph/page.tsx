'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import AccountDetailModal from '@/components/accounts/AccountDetailModal';
import { useVault } from '@/lib/store/vaultContext';
import {
  GitFork,
  User,
  Mail,
  Layers,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Sparkles,
} from 'lucide-react';

export default function RelationshipGraphPage() {
  const { accounts, setSelectedAccountForModal } = useVault();

  // Group accounts by category
  const categories = ['Developer', 'Work', 'Social', 'Finance', 'AI Tools', 'Education', 'Personal'] as const;

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
              <GitFork className="w-3.5 h-3.5 text-vault-maroon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                Ecosystem Topology
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
              Account & Identity Relationship Graph
            </h1>
            <p className="text-xs text-vault-roseDust mt-1">
              Interactive topological mapping: Root Identity Anchor → Email Entities → Security Clusters → Monitored Services.
            </p>
          </div>

          {/* Interactive Topology Visualizer */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-vault-ivoryDark bg-gradient-to-b from-white/90 via-vault-blush/30 to-white/90 shadow-vault-lg space-y-12 overflow-x-auto">
            {/* Tier 1: Root Master Identity */}
            <div className="flex flex-col items-center">
              <div className="p-5 rounded-3xl bg-vault-maroon text-vault-cream border border-vault-maroonDark shadow-vault-lg flex items-center gap-4 animate-pulse-subtle">
                <div className="w-12 h-12 rounded-2xl bg-vault-maroonDark flex items-center justify-center text-vault-cream">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-vault-copperLight uppercase tracking-wider block">
                    Zero-Knowledge Master Vault Identity
                  </span>
                  <span className="text-base font-bold font-display">Alex Vanguard (Master Root Key)</span>
                </div>
              </div>
              <div className="w-0.5 h-8 bg-vault-copper/60 my-1" />
            </div>

            {/* Tier 2: Email Anchor Entities */}
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="p-4 rounded-2xl bg-white border border-vault-copper/40 shadow-vault-sm flex items-center gap-3">
                <Mail className="w-5 h-5 text-vault-copper" />
                <div>
                  <span className="text-[10px] text-vault-roseDust font-bold uppercase block">Primary Personal</span>
                  <span className="text-xs font-bold text-vault-maroon font-mono">alex.vanguard@gmail.com</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-vault-copper/40 shadow-vault-sm flex items-center gap-3">
                <Mail className="w-5 h-5 text-vault-copper" />
                <div>
                  <span className="text-[10px] text-vault-roseDust font-bold uppercase block">Corporate / Work</span>
                  <span className="text-xs font-bold text-vault-maroon font-mono">alex.finance@vanguard.io</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-3xl mx-auto h-0.5 bg-gradient-to-r from-transparent via-vault-copper/40 to-transparent" />

            {/* Tier 3: Category Branches & Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const catAccounts = accounts.filter((a) => a.category === cat);
                if (catAccounts.length === 0) return null;

                return (
                  <div
                    key={cat}
                    className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark shadow-vault-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-vault-ivoryDark pb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-vault-copper" />
                        <h3 className="text-xs font-bold text-vault-maroon">{cat} Cluster</h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-vault-blush text-vault-maroon">
                        {catAccounts.length} services
                      </span>
                    </div>

                    <div className="space-y-2">
                      {catAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => setSelectedAccountForModal(acc)}
                          className="w-full p-2.5 rounded-xl bg-vault-ivory/60 hover:bg-vault-blush border border-vault-ivoryDark hover:border-vault-copper/30 transition-all flex items-center justify-between text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-[10px]">
                              {acc.serviceName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-vault-maroon block group-hover:text-vault-maroonLight">
                                {acc.serviceName}
                              </span>
                              <span className="text-[10px] text-vault-roseDust font-mono truncate max-w-[130px] block">
                                {acc.username || acc.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {acc.twoFactorStatus === 'Enabled' && (
                              <span title="2FA Enabled">
                                <ShieldCheck className="w-3 h-3 text-vault-maroon" />
                              </span>
                            )}
                            {acc.passkeyStatus === 'Active' && (
                              <span title="Passkey Active">
                                <Fingerprint className="w-3 h-3 text-vault-copper" />
                              </span>
                            )}
                            <span className="text-[10px] font-mono font-bold text-vault-copper ml-1">
                              {acc.strengthScore}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <AccountDetailModal />
    </div>
  );
}
