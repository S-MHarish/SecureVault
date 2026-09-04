'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  KeyRound,
  MailSearch,
  Sparkles,
  RefreshCw,
  Fingerprint,
  ShieldAlert,
  GitFork,
  LifeBuoy,
  Users2,
  History,
  Laptop,
  Settings,
  Lock,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useVault } from '@/lib/store/vaultContext';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'All Accounts', href: '/accounts', icon: KeyRound },
  { name: 'Email Identity Map', href: '/email-lookup', icon: MailSearch, badge: 'Key' },
  { name: 'AI Security Center', href: '/security-center', icon: Sparkles },
  { name: 'Password Generator', href: '/generator', icon: RefreshCw },
  { name: '2FA Authenticator', href: '/authenticator', icon: ShieldCheck, badge: 'Live' },
  { name: 'Passkey Readiness', href: '/passkeys', icon: Fingerprint },
  { name: 'Breach Monitor', href: '/breach-monitor', icon: ShieldAlert, badgeAlert: true },
  { name: 'Identity Graph', href: '/relationship-graph', icon: GitFork },
  { name: 'Recovery Center', href: '/recovery', icon: LifeBuoy },
  { name: 'Emergency Access', href: '/emergency-access', icon: Users2 },
  { name: 'Activity Log', href: '/activity-logs', icon: History },
  { name: 'Browser Extension', href: '/extension', icon: Laptop },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { lockVault, setIsAddAccountOpen, securityScore, breachRecords } = useVault();

  const activeBreachesCount = breachRecords.filter((b) => b.status === 'active_threat').length;

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between p-4 glass-panel border-r border-vault-ivoryDark bg-vault-cream/85 backdrop-blur-xl z-30 select-none">
      {/* Top Branding */}
      <div>
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-vault-maroon to-vault-roseDust flex items-center justify-center shadow-vault-md group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-vault-cream" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-vault-maroon tracking-tight block leading-tight">
              SecureVault <span className="text-vault-copper text-xs font-semibold uppercase tracking-wider">AI</span>
            </span>
            <span className="text-[11px] text-vault-roseDust font-medium block">
              Zero-Knowledge Identity
            </span>
          </div>
        </Link>

        {/* Quick Add Action */}
        <button
          onClick={() => setIsAddAccountOpen(true)}
          className="w-full py-2.5 px-3.5 mb-5 rounded-xl bg-gradient-to-r from-vault-maroon to-vault-maroonLight hover:from-vault-maroonLight hover:to-vault-roseMuted text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Credential</span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-vault-blush text-vault-maroon font-semibold shadow-vault-sm border border-vault-copper/25'
                    : 'text-vault-maroon/80 hover:bg-vault-ivory/60 hover:text-vault-maroon'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-vault-maroon' : 'text-vault-copper group-hover:text-vault-maroon'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-vault-copperLight/20 text-vault-maroon border border-vault-copper/20">
                    {item.badge}
                  </span>
                )}

                {item.badgeAlert && activeBreachesCount > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-vault-roseMuted text-vault-cream">
                    {activeBreachesCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Vault Health & Lock Bar */}
      <div className="pt-3 border-t border-vault-ivoryDark">
        {/* Security Score Widget */}
        <Link
          href="/security-center"
          className="flex items-center justify-between p-2.5 rounded-xl bg-vault-ivory/80 hover:bg-vault-blush border border-vault-copper/20 transition-all mb-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs">
              {securityScore.overallScore}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-vault-maroon leading-tight">Vault Score</p>
              <p className="text-[9px] text-vault-roseDust">AI Audited</p>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-vault-roseDust" />
        </Link>

        {/* Lock Vault Button */}
        <button
          onClick={lockVault}
          className="w-full py-2 px-3 rounded-lg border border-vault-copper/30 bg-vault-cream hover:bg-vault-blush text-vault-maroon text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-vault-copper" />
          <span>Lock Vault Session</span>
        </button>
      </div>
    </aside>
  );
}
