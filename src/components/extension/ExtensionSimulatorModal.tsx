'use client';

import React, { useState } from 'react';
import {
  Laptop,
  X,
  ShieldCheck,
  KeyRound,
  Check,
  Copy,
  ExternalLink,
  Plus,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

const SIMULATED_SITES = [
  { name: 'GitHub Login', domain: 'github.com', accountId: 'acc-github-1' },
  { name: 'AWS Management Console', domain: 'aws.amazon.com', accountId: 'acc-aws-6' },
  { name: 'OpenAI Developer Portal', domain: 'platform.openai.com', accountId: 'acc-openai-2' },
  { name: 'New Service (Unsaved)', domain: 'substack.com', accountId: null },
];

export default function ExtensionSimulatorModal() {
  const {
    isExtensionSimOpen,
    setIsExtensionSimOpen,
    accounts,
    addAccount,
    logActivity,
  } = useVault();

  const [activeSiteIdx, setActiveSiteIdx] = useState(0);
  const [filledField, setFilledField] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('Substack Newsletter');
  const [newEmail, setNewEmail] = useState('alex.vanguard@gmail.com');
  const [newPassword, setNewPassword] = useState('sv_gen_s83kL9!2026');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isExtensionSimOpen) return null;

  const currentSite = SIMULATED_SITES[activeSiteIdx];
  const matchedAccount = currentSite.accountId
    ? accounts.find((a) => a.id === currentSite.accountId)
    : null;

  const handleAutofill = (field: 'email' | 'username' | 'password' | 'all') => {
    setFilledField(field);
    logActivity('PASSWORD_COPIED', `Browser extension autofill executed for ${currentSite.name}`, `Target field: ${field}`);
    setTimeout(() => setFilledField(null), 2500);
  };

  const handleSaveNewCredential = async () => {
    await addAccount({
      serviceName: newServiceName,
      websiteUrl: `https://${currentSite.domain}`,
      email: newEmail,
      username: newEmail.split('@')[0],
      category: 'Work',
      tags: ['extension-saved', 'web'],
    }, newPassword);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsExtensionSimOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vault-maroon/35 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-vault-ivoryDark bg-white/95 shadow-vault-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-vault-ivoryDark flex items-center justify-between bg-gradient-to-r from-vault-blush to-vault-ivory/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-maroon flex items-center justify-center text-vault-cream shadow-vault-sm">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-vault-maroon font-display">
                SecureVault AI — Browser Extension Simulator
              </h3>
              <p className="text-xs text-vault-roseDust">
                Simulate in-browser credential detection, zero-knowledge auto-fill & one-click capture.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExtensionSimOpen(false)}
            className="w-8 h-8 rounded-xl bg-vault-cream hover:bg-vault-blush border border-vault-copper/20 flex items-center justify-center text-vault-roseDust hover:text-vault-maroon transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulator Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Simulated Browser URL bar */}
          <div className="p-2.5 rounded-2xl bg-vault-ivory/80 border border-vault-ivoryDark flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-vault-copper/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-vault-copper/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-vault-copper/40" />
            </div>
            <div className="flex-1 bg-white px-3 py-1.5 rounded-xl border border-vault-ivoryDark flex items-center gap-2 text-xs font-mono text-vault-maroon">
              <Globe className="w-3.5 h-3.5 text-vault-copper" />
              <span>https://{currentSite.domain}/login</span>
            </div>
          </div>

          {/* Test Website Selector */}
          <div>
            <label className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider block mb-2">
              Select Simulated Web Page:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SIMULATED_SITES.map((site, i) => (
                <button
                  key={site.domain}
                  onClick={() => setActiveSiteIdx(i)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    activeSiteIdx === i
                      ? 'bg-vault-maroon text-vault-cream border-vault-maroon shadow-vault-sm'
                      : 'bg-vault-ivory/50 hover:bg-vault-blush text-vault-maroon border-vault-ivoryDark'
                  }`}
                >
                  <p className="font-bold truncate">{site.name}</p>
                  <p className={`text-[10px] truncate ${activeSiteIdx === i ? 'text-vault-cream/70' : 'text-vault-roseDust'}`}>
                    {site.domain}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Extension In-Page Overlay Popup */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-vault-blush/40 border-2 border-vault-copper/30 shadow-vault-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-vault-maroon flex items-center justify-center text-vault-cream">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-vault-maroon">SecureVault AI Extension Badge</h4>
                  <p className="text-[10px] text-vault-roseDust">Active on {currentSite.domain}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vault-blush text-vault-maroon border border-vault-copper/30">
                Encrypted Channel Active
              </span>
            </div>

            {matchedAccount ? (
              /* Case A: Existing account found */
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-vault-ivoryDark flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-vault-maroon block">
                      {matchedAccount.serviceName} Credential Available
                    </span>
                    <span className="text-[11px] text-vault-roseDust font-mono">
                      {matchedAccount.email} (Password: ••••••••••••)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vault-blush text-vault-maroon">
                    {matchedAccount.passwordStrength}
                  </span>
                </div>

                {/* Autofill Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleAutofill('all')}
                    className="p-2 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Auto-Fill All</span>
                  </button>
                  <button
                    onClick={() => handleAutofill('email')}
                    className="p-2 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-medium border border-vault-copper/25 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Fill Email</span>
                  </button>
                  <button
                    onClick={() => handleAutofill('username')}
                    className="p-2 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-medium border border-vault-copper/25 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Fill Username</span>
                  </button>
                  <button
                    onClick={() => handleAutofill('password')}
                    className="p-2 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-medium border border-vault-copper/25 transition-all flex items-center justify-center gap-1"
                  >
                    <span>Fill Password</span>
                  </button>
                </div>

                {filledField && (
                  <div className="p-2.5 rounded-xl bg-vault-blush border border-vault-copper/30 text-xs text-vault-maroon font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-vault-maroon" />
                    <span>Injected {filledField.toUpperCase()} securely into webpage form fields!</span>
                  </div>
                )}
              </div>
            ) : (
              /* Case B: New credential detected on page */
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-vault-ivory/60 border border-vault-ivoryDark">
                  <p className="text-xs font-bold text-vault-maroon mb-1">
                    New login detected on {currentSite.domain}!
                  </p>
                  <p className="text-[11px] text-vault-roseDust">
                    Save this credential to your encrypted SecureVault AI?
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <input
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="Service Name"
                      className="p-2 rounded-lg glass-input"
                    />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Email"
                      className="p-2 rounded-lg glass-input"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveNewCredential}
                  className="w-full py-2.5 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-vault-cream" />
                      <span>Encrypted & Saved to Vault!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Save Credentials to SecureVault</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-vault-ivory/80 border-t border-vault-ivoryDark flex items-center justify-between text-xs text-vault-roseDust">
          <span>Native Manifest V3 Chrome / Firefox / Safari Architecture</span>
          <button
            onClick={() => setIsExtensionSimOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-vault-maroon text-vault-cream text-xs font-semibold"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
