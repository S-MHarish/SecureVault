'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  RefreshCw,
  Trash2,
  ExternalLink,
  Tag,
  KeyRound,
  Mail,
  User,
  Clock,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';
import { generateTOTP } from '@/lib/crypto/totp';

export default function AccountDetailModal() {
  const {
    selectedAccountForModal,
    setSelectedAccountForModal,
    revealPassword,
    copyPasswordToClipboard,
    updateAccount,
    deleteAccount,
  } = useVault();

  const [revealed, setRevealed] = useState(false);
  const [passwordValue, setPasswordValue] = useState('••••••••••••');
  const [copied, setCopied] = useState(false);
  const [totpCode, setTotpCode] = useState('------');
  const [totpRemaining, setTotpRemaining] = useState(30);
  const [totpCopied, setTotpCopied] = useState(false);

  const account = selectedAccountForModal;

  // Live TOTP clock updates
  useEffect(() => {
    if (!account || !account.totpSecretEncrypted) return;

    let isMounted = true;
    const updateCode = async () => {
      const res = await generateTOTP(account.totpSecretEncrypted || '');
      if (isMounted) {
        setTotpCode(res.code);
        setTotpRemaining(res.secondsRemaining);
      }
    };

    updateCode();
    const interval = setInterval(updateCode, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [account]);

  if (!account) return null;

  const handleReveal = async () => {
    if (revealed) {
      setRevealed(false);
      setPasswordValue('••••••••••••');
    } else {
      const plain = await revealPassword(account);
      setPasswordValue(plain);
      setRevealed(true);
    }
  };

  const handleCopy = async () => {
    await copyPasswordToClipboard(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTotp = async () => {
    await navigator.clipboard.writeText(totpCode);
    setTotpCopied(true);
    setTimeout(() => setTotpCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${account.serviceName} from your encrypted vault?`)) {
      deleteAccount(account.id);
      setSelectedAccountForModal(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vault-maroon/35 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-vault-ivoryDark bg-white/90 shadow-vault-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-vault-ivoryDark flex items-center justify-between bg-gradient-to-r from-vault-blush/80 to-vault-ivory/50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-vault-maroon flex items-center justify-center text-vault-cream font-display font-bold text-lg shadow-vault-md">
              {account.serviceName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-vault-maroon font-display">{account.serviceName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-vault-blush text-vault-maroon font-semibold border border-vault-copper/30">
                  {account.category}
                </span>
              </div>
              <a
                href={account.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-vault-roseDust hover:text-vault-maroon flex items-center gap-1 mt-0.5"
              >
                <span>{account.websiteUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            onClick={() => setSelectedAccountForModal(null)}
            className="w-8 h-8 rounded-xl bg-vault-cream hover:bg-vault-blush border border-vault-copper/20 flex items-center justify-center text-vault-roseDust hover:text-vault-maroon transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Identity Credentials Box */}
          <div className="space-y-3 p-4 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark">
            {/* Email / Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-xs font-semibold text-vault-maroon">
                  <Mail className="w-3.5 h-3.5 text-vault-copper" />
                  <span>{account.email || 'None registered'}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                  Username
                </label>
                <div className="flex items-center gap-2 text-xs font-semibold text-vault-maroon">
                  <User className="w-3.5 h-3.5 text-vault-copper" />
                  <span>{account.username || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Encrypted Master Secret
              </label>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-vault-ivoryDark shadow-vault-inner">
                <span className="font-mono text-xs text-vault-maroon tracking-wider truncate max-w-[280px]">
                  {passwordValue}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleReveal}
                    className="p-1.5 rounded-lg hover:bg-vault-blush text-vault-roseDust hover:text-vault-maroon transition-colors"
                    title={revealed ? 'Hide Password' : 'Show Password'}
                  >
                    {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-semibold transition-colors flex items-center gap-1 border border-vault-copper/25"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live TOTP Authenticator (if available) */}
          {account.totpSecretEncrypted && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-vault-blush/60 to-vault-ivory/80 border border-vault-copper/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-vault-copper animate-pulse" />
                  <span className="text-xs font-bold text-vault-maroon">2FA Dynamic TOTP Code</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-vault-roseDust">
                  {totpRemaining}s remaining
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-mono font-bold text-vault-maroon tracking-widest">
                  {totpCode.slice(0, 3)} {totpCode.slice(3)}
                </div>
                <button
                  onClick={handleCopyTotp}
                  className="px-3 py-1.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-medium transition-all shadow-vault-sm flex items-center gap-1"
                >
                  {totpCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{totpCopied ? 'Code Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Security & Authentication Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark">
              <span className="text-[10px] text-vault-roseDust block mb-1 font-bold">Password Health</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-vault-maroon">{account.passwordStrength}</span>
                <span className="font-bold text-vault-copper font-mono">{account.strengthScore}/100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark">
              <span className="text-[10px] text-vault-roseDust block mb-1 font-bold">2FA Status</span>
              <span className="font-semibold text-vault-maroon flex items-center gap-1">
                {account.twoFactorStatus === 'Enabled' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-vault-maroon" /> Enabled
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-vault-roseMuted" /> Disabled
                  </>
                )}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark">
              <span className="text-[10px] text-vault-roseDust block mb-1 font-bold">Passkey Hardware Auth</span>
              <span className="font-semibold text-vault-maroon flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-vault-copper" />
                {account.passkeyStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark">
              <span className="text-[10px] text-vault-roseDust block mb-1 font-bold">Recovery Hygiene</span>
              <span className="font-semibold text-vault-maroon">
                {account.recoveryStatus === 'Complete' ? 'Configured ✓' : 'Incomplete ⚠'}
              </span>
            </div>
          </div>

          {/* Notes */}
          {account.notes && (
            <div>
              <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Encrypted Notes
              </label>
              <p className="text-xs text-vault-maroon/90 bg-vault-ivory/50 p-3 rounded-xl border border-vault-ivoryDark">
                {account.notes}
              </p>
            </div>
          )}

          {/* Tags */}
          {account.tags.length > 0 && (
            <div>
              <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1.5">
                Tags & Clusters
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {account.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-lg bg-vault-blush text-vault-maroon font-medium border border-vault-copper/25"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-vault-ivory/80 border-t border-vault-ivoryDark flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="text-xs text-vault-roseMuted hover:text-vault-maroon font-semibold flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-vault-blush transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>

          <button
            onClick={() => setSelectedAccountForModal(null)}
            className="px-4 py-2 rounded-xl bg-vault-maroon text-vault-cream text-xs font-semibold hover:bg-vault-maroonLight transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
