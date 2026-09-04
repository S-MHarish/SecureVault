'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import { ActivityLogItem } from '@/lib/types/vault';
import {
  History,
  ShieldCheck,
  KeyRound,
  Lock,
  Eye,
  RefreshCw,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export default function ActivityLogsPage() {
  const { activityLogs } = useVault();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.actionType === filterType;
  });

  const getLogIcon = (type: ActivityLogItem['actionType']) => {
    switch (type) {
      case 'LOGIN':
      case 'LOGOUT':
        return <Lock className="w-4 h-4 text-vault-maroon" />;
      case 'SECURITY_AUDIT':
        return <ShieldCheck className="w-4 h-4 text-vault-maroon" />;
      case 'ACCOUNT_CREATED':
      case 'ACCOUNT_UPDATED':
        return <KeyRound className="w-4 h-4 text-vault-copper" />;
      case 'PASSWORD_VIEWED':
      case 'PASSWORD_COPIED':
        return <Eye className="w-4 h-4 text-vault-copper" />;
      case 'ACCOUNT_DELETED':
        return <Trash2 className="w-4 h-4 text-vault-roseMuted" />;
      case 'TOTP_GENERATED':
        return <Radio className="w-4 h-4 text-vault-copper" />;
      default:
        return <History className="w-4 h-4 text-vault-roseDust" />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
                <History className="w-3.5 h-3.5 text-vault-maroon" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                  Cryptographic Audit Log
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
                Activity & Security Audit Timeline
              </h1>
              <p className="text-xs text-vault-roseDust mt-1">
                Immutable event stream tracking authentication sessions, credential views, rotations, and security scans.
              </p>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 bg-vault-ivory px-3 py-1.5 rounded-xl border border-vault-ivoryDark text-xs self-start md:self-auto">
              <Filter className="w-3.5 h-3.5 text-vault-copper" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-vault-maroon text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Event Types</option>
                <option value="SECURITY_AUDIT">Security Audits</option>
                <option value="LOGIN">Auth & Sessions</option>
                <option value="ACCOUNT_CREATED">Account Created</option>
                <option value="ACCOUNT_UPDATED">Account Updated</option>
                <option value="PASSWORD_COPIED">Password Copied</option>
                <option value="TOTP_GENERATED">TOTP Generated</option>
              </select>
            </div>
          </div>

          {/* Timeline Container */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-vault-ivoryDark bg-white/85 shadow-vault-md space-y-6">
            <div className="relative border-l-2 border-vault-copper/30 ml-4 pl-6 space-y-6">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[35px] top-1 w-8 h-8 rounded-xl bg-vault-blush border border-vault-copper/40 flex items-center justify-center shadow-vault-sm group-hover:scale-110 transition-transform">
                    {getLogIcon(log.actionType)}
                  </div>

                  <div className="p-4 rounded-2xl bg-vault-ivory/60 hover:bg-vault-blush/60 border border-vault-ivoryDark transition-colors space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-vault-maroon">{log.title}</h4>
                      <span className="text-[10px] font-mono text-vault-roseDust">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {log.details && (
                      <p className="text-[11px] text-vault-roseDust leading-relaxed">
                        {log.details}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between text-[10px] text-vault-roseDust border-t border-vault-ivoryDark/60">
                      <span>Device: {log.device || 'Authorized Session'}</span>
                      <span className="font-mono">IP: {log.ipAddress || '127.0.0.1'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
