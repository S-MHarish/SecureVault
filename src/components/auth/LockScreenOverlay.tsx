'use client';

import React, { useState } from 'react';
import { useVault } from '@/lib/store/vaultContext';
import { Shield, KeyRound, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LockScreenOverlay() {
  const { isLocked, unlockVault } = useVault();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your master password');
      return;
    }
    setIsLoading(true);
    setError('');

    const success = await unlockVault(password);
    setIsLoading(false);
    if (!success) {
      setError('Invalid master password. (Hint: enter any password or demo key)');
    } else {
      setPassword('');
    }
  };

  const handleQuickDemoUnlock = async () => {
    setIsLoading(true);
    await unlockVault('SecureMasterPassword2026!');
    setIsLoading(false);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vault-cream/80 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-vault-lg border border-vault-ivoryDark relative overflow-hidden">
        {/* Top Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-vault-blush rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-vault-copperLight rounded-full blur-2xl opacity-30 pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vault-blush to-vault-ivory flex items-center justify-center shadow-vault-md mb-4 border border-vault-copper/30">
            <Shield className="w-8 h-8 text-vault-maroon animate-pulse-subtle" />
          </div>
          <h2 className="text-2xl font-bold text-vault-maroon font-display tracking-tight">
            Vault Auto-Locked
          </h2>
          <p className="text-sm text-vault-roseDust mt-1 max-w-xs">
            Zero-knowledge security active. Master cryptographic keys purged from memory.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-vault-maroon uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter Master Password..."
                className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm focus:ring-2 focus:ring-vault-copper/30 placeholder:text-vault-roseDust/50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vault-roseDust hover:text-vault-maroon transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-vault-maroonLight font-medium mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream font-medium text-sm transition-all shadow-vault-sm flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-vault-cream border-t-transparent rounded-full animate-spin" />
                Deriving AES-256 Key...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Unlock Digital Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="w-full py-2 px-3 rounded-lg border border-vault-copper/30 bg-vault-blush/60 hover:bg-vault-blush text-vault-maroon text-xs font-medium transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-vault-copper" />
              <span>One-Click Quick Unlock (Demo Key)</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-vault-ivoryDark text-center">
          <p className="text-xs text-vault-roseDust">
            Inactivity timeout is configurable in Vault Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
