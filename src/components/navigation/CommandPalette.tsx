'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  MailSearch,
  Fingerprint,
  ShieldAlert,
  Lock,
  Plus,
  ArrowRight,
  Tag,
  X,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

export default function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    accounts,
    setIsAddAccountOpen,
    runSecurityAudit,
    lockVault,
    setSelectedAccountForModal,
  } = useVault();

  const [query, setQuery] = useState('');

  const filteredAccounts = useMemo(() => {
    if (!query.trim()) return accounts.slice(0, 5);
    const q = query.toLowerCase();
    return accounts.filter(
      (a) =>
        a.serviceName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [accounts, query]);

  const quickCommands = [
    {
      title: 'Run AI Security Audit',
      action: () => {
        setIsCommandPaletteOpen(false);
        runSecurityAudit();
      },
      icon: ShieldCheck,
      desc: 'Scan entire account ecosystem and calculate security score',
    },
    {
      title: 'Generate High-Entropy Password',
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/generator');
      },
      icon: RefreshCw,
      desc: 'Customize length, symbols, or memorable passphrases',
    },
    {
      title: 'Search by Email Address',
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/email-lookup');
      },
      icon: MailSearch,
      desc: 'Discover everywhere you used user@gmail.com',
    },
    {
      title: 'Passkey Readiness Hub',
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/passkeys');
      },
      icon: Fingerprint,
      desc: 'Check which accounts support modern biometric passkeys',
    },
    {
      title: 'Check Identity Breaches',
      action: () => {
        setIsCommandPaletteOpen(false);
        router.push('/breach-monitor');
      },
      icon: ShieldAlert,
      desc: 'Review external breach datasets affecting your email',
    },
    {
      title: 'Add New Account to Vault',
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsAddAccountOpen(true);
      },
      icon: Plus,
      desc: 'Encrypt and store credentials, 2FA secrets, and recovery info',
    },
    {
      title: 'Lock Vault Session Now',
      action: () => {
        setIsCommandPaletteOpen(false);
        lockVault();
      },
      icon: Lock,
      desc: 'Purge decryption keys from browser memory immediately',
    },
  ];

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-vault-maroon/30 backdrop-blur-sm">
      <div className="w-full max-w-2xl glass-panel rounded-2xl shadow-vault-lg border border-vault-ivoryDark overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-vault-ivoryDark flex items-center gap-3 bg-white/70">
          <Search className="w-5 h-5 text-vault-copper" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, account name, email (e.g. gmail.com, college, dev)..."
            className="w-full bg-transparent text-vault-maroon text-sm focus:outline-none placeholder:text-vault-roseDust/60"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-vault-roseDust hover:text-vault-maroon">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Matching Accounts */}
          {filteredAccounts.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider px-2 mb-2">
                Accounts & Credentials ({filteredAccounts.length})
              </p>
              <div className="space-y-1">
                {filteredAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      setSelectedAccountForModal(acc);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-vault-blush/80 border border-transparent hover:border-vault-copper/25 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-vault-blush flex items-center justify-center text-vault-maroon font-semibold text-xs border border-vault-copper/20">
                        {acc.serviceName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-vault-maroon">{acc.serviceName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark">
                            {acc.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-vault-roseDust">{acc.email || acc.username}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {acc.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[9px] text-vault-roseDust flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />
                          {t}
                        </span>
                      ))}
                      <ArrowRight className="w-4 h-4 text-vault-copper opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <p className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider px-2 mb-2">
              Security Actions & Tools
            </p>
            <div className="space-y-1">
              {quickCommands
                .filter(
                  (c) =>
                    !query ||
                    c.title.toLowerCase().includes(query.toLowerCase()) ||
                    c.desc.toLowerCase().includes(query.toLowerCase())
                )
                .map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.title}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-vault-ivory border border-transparent hover:border-vault-copper/20 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-vault-cream flex items-center justify-center text-vault-copper border border-vault-copper/20 group-hover:text-vault-maroon">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-vault-maroon">{cmd.title}</p>
                          <p className="text-[10px] text-vault-roseDust">{cmd.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-vault-copper opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-vault-ivory/80 border-t border-vault-ivoryDark flex items-center justify-between text-[11px] text-vault-roseDust">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
