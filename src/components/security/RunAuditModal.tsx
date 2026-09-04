'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  X,
  ArrowRight,
  Radio,
  Lock,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

export default function RunAuditModal() {
  const { isAuditModalOpen, setIsAuditModalOpen, activeScanState, securityScore, accounts, breachRecords } = useVault();
  const [scanStep, setScanStep] = useState(0);

  const scanSteps = [
    'Initializing Zero-Knowledge Diagnostic Core...',
    'Evaluating cryptographic password entropy across 12 services...',
    'Cross-referencing duplicate credential signatures & hash collisions...',
    'Scanning identity exposures against breach telemetry archives...',
    'Verifying WebAuthn / FIDO2 passkey hardware coverage...',
    'Compiling AI Security Matrix & recommendations...',
  ];

  useEffect(() => {
    if (!isAuditModalOpen) {
      setScanStep(0);
      return;
    }

    if (activeScanState === 'scanning') {
      const interval = setInterval(() => {
        setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 450);
      return () => clearInterval(interval);
    }
  }, [isAuditModalOpen, activeScanState]);

  if (!isAuditModalOpen) return null;

  const isScanning = activeScanState === 'scanning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vault-maroon/40 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-vault-ivoryDark bg-white/95 shadow-vault-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-vault-ivoryDark flex items-center justify-between bg-gradient-to-r from-vault-blush to-vault-ivory/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-vault-maroon flex items-center justify-center text-vault-cream shadow-vault-md">
              <ShieldCheck className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-vault-maroon font-display">
                {isScanning ? 'AI Security Ecosystem Audit Running...' : 'Security Audit Complete'}
              </h3>
              <p className="text-xs text-vault-roseDust">
                Deep cryptographic inspection of credentials, authentication methods & identity nodes.
              </p>
            </div>
          </div>

          {!isScanning && (
            <button
              onClick={() => setIsAuditModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-vault-cream hover:bg-vault-blush border border-vault-copper/20 flex items-center justify-center text-vault-roseDust hover:text-vault-maroon transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Scanning Progress Screen */}
          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
              {/* Radar Pulse Graphic */}
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-vault-copper/30 animate-ping absolute" />
                <div className="w-20 h-20 rounded-full border border-vault-copper/50 animate-pulse flex items-center justify-center bg-vault-blush" />
                <Lock className="w-8 h-8 text-vault-maroon absolute" />
              </div>

              <div>
                <p className="text-sm font-bold text-vault-maroon font-display tracking-tight">
                  {scanSteps[scanStep]}
                </p>
                <p className="text-xs text-vault-roseDust mt-1">
                  Inspecting nodes in 3D vault space...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md h-2 bg-vault-ivory rounded-full overflow-hidden border border-vault-ivoryDark">
                <div
                  className="h-full bg-gradient-to-r from-vault-copper to-vault-maroon transition-all duration-300 rounded-full"
                  style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            /* Complete Audit Summary */
            <div className="space-y-6">
              {/* Top Score Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-vault-blush/80 via-white to-vault-ivory/80 border border-vault-copper/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider block">
                    Overall Security Posture
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl font-extrabold text-vault-maroon font-display">
                      {securityScore.overallScore}
                    </span>
                    <span className="text-base font-semibold text-vault-roseDust">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-vault-maroon block">
                    {accounts.length} Accounts Monitored
                  </span>
                  <span className="text-[11px] text-vault-roseDust">
                    Zero-Knowledge Validated
                  </span>
                </div>
              </div>

              {/* Audit Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-vault-maroon flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-vault-maroon">Zero-Knowledge Encryption</h4>
                    <p className="text-[11px] text-vault-roseDust">
                      AES-256-GCM client-side encryption verified. No plaintext exposed.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-vault-maroon flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-vault-maroon">Authentication Keys</h4>
                    <p className="text-[11px] text-vault-roseDust">
                      PBKDF2 key derivation iterations: 100,000+ rounds.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-vault-copper flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-vault-maroon">
                      {securityScore.reusedPasswordsCount} Reused Passwords
                    </h4>
                    <p className="text-[11px] text-vault-roseDust">
                      Canva and LinkedIn share duplicate credential signatures.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-vault-copper flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-vault-maroon">
                      {accounts.filter((a) => a.twoFactorStatus !== 'Enabled').length} Accounts Without 2FA
                    </h4>
                    <p className="text-[11px] text-vault-roseDust">
                      Enable TOTP hardware authenticators to prevent stuffing.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-vault-ivory/60 border border-vault-ivoryDark flex items-start gap-3 md:col-span-2">
                  <ShieldAlert className="w-5 h-5 text-vault-roseMuted flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-vault-maroon">
                      {breachRecords.filter((b) => b.status === 'active_threat').length} Identity Exposure Alert
                    </h4>
                    <p className="text-[11px] text-vault-roseDust">
                      External database dump detected for GraphicDesignMarket Archive. Immediate password change advised.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-vault-ivory/80 border-t border-vault-ivoryDark flex items-center justify-between">
          <span className="text-xs text-vault-roseDust">
            Timestamp: {new Date().toLocaleTimeString()}
          </span>
          <button
            onClick={() => setIsAuditModalOpen(false)}
            disabled={isScanning}
            className="px-5 py-2 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
