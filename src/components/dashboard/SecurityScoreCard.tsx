'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

export default function SecurityScoreCard() {
  const { securityScore, setIsAdvisorOpen, runSecurityAudit } = useVault();
  const score = securityScore.overallScore;

  // Color calculation based on score
  const getScoreColor = () => {
    if (score >= 85) return 'text-vault-maroon';
    if (score >= 60) return 'text-vault-copper';
    return 'text-vault-roseMuted';
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-white/70 shadow-vault-md flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-vault-blush/50 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-vault-maroon">Security Score</h3>
              <p className="text-[11px] text-vault-roseDust">Continuous AI Evaluation</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdvisorOpen(true)}
            className="text-[11px] font-semibold text-vault-maroon hover:text-vault-roseDust flex items-center gap-1 bg-vault-ivory px-2.5 py-1 rounded-lg border border-vault-ivoryDark transition-colors"
          >
            <Sparkles className="w-3 h-3 text-vault-copper" />
            <span>AI Breakdown</span>
          </button>
        </div>

        {/* Large Score Gauge */}
        <div className="flex items-baseline gap-2 my-2">
          <span className={`text-5xl font-extrabold font-display tracking-tight ${getScoreColor()}`}>
            {score}
          </span>
          <span className="text-lg font-semibold text-vault-roseDust font-display">/ 100</span>
        </div>

        <p className="text-xs text-vault-roseDust mb-4">
          {score >= 85
            ? 'Optimal posture. Minor enhancements available for developer passkeys and rotation.'
            : score >= 60
            ? 'Moderate risk. Address reused passwords and missing 2FA to strengthen defense.'
            : 'Immediate action advised. Several critical exposures detected.'}
        </p>

        {/* Score Deductions Summary List */}
        <div className="space-y-2 mb-4">
          {securityScore.deductions.slice(0, 3).map((d, i) => (
            <div
              key={i}
              className="flex items-start justify-between p-2 rounded-xl bg-vault-ivory/70 border border-vault-ivoryDark text-xs"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-vault-copper flex-shrink-0" />
                <span className="text-vault-maroon font-medium text-[11px] line-clamp-1">
                  {d.title}
                </span>
              </div>
              <span className="text-[11px] font-bold text-vault-roseMuted font-mono">
                -{d.penalty} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-vault-ivoryDark flex items-center justify-between">
        <Link
          href="/security-center"
          className="text-xs font-semibold text-vault-maroon hover:text-vault-maroonLight flex items-center gap-1 group"
        >
          <span>View Full Security Health Center</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <button
          onClick={() => runSecurityAudit()}
          className="text-[11px] font-semibold text-vault-roseDust hover:text-vault-maroon transition-colors cursor-pointer"
        >
          Re-evaluate
        </button>
      </div>
    </div>
  );
}
