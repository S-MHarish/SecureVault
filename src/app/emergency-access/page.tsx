'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import { useVault } from '@/lib/store/vaultContext';
import {
  Users2,
  ShieldCheck,
  Clock,
  Plus,
  AlertTriangle,
  UserCheck,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function EmergencyAccessPage() {
  const { emergencyContacts, addEmergencyContact, triggerEmergencyAccessRequest } = useVault();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Partner / Family');
  const [waitingHours, setWaitingHours] = useState(48);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    addEmergencyContact({
      fullName,
      email,
      relationship,
      status: 'Active',
      waitingPeriodHours: waitingHours,
      grantDate: new Date().toISOString().split('T')[0],
    });

    setIsAddOpen(false);
    setFullName('');
    setEmail('');
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
                <Users2 className="w-3.5 h-3.5 text-vault-maroon" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-vault-maroon">
                  Trusted Custodianship
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display text-vault-maroon tracking-tight">
                Emergency Access & Trusted Contacts
              </h1>
              <p className="text-xs text-vault-roseDust mt-1">
                Designate trusted individuals who can request access to your vault after an enforced waiting period.
              </p>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Trusted Contact</span>
            </button>
          </div>

          {/* Policy Information Card */}
          <div className="glass-panel p-6 rounded-3xl border border-vault-ivoryDark bg-gradient-to-r from-white/90 via-vault-blush/40 to-white/90 shadow-vault-sm space-y-3">
            <h3 className="text-sm font-bold text-vault-maroon font-display flex items-center gap-2">
              <Lock className="w-4 h-4 text-vault-copper" />
              <span>How Emergency Access Works: Zero Unrestricted Access</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-vault-roseDust pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-vault-ivoryDark space-y-1">
                <span className="font-bold text-vault-maroon block">1. Explicit Request</span>
                <p>A designated contact submits a cryptographically signed request for vault release.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-vault-ivoryDark space-y-1">
                <span className="font-bold text-vault-maroon block">2. Mandatory Waiting Period</span>
                <p>You receive instant notifications across all devices with a 48h to 7-day cancellation window.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-vault-ivoryDark space-y-1">
                <span className="font-bold text-vault-maroon block">3. One-Click Revocation</span>
                <p>If you decline or check in during the waiting period, the access request is instantly revoked.</p>
              </div>
            </div>
          </div>

          {/* Add Contact Modal Form */}
          {isAddOpen && (
            <div className="glass-panel p-6 rounded-3xl border border-vault-copper/40 bg-white shadow-vault-md space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-vault-maroon">Designate New Emergency Contact</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="p-2.5 rounded-xl glass-input text-xs"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contact Email Address"
                    className="p-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="Relationship (e.g. Spouse, Attorney)"
                    className="p-2.5 rounded-xl glass-input text-xs"
                  />
                  <select
                    value={waitingHours}
                    onChange={(e) => setWaitingHours(Number(e.target.value))}
                    className="p-2.5 rounded-xl glass-input text-xs font-semibold"
                  >
                    <option value={48}>48 Hours Waiting Period</option>
                    <option value={72}>72 Hours (3 Days)</option>
                    <option value={168}>168 Hours (7 Days)</option>
                    <option value={336}>336 Hours (14 Days)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-xl bg-vault-ivory text-vault-roseDust text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-vault-maroon text-vault-cream text-xs font-semibold"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Contacts List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-vault-maroon uppercase tracking-wider">
              Active Designated Contacts ({emergencyContacts.length})
            </h3>

            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-5 rounded-2xl glass-panel bg-white/85 border border-vault-ivoryDark flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-vault-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-sm">
                    {contact.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-vault-maroon">{contact.fullName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark font-medium">
                        {contact.relationship}
                      </span>
                    </div>
                    <span className="text-xs text-vault-roseDust font-mono">{contact.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="text-vault-roseDust block text-[10px] font-bold uppercase">
                      Waiting Period:
                    </span>
                    <span className="font-semibold text-vault-maroon font-mono">
                      {contact.waitingPeriodHours} Hours
                    </span>
                  </div>

                  {contact.status === 'Access_Requested' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-vault-roseMuted text-vault-cream text-xs font-bold animate-pulse">
                      Access Requested (Waiting...)
                    </span>
                  ) : (
                    <button
                      onClick={() => triggerEmergencyAccessRequest(contact.id)}
                      className="px-3 py-1.5 rounded-xl bg-vault-ivory hover:bg-vault-blush text-vault-maroon text-xs font-semibold border border-vault-copper/25 transition-colors"
                    >
                      Simulate Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
