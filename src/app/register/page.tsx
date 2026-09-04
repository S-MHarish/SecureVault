'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';
import { analyzePassword } from '@/lib/crypto/passwordEngine';
import { generateRecoveryKey } from '@/lib/crypto/webCrypto';

export default function RegisterPage() {
  const router = useRouter();
  const { unlockVault } = useVault();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Password, Step 2: Emergency Recovery Key
  const [recoveryKey, setRecoveryKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [error, setError] = useState('');

  const analysis = analyzePassword(password);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Master Passwords do not match');
      return;
    }
    if (analysis.score < 40) {
      setError('Please choose a stronger master password');
      return;
    }

    const key = generateRecoveryKey();
    setRecoveryKey(key);
    setStep(2);
  };

  const handleFinalize = async () => {
    await unlockVault(password);
    router.push('/dashboard');
  };

  const handleCopyRecovery = async () => {
    await navigator.clipboard.writeText(recoveryKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="max-w-xl w-full glass-panel p-8 md:p-10 rounded-3xl border border-vault-ivoryDark bg-white/90 shadow-vault-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-vault-maroon flex items-center justify-center text-vault-cream shadow-vault-md mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
            {step === 1 ? 'Create Your Master Secure Vault' : 'Save Emergency Master Recovery Key'}
          </h1>
          <p className="text-xs text-vault-roseDust mt-1 max-w-sm mx-auto">
            {step === 1
              ? 'Your master password is never transmitted to any server. It is your only decryption key.'
              : 'Write down this emergency recovery key. If you ever forget your master password, this is your only recovery method.'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-vault-maroon uppercase tracking-wider mb-1">
                Primary Identity Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.vanguard@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs text-vault-maroon"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-vault-maroon uppercase tracking-wider mb-1">
                Master Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Choose high-entropy master password..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-xs font-mono text-vault-maroon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vault-roseDust hover:text-vault-maroon"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="mt-2 flex items-center justify-between text-xs bg-vault-ivory/70 p-2 rounded-xl border border-vault-ivoryDark">
                  <span className="text-vault-roseDust">
                    Strength: <strong className="text-vault-maroon">{analysis.strength}</strong> ({analysis.score}/100)
                  </span>
                  <span className="text-vault-copper font-mono text-[11px]">
                    Crack time: {analysis.estimatedCrackTime}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-vault-maroon uppercase tracking-wider mb-1">
                Confirm Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Re-enter Master Password..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-mono text-vault-maroon"
                />
              </div>
            </div>

            {error && <p className="text-xs text-vault-roseMuted font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream font-semibold text-xs transition-all shadow-vault-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue to Recovery Setup</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs text-vault-roseDust hover:text-vault-maroon font-medium"
              >
                Already have a vault? <strong className="text-vault-maroon underline">Sign In</strong>
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: Emergency Key */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-vault-ivory/80 border border-vault-copper/30 space-y-3">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block">
                Emergency Zero-Knowledge Recovery Token
              </span>
              <div className="p-3 rounded-xl bg-white border border-vault-ivoryDark font-mono font-bold text-xs md:text-sm text-vault-maroon text-center tracking-wider select-all">
                {recoveryKey}
              </div>
              <button
                onClick={handleCopyRecovery}
                className="w-full py-2 rounded-xl bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-xs font-semibold border border-vault-copper/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey ? 'Recovery Key Copied!' : 'Copy Recovery Key to Clipboard'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-vault-cream border border-vault-ivoryDark text-[11px] text-vault-roseDust flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-vault-copper flex-shrink-0 mt-0.5" />
              <span>
                I understand that SecureVault AI has zero access to my master credentials, and I have saved my emergency key.
              </span>
            </div>

            <button
              onClick={handleFinalize}
              className="w-full py-3.5 px-4 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream font-semibold text-xs transition-all shadow-vault-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-vault-cream" />
              <span>Initialize Vault & Open Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
