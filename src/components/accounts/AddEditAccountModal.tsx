'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Tag,
  KeyRound,
  Mail,
  User,
  Globe,
  Radio,
  Fingerprint,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';
import { AccountCategory, TwoFactorStatus, PasskeyStatus } from '@/lib/types/vault';
import { generatePassword, analyzePassword } from '@/lib/crypto/passwordEngine';

const CATEGORIES: AccountCategory[] = [
  'Developer',
  'AI Tools',
  'Work',
  'Finance',
  'Social',
  'Education',
  'Shopping',
  'Personal',
];

export default function AddEditAccountModal() {
  const { isAddAccountOpen, setIsAddAccountOpen, addAccount } = useVault();

  const [serviceName, setServiceName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState<AccountCategory>('Developer');
  const [tagsInput, setTagsInput] = useState('developer, work');
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>('Enabled');
  const [totpSecret, setTotpSecret] = useState('');
  const [passkeyStatus, setPasskeyStatus] = useState<PasskeyStatus>('Available');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddAccountOpen) return null;

  const passwordAnalysis = analyzePassword(password);

  const handleGenerate = () => {
    const newPass = generatePassword({
      length: 22,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
      mode: 'random',
    });
    setPassword(newPass);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName) return;

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    await addAccount(
      {
        serviceName,
        websiteUrl: websiteUrl || `https://${serviceName.toLowerCase().replace(/\s+/g, '')}.com`,
        email,
        username,
        category,
        tags,
        twoFactorStatus,
        totpSecretEncrypted: totpSecret || undefined,
        passkeyStatus,
        recoveryEmail,
        notes,
      },
      password || 'SecureVault2026!Key'
    );

    setIsSubmitting(false);
    setIsAddAccountOpen(false);

    // Reset form
    setServiceName('');
    setWebsiteUrl('');
    setEmail('');
    setUsername('');
    setPassword('');
    setTotpSecret('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vault-maroon/35 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-vault-ivoryDark bg-white/95 shadow-vault-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-vault-ivoryDark flex items-center justify-between bg-gradient-to-r from-vault-blush to-vault-ivory/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-maroon flex items-center justify-center text-vault-cream shadow-vault-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-vault-maroon font-display">
                Add New Credential to Vault
              </h3>
              <p className="text-xs text-vault-roseDust">
                Client-side encrypted with zero-knowledge AES-256-GCM.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAccountOpen(false)}
            className="w-8 h-8 rounded-xl bg-vault-cream hover:bg-vault-blush border border-vault-copper/20 flex items-center justify-center text-vault-roseDust hover:text-vault-maroon transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Service Name & URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                Service / Platform Name *
              </label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g. GitHub, OpenAI, Canva"
                className="w-full p-2.5 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                Website URL
              </label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-vault-copper absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://github.com"
                  className="w-full pl-9 pr-3 p-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Email & Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-vault-copper absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full pl-9 pr-3 p-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                Username / Handle
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-vault-copper absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alexdev2026"
                  className="w-full pl-9 pr-3 p-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* Password with Live Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider">
                Encrypted Password *
              </label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs font-semibold text-vault-maroon hover:text-vault-roseDust flex items-center gap-1 bg-vault-blush px-2.5 py-1 rounded-lg border border-vault-copper/30 transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-vault-copper" />
                <span>Generate High-Entropy</span>
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 text-vault-copper absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter or generate password..."
                className="w-full pl-9 pr-10 p-2.5 rounded-xl glass-input text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-roseDust hover:text-vault-maroon"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength feedback */}
            {password && (
              <div className="mt-2 flex items-center justify-between text-xs bg-vault-ivory/60 p-2 rounded-xl border border-vault-ivoryDark">
                <span className="text-vault-roseDust">
                  Strength: <strong className="text-vault-maroon">{passwordAnalysis.strength}</strong> ({passwordAnalysis.score}/100)
                </span>
                <span className="text-vault-copper font-mono text-[11px]">
                  Crack time: {passwordAnalysis.estimatedCrackTime}
                </span>
              </div>
            )}
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AccountCategory)}
                className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
                Tags (comma separated)
              </label>
              <div className="relative">
                <Tag className="w-3.5 h-3.5 text-vault-copper absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="work, important, api"
                  className="w-full pl-9 pr-3 p-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2FA & TOTP Secret */}
          <div className="p-3.5 rounded-2xl bg-vault-ivory/50 border border-vault-ivoryDark space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                  2FA Status
                </label>
                <select
                  value={twoFactorStatus}
                  onChange={(e) => setTwoFactorStatus(e.target.value as TwoFactorStatus)}
                  className="w-full p-2 rounded-lg glass-input text-xs font-medium"
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                  Passkey Support
                </label>
                <select
                  value={passkeyStatus}
                  onChange={(e) => setPasskeyStatus(e.target.value as PasskeyStatus)}
                  className="w-full p-2 rounded-lg glass-input text-xs font-medium"
                >
                  <option value="Active">Active on Account</option>
                  <option value="Available">Available (Not yet linked)</option>
                  <option value="Not Supported">Not Supported</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Optional: 2FA TOTP Secret Key (Base32)
              </label>
              <input
                type="text"
                value={totpSecret}
                onChange={(e) => setTotpSecret(e.target.value)}
                placeholder="e.g. JBSWY3DPEHPK3PXP"
                className="w-full p-2 rounded-lg glass-input text-xs font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-1">
              Encrypted Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Security questions, account ID, or recovery hints..."
              className="w-full p-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-vault-ivoryDark flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddAccountOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-roseDust hover:text-vault-maroon text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Encrypting & Storing...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-vault-cream" />
                  <span>Save Encrypted Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
