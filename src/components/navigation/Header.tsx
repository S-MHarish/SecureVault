'use client';

import React from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Laptop,
  Command,
  Plus,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

export default function Header() {
  const {
    setIsCommandPaletteOpen,
    setIsAddAccountOpen,
    runSecurityAudit,
    setIsAdvisorOpen,
    setIsExtensionSimOpen,
    aiRecommendations,
    securityScore,
  } = useVault();

  return (
    <header className="h-16 px-6 glass-panel border-b border-vault-ivoryDark bg-vault-cream/75 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      {/* Global Search Bar Trigger */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl glass-input text-xs text-vault-roseDust hover:border-vault-copper/50 hover:bg-white/90 transition-all cursor-pointer shadow-vault-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-vault-copper" />
            <span>Search accounts, emails, tags, passkeys...</span>
          </div>
          <div className="flex items-center gap-1 bg-vault-ivory px-2 py-0.5 rounded-md border border-vault-ivoryDark text-[10px] font-mono text-vault-maroon font-semibold">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Browser Extension Simulation */}
        <button
          onClick={() => setIsExtensionSimOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-vault-copper/25 bg-vault-cream/90 hover:bg-vault-blush text-vault-maroon text-xs font-medium transition-all shadow-vault-sm"
          title="Simulate Browser Extension Auto-Fill"
        >
          <Laptop className="w-3.5 h-3.5 text-vault-copper" />
          <span>Extension Simulator</span>
        </button>

        {/* AI Security Advisor Button */}
        <button
          onClick={() => setIsAdvisorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon border border-vault-copper/30 text-xs font-semibold transition-all shadow-vault-sm relative"
        >
          <Sparkles className="w-3.5 h-3.5 text-vault-maroon animate-pulse-subtle" />
          <span>AI Advisor</span>
          {aiRecommendations.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-vault-maroon text-vault-cream text-[10px] flex items-center justify-center font-bold">
              {aiRecommendations.length}
            </span>
          )}
        </button>

        {/* Run Security Audit */}
        <button
          onClick={() => runSecurityAudit()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-vault-cream" />
          <span>Run Security Audit</span>
        </button>

        {/* Add Account Shortcut */}
        <button
          onClick={() => setIsAddAccountOpen(true)}
          className="w-8 h-8 rounded-xl bg-vault-blush hover:bg-vault-blushHover border border-vault-copper/30 flex items-center justify-center text-vault-maroon transition-all"
          title="Add New Account"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
