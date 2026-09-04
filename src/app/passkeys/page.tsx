'use client';

import React from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import AccountDetailModal from '@/components/accounts/AccountDetailModal';
import { useVault } from '@/lib/store/vaultContext';
import {
  Fingerprint,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function PasskeysPage() {
  const { accounts, setSelectedAccountForModal, updateAccount } = useVault();

  const handleTogglePasskey = (id: string, current: string) => {
    const nextStatus = current === 'Active' ? 'Available' : 'Active';
    updateAccount(id, { passkeyStatus: nextStatus as any });
  };

  const activeCount = accounts.filter((a) => a.passkeyStatus === 'Active').length;
  const readyCount = accounts.filter((a) => a.passkeyStatus === 'Available').length;

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
              <Fingerprint className="w-3.5 h-3.5 text-vault-maroon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                FIDO2 / WebAuthn Matrix
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
              Passkey Readiness & Modern Authentication Hub
            </h1>
            <p className="text-xs text-vault-roseDust mt-1">
              Phishing-resistant public key cryptography replaces passwords with biometric security keys.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Passkeys Active
              </span>
              <span className="text-3xl font-extrabold text-vault-maroon font-display">
                {activeCount}
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Biometric public-key auth registered</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Upgrade Ready
              </span>
              <span className="text-3xl font-extrabold text-vault-copper font-display">
                {readyCount}
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Supported by platform, ready to activate</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Total Coverage
              </span>
              <span className="text-3xl font-extrabold text-vault-maroon font-display">
                {Math.round(((activeCount + readyCount) / (accounts.length || 1)) * 100)}%
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Services supporting passwordless keys</p>
            </div>
          </div>

          {/* Service Matrix Table */}
          <div className="glass-panel rounded-3xl border border-vault-ivoryDark bg-white/90 shadow-vault-md overflow-hidden">
            <div className="p-6 border-b border-vault-ivoryDark flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-vault-maroon font-display">
                  Authentication Readiness Matrix
                </h3>
                <p className="text-xs text-vault-roseDust">
                  Track password health, 2FA adoption, and hardware passkey support across all services.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-vault-ivory/80 text-vault-roseDust uppercase text-[10px] font-bold border-b border-vault-ivoryDark">
                  <tr>
                    <th className="p-4">Service</th>
                    <th className="p-4">Identity / Account</th>
                    <th className="p-4 text-center">Password</th>
                    <th className="p-4 text-center">2FA / TOTP</th>
                    <th className="p-4 text-center">Passkey Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-ivoryDark/60 text-vault-maroon">
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-vault-blush/40 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs">
                          {acc.serviceName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span>{acc.serviceName}</span>
                          <span className="text-[10px] text-vault-roseDust block font-normal">{acc.category}</span>
                        </div>
                      </td>

                      <td className="p-4 text-vault-roseDust font-mono truncate max-w-[180px]">
                        {acc.email}
                      </td>

                      {/* Password column */}
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-vault-maroon bg-vault-blush px-2 py-0.5 rounded-md border border-vault-copper/20">
                          <Check className="w-3 h-3 text-vault-maroon" /> Encrypted
                        </span>
                      </td>

                      {/* 2FA column */}
                      <td className="p-4 text-center">
                        {acc.twoFactorStatus === 'Enabled' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-vault-maroon bg-vault-blush px-2 py-0.5 rounded-md border border-vault-copper/20">
                            <Check className="w-3 h-3 text-vault-maroon" /> 2FA Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-vault-roseDust bg-vault-ivory px-2 py-0.5 rounded-md">
                            — Missing
                          </span>
                        )}
                      </td>

                      {/* Passkey column */}
                      <td className="p-4 text-center">
                        {acc.passkeyStatus === 'Active' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-vault-cream bg-vault-maroon px-2.5 py-0.5 rounded-full shadow-vault-sm">
                            <Fingerprint className="w-3 h-3" /> Passkey Linked ✓
                          </span>
                        ) : acc.passkeyStatus === 'Available' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-vault-copper bg-vault-ivory px-2.5 py-0.5 rounded-full border border-vault-copper/30">
                            Available to Link
                          </span>
                        ) : (
                          <span className="text-[11px] text-vault-roseDust font-medium">
                            Not Supported
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        {acc.passkeyStatus === 'Available' ? (
                          <button
                            onClick={() => handleTogglePasskey(acc.id, acc.passkeyStatus)}
                            className="px-3 py-1.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm"
                          >
                            Mark Passkey Linked
                          </button>
                        ) : acc.passkeyStatus === 'Active' ? (
                          <button
                            onClick={() => handleTogglePasskey(acc.id, acc.passkeyStatus)}
                            className="px-2.5 py-1 rounded-xl bg-vault-ivory text-vault-roseDust hover:text-vault-maroon text-[11px] font-medium"
                          >
                            Unlink
                          </button>
                        ) : (
                          <span className="text-xs text-vault-roseDust">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AccountDetailModal />
    </div>
  );
}
