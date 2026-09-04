'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import { generatePassword, analyzePassword, GeneratorOptions } from '@/lib/crypto/passwordEngine';
import {
  RefreshCw,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  Sparkles,
  Sliders,
  Type,
  Hash,
} from 'lucide-react';

export default function GeneratorPage() {
  const { setIsAddAccountOpen } = useVault();

  const [options, setOptions] = useState<GeneratorOptions>({
    length: 22,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    mode: 'random',
    wordCount: 4,
    separator: '-',
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setGeneratedPassword(generatePassword(options));
  }, [options]);

  const handleRegenerate = () => {
    setGeneratedPassword(generatePassword(options));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analysis = analyzePassword(generatedPassword);

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
              <RefreshCw className="w-3.5 h-3.5 text-vault-maroon" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                Cryptographic Key Synthesis
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
              High-Entropy Password & Key Generator
            </h1>
            <p className="text-xs text-vault-roseDust mt-1">
              Synthesize cryptographically uncrackable passwords, memorable passphrases, and pronounceable keys.
            </p>
          </div>

          {/* Master Generator Display Card */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-lg space-y-6">
            {/* Generated Password Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-vault-ivory to-vault-blush/60 border border-vault-copper/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-base md:text-xl font-bold text-vault-maroon tracking-wider break-all text-center sm:text-left select-all">
                {generatedPassword}
              </span>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleRegenerate}
                  className="p-2.5 rounded-xl bg-white hover:bg-vault-ivory border border-vault-ivoryDark text-vault-maroon transition-colors"
                  title="Generate New Secret"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Secret'}</span>
                </button>
              </div>
            </div>

            {/* Strength & Entropy Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Strength Class</span>
                <span className="text-sm font-bold text-vault-maroon">{analysis.strength}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Entropy Score</span>
                <span className="text-sm font-bold text-vault-copper font-mono">{analysis.score}/100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Shannon Entropy</span>
                <span className="text-sm font-bold text-vault-maroon font-mono">{analysis.entropy} bits</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark">
                <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">Estimated Crack Time</span>
                <span className="text-sm font-bold text-vault-maroon">{analysis.estimatedCrackTime}</span>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-5 pt-2 border-t border-vault-ivoryDark">
              {/* Generation Mode Selector */}
              <div>
                <label className="text-[11px] font-bold text-vault-maroon uppercase tracking-wider block mb-2">
                  Generation Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setOptions((p) => ({ ...p, mode: 'random' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      options.mode === 'random'
                        ? 'bg-vault-maroon text-vault-cream border-vault-maroon shadow-vault-sm'
                        : 'bg-vault-ivory text-vault-maroon border-vault-ivoryDark hover:bg-vault-blush'
                    }`}
                  >
                    Random Characters
                  </button>
                  <button
                    onClick={() => setOptions((p) => ({ ...p, mode: 'passphrase' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      options.mode === 'passphrase'
                        ? 'bg-vault-maroon text-vault-cream border-vault-maroon shadow-vault-sm'
                        : 'bg-vault-ivory text-vault-maroon border-vault-ivoryDark hover:bg-vault-blush'
                    }`}
                  >
                    Memorable Passphrase
                  </button>
                  <button
                    onClick={() => setOptions((p) => ({ ...p, mode: 'pronounceable' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      options.mode === 'pronounceable'
                        ? 'bg-vault-maroon text-vault-cream border-vault-maroon shadow-vault-sm'
                        : 'bg-vault-ivory text-vault-maroon border-vault-ivoryDark hover:bg-vault-blush'
                    }`}
                  >
                    Pronounceable Key
                  </button>
                </div>
              </div>

              {/* Length Slider (for random / pronounceable mode) */}
              {options.mode !== 'passphrase' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-vault-maroon">
                      Length: <span className="font-mono text-vault-copper">{options.length} characters</span>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={options.length}
                    onChange={(e) => setOptions((p) => ({ ...p, length: Number(e.target.value) }))}
                    className="w-full accent-vault-maroon cursor-pointer"
                  />
                </div>
              )}

              {/* Word Count (for Passphrase mode) */}
              {options.mode === 'passphrase' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-vault-maroon">
                      Word Count: <span className="font-mono text-vault-copper">{options.wordCount} words</span>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    value={options.wordCount || 4}
                    onChange={(e) => setOptions((p) => ({ ...p, wordCount: Number(e.target.value) }))}
                    className="w-full accent-vault-maroon cursor-pointer"
                  />
                </div>
              )}

              {/* Character Rules Checkboxes */}
              {options.mode === 'random' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-vault-maroon cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.useUppercase}
                      onChange={(e) => setOptions((p) => ({ ...p, useUppercase: e.target.checked }))}
                      className="accent-vault-maroon rounded"
                    />
                    <span>Uppercase (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-vault-maroon cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.useLowercase}
                      onChange={(e) => setOptions((p) => ({ ...p, useLowercase: e.target.checked }))}
                      className="accent-vault-maroon rounded"
                    />
                    <span>Lowercase (a-z)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-vault-maroon cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.useNumbers}
                      onChange={(e) => setOptions((p) => ({ ...p, useNumbers: e.target.checked }))}
                      className="accent-vault-maroon rounded"
                    />
                    <span>Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-vault-maroon cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.useSymbols}
                      onChange={(e) => setOptions((p) => ({ ...p, useSymbols: e.target.checked }))}
                      className="accent-vault-maroon rounded"
                    />
                    <span>Symbols (!@#$)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Explicit Save to Vault Button */}
            <div className="pt-4 border-t border-vault-ivoryDark flex items-center justify-between">
              <p className="text-xs text-vault-roseDust">
                Passwords are not stored automatically without explicit vault confirmation.
              </p>
              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-semibold border border-vault-copper/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-vault-copper" />
                <span>Save to Secure Vault</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
