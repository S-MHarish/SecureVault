'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

export default function BreachMonitorPage() {
  const { breachRecords, logActivity } = useVault();
  const [breaches, setBreaches] = useState(breachRecords);
  const [isScanning, setIsScanning] = useState(false);

  const activeThreats = breaches.filter((b) => b.status === 'active_threat');
  const remediated = breaches.filter((b) => b.status === 'remediated');

  const handleRemediate = (id: string) => {
    setBreaches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'remediated' } : b))
    );
    logActivity('SECURITY_AUDIT', `Remediated identity breach threat for record ${id}`);
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      logActivity('SECURITY_AUDIT', 'Identity breach database scan completed', 'Checked 14,000,000+ threat records');
    }, 1800);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vault-blush border border-vault-copper/30 shadow-vault-sm mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-vault-roseMuted" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                  Threat Intelligence Telemetry
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
                Dark Web & Identity Breach Monitor
              </h1>
              <p className="text-xs text-vault-roseDust mt-1">
                Continuous telemetry monitoring against verified external data dumps. Plaintext passwords are never retrieved or stored.
              </p>
            </div>

            <button
              onClick={handleScan}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start md:self-auto"
            >
              {isScanning ? (
                <>
                  <span className="w-4 h-4 border-2 border-vault-cream border-t-transparent rounded-full animate-spin" />
                  <span>Scanning Threat Feeds...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-vault-cream" />
                  <span>Check Latest Feeds</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Threat Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Active Breach Threats
              </span>
              <span className="text-3xl font-extrabold text-vault-roseMuted font-display">
                {activeThreats.length}
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Require immediate credential rotation</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Remediated Incidents
              </span>
              <span className="text-3xl font-extrabold text-vault-maroon font-display">
                {remediated.length}
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">Password changed & account secured</p>
            </div>

            <div className="p-5 rounded-2xl glass-panel bg-white/80 border border-vault-ivoryDark">
              <span className="text-[10px] font-bold text-vault-roseDust uppercase tracking-wider block mb-1">
                Monitored Identities
              </span>
              <span className="text-3xl font-extrabold text-vault-maroon font-display">
                2 Emails
              </span>
              <p className="text-[11px] text-vault-roseDust mt-0.5">alex.vanguard@gmail.com + work alias</p>
            </div>
          </div>

          {/* Active Threats Feed */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-vault-maroon uppercase tracking-wider">
              Identified Security Incident Telemetry
            </h3>

            <div className="space-y-4">
              {breaches.map((breach) => (
                <div
                  key={breach.id}
                  className={`p-6 rounded-3xl glass-panel border transition-all ${
                    breach.status === 'active_threat'
                      ? 'border-vault-copper/50 bg-gradient-to-r from-vault-blush/80 to-white shadow-vault-md'
                      : 'border-vault-ivoryDark bg-white/70 opacity-80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-vault-maroon flex items-center justify-center text-vault-cream font-bold text-sm shadow-vault-sm">
                        {breach.status === 'active_threat' ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-vault-cream" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-vault-maroon">{breach.serviceName}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark">
                            {breach.domain}
                          </span>
                        </div>
                        <span className="text-xs text-vault-roseDust">
                          Incident Date: {breach.breachDate} · {(breach.pwnCount / 1000000).toFixed(1)}M accounts exposed
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full self-start md:self-auto ${
                        breach.status === 'active_threat'
                          ? 'bg-vault-roseMuted text-vault-cream'
                          : 'bg-vault-blush text-vault-maroon border border-vault-copper/30'
                      }`}
                    >
                      {breach.status === 'active_threat' ? 'Action Required 🚨' : 'Remediated ✓'}
                    </span>
                  </div>

                  <p className="text-xs text-vault-roseDust leading-relaxed mb-4">
                    {breach.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-white border border-vault-ivoryDark flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-vault-roseDust uppercase block mb-1">
                        Exposed Data Categories:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {breach.exposedData.map((d) => (
                          <span
                            key={d}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-vault-ivory text-vault-maroon border border-vault-ivoryDark font-medium"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {breach.status === 'active_threat' ? (
                        <button
                          onClick={() => handleRemediate(breach.id)}
                          className="px-4 py-2 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-colors"
                        >
                          Mark as Password Changed
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-vault-maroon">
                          Safeguarded
                        </span>
                      )}
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
