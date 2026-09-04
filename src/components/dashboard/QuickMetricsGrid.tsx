'use client';

import React from 'react';
import Link from 'next/link';
import {
  KeyRound,
  AlertOctagon,
  Copy,
  ShieldCheck,
  Fingerprint,
  Clock,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

export default function QuickMetricsGrid() {
  const { securityScore, accounts, breachRecords } = useVault();

  const metrics = [
    {
      title: 'Total Accounts',
      value: accounts.length,
      subtitle: `${accounts.filter((a) => a.isFavorite).length} marked critical`,
      icon: KeyRound,
      href: '/accounts',
      color: 'text-vault-maroon',
      bg: 'bg-vault-blush',
    },
    {
      title: 'Weak Passwords',
      value: securityScore.weakPasswordsCount,
      subtitle: 'Low entropy detected',
      icon: AlertOctagon,
      href: '/security-center',
      color: securityScore.weakPasswordsCount > 0 ? 'text-vault-roseMuted' : 'text-vault-maroon',
      bg: 'bg-vault-blush',
      alert: securityScore.weakPasswordsCount > 0,
    },
    {
      title: 'Reused Passwords',
      value: securityScore.reusedPasswordsCount,
      subtitle: 'Across multiple services',
      icon: Copy,
      href: '/security-center',
      color: securityScore.reusedPasswordsCount > 0 ? 'text-vault-roseMuted' : 'text-vault-maroon',
      bg: 'bg-vault-blush',
      alert: securityScore.reusedPasswordsCount > 0,
    },
    {
      title: '2FA Enabled',
      value: `${securityScore.twoFaEnabledCount} / ${accounts.length}`,
      subtitle: `${Math.round((securityScore.twoFaEnabledCount / (accounts.length || 1)) * 100)}% coverage`,
      icon: ShieldCheck,
      href: '/authenticator',
      color: 'text-vault-maroon',
      bg: 'bg-vault-blush',
    },
    {
      title: 'Passkeys Active',
      value: securityScore.passkeysCount,
      subtitle: `${accounts.filter((a) => a.passkeyStatus === 'Available').length} services ready`,
      icon: Fingerprint,
      href: '/passkeys',
      color: 'text-vault-maroon',
      bg: 'bg-vault-blush',
    },
    {
      title: 'Old Credentials',
      value: securityScore.oldCredentialsCount,
      subtitle: '>90 days without rotation',
      icon: Clock,
      href: '/security-center',
      color: 'text-vault-copper',
      bg: 'bg-vault-blush',
    },
    {
      title: 'Security Alerts',
      value: breachRecords.filter((b) => b.status === 'active_threat').length,
      subtitle: 'External database alerts',
      icon: ShieldAlert,
      href: '/breach-monitor',
      color: breachRecords.some((b) => b.status === 'active_threat') ? 'text-vault-roseMuted' : 'text-vault-maroon',
      bg: 'bg-vault-blush',
      alert: breachRecords.some((b) => b.status === 'active_threat'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Link
            key={m.title}
            href={m.href}
            className="glass-panel p-4 rounded-2xl border border-vault-ivoryDark bg-white/75 glass-panel-hover flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center text-vault-maroon`}>
                  <Icon className="w-4 h-4 text-vault-maroon" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-vault-roseDust opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className={`text-xl font-bold font-display ${m.color}`}>
                {m.value}
              </div>
              <p className="text-xs font-semibold text-vault-maroon leading-tight mt-0.5">
                {m.title}
              </p>
            </div>

            <p className="text-[10px] text-vault-roseDust mt-2 border-t border-vault-ivoryDark/60 pt-2 line-clamp-1">
              {m.subtitle}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
