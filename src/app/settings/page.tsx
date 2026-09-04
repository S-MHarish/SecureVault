'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import {
  Settings,
  Lock,
  Clock,
  Download,
  RotateCcw,
  ShieldCheck,
  Check,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    autoLockMinutes,
    setAutoLockMinutes,
    accounts,
    resetVaultToDemo,
    logActivity,
    lockVault,
  } = useVault();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exported, setExported] = useState(false);

  const handleSaveTimeout = (val: number) => {
    setAutoLockMinutes(val);
    setSavedSuccess(true);
    logActivity('SETTINGS_CHANGED', `Inactivity auto-lock set to ${val} minutes`);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportVault = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            vaultVersion: '1.0.0',
            exportedAt: new Date().toISOString(),
            encryption: 'AES-256-GCM',
            accounts: accounts.map((a) => ({
              ...a,
              // Keep ciphertext intact (Zero-Knowledge export)
            })),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `securevault_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExported(true);
    logActivity('EXPORT_VAULT', 'Exported encrypted vault backup file', 'JSON archive created');
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
              <Settings className="w-3.5 h-3.5 text-vault-maroon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                System Governance
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
              Vault Settings & Cryptographic Policies
            </h1>
            <p className="text-xs text-vault-roseDust mt-1">
              Configure session auto-lock behavior, export zero-knowledge backup archives, and reset demo datasets.
            </p>
          </div>

          <div className="space-y-6">
            {/* Auto-Lock Card */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-vault-maroon">Inactivity Auto-Lock Timeout</h3>
                    <p className="text-xs text-vault-roseDust">
                      Automatically purges decryption keys from browser memory after inactivity.
                    </p>
                  </div>
                </div>
                {savedSuccess && (
                  <span className="text-xs font-semibold text-vault-maroon flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                {[5, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSaveTimeout(mins)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      autoLockMinutes === mins
                        ? 'bg-vault-maroon text-vault-cream border-vault-maroon shadow-vault-sm'
                        : 'bg-vault-ivory text-vault-maroon border-vault-ivoryDark hover:bg-vault-blush'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Export Vault Backup */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-vault-maroon">Export Encrypted Vault Backup</h3>
                  <p className="text-xs text-vault-roseDust">
                    Download an offline zero-knowledge JSON file containing all AES-256 ciphertexts.
                  </p>
                </div>
              </div>

              <button
                onClick={handleExportVault}
                className="px-4 py-2.5 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-semibold border border-vault-copper/30 transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4 text-vault-copper" />}
                <span>{exported ? 'Backup Exported!' : 'Export JSON Backup'}</span>
              </button>
            </div>

            {/* Lock Session Immediately */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-vault-maroon">Lock Master Session Now</h3>
                  <p className="text-xs text-vault-roseDust">
                    Instantly wipes all in-memory keys and presents the 3D Vault Lock Screen.
                  </p>
                </div>
              </div>

              <button
                onClick={lockVault}
                className="px-4 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex-shrink-0 cursor-pointer"
              >
                Lock Vault Session
              </button>
            </div>

            {/* Reset Demo State */}
            <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-vault-maroon">Restore Default Demo Accounts</h3>
                  <p className="text-xs text-vault-roseDust">
                    Reset vault records, breach alerts, and activity logs to standard sample demonstration state.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Reset entire vault to initial demo state?')) {
                    resetVaultToDemo();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-maroon text-xs font-semibold border border-vault-ivoryDark transition-colors flex-shrink-0 cursor-pointer"
              >
                Reset Demo Vault
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
