'use client';

import React from 'react';
import { Shield, Sparkles, Radio, ArrowRight } from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';
import { AccountCategory } from '@/lib/types/vault';

const CATEGORIES: { name: AccountCategory; label: string; countHint?: number }[] = [
  { name: 'Developer', label: 'Developer' },
  { name: 'AI Tools', label: 'AI Tools' },
  { name: 'Work', label: 'Work' },
  { name: 'Finance', label: 'Finance' },
  { name: 'Social', label: 'Social' },
  { name: 'Education', label: 'Education' },
  { name: 'Personal', label: 'Personal' },
];

export default function VaultHeroVisualization() {
  const {
    accounts,
    selectedCategoryForFocus,
    setSelectedCategoryForFocus,
    runSecurityAudit,
    activeScanState,
  } = useVault();

  const getCategoryCount = (catName: AccountCategory) => {
    return accounts.filter((a) => a.category === catName).length;
  };

  return (
    <div className="relative rounded-3xl p-6 md:p-8 glass-panel border border-vault-ivoryDark bg-gradient-to-b from-white/70 to-vault-blush/40 shadow-vault-md overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vault-copperLight/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Status Capsule */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-cream border border-vault-copper/30 shadow-vault-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-vault-copper animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
            Digital Vault Core Active
          </span>
          <span className="text-vault-roseDust">·</span>
          <span className="text-[11px] text-vault-roseDust">Zero-Knowledge AES-256</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold font-display text-vault-maroon tracking-tight mb-2">
          Your Digital Identity Ecosystem
        </h1>
        <p className="text-xs md:text-sm text-vault-roseDust max-w-xl mb-8">
          Interactive cryptographic vault node matrix. Select any identity cluster to inspect credentials,
          monitor exposures, and synchronize authentication keys.
        </p>

        {/* Category Orbital Hub Visual */}
        <div className="w-full max-w-4xl py-4 flex flex-wrap items-center justify-center gap-2.5 md:gap-4">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.name);
            const isSelected = selectedCategoryForFocus === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() =>
                  setSelectedCategoryForFocus(isSelected ? null : cat.name)
                }
                className={`group px-4 py-2.5 rounded-2xl transition-all duration-200 flex items-center gap-2.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-vault-maroon text-vault-cream border-vault-maroon shadow-vault-md scale-105'
                    : 'bg-white/80 hover:bg-vault-blush text-vault-maroon border-vault-copper/25 shadow-vault-sm'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isSelected ? 'bg-vault-cream' : 'bg-vault-copper group-hover:bg-vault-maroon'
                  }`}
                />
                <span className="text-xs font-bold tracking-tight">{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected
                      ? 'bg-vault-maroonDark text-vault-cream'
                      : 'bg-vault-ivory text-vault-roseDust'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Central Vault Action Bar */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => runSecurityAudit()}
            disabled={activeScanState === 'scanning'}
            className="px-5 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {activeScanState === 'scanning' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-vault-cream border-t-transparent rounded-full animate-spin" />
                <span>Scanning Identity Graph...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-vault-copperLight" />
                <span>Run Ecosystem Audit</span>
              </>
            )}
          </button>

          {selectedCategoryForFocus && (
            <button
              onClick={() => setSelectedCategoryForFocus(null)}
              className="px-3.5 py-2 rounded-xl bg-vault-ivory text-vault-roseDust hover:text-vault-maroon text-xs font-medium border border-vault-ivoryDark transition-colors"
            >
              Reset 3D Focus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
