'use client';

import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Clock,
  Star,
  Eye,
  EyeOff,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { CredentialItem } from '@/lib/types/vault';
import { useVault } from '@/lib/store/vaultContext';

interface AccountCardProps {
  account: CredentialItem;
}

export default function AccountCard({ account }: AccountCardProps) {
  const { copyPasswordToClipboard, setSelectedAccountForModal, deleteAccount } = useVault();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyPasswordToClipboard(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthBadge = () => {
    switch (account.passwordStrength) {
      case 'Very Strong':
      case 'Strong':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vault-blush text-vault-maroon border border-vault-copper/30">
            {account.passwordStrength} ({account.strengthScore})
          </span>
        );
      case 'Good':
      case 'Fair':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vault-ivory text-vault-copper border border-vault-copper/30">
            {account.passwordStrength} ({account.strengthScore})
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vault-blush text-vault-roseMuted border border-vault-roseDust">
            Weak ({account.strengthScore})
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => setSelectedAccountForModal(account)}
      className="glass-panel p-5 rounded-2xl border border-vault-ivoryDark bg-white/75 glass-panel-hover flex flex-col justify-between cursor-pointer group relative"
    >
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-vault-blush to-vault-ivory border border-vault-copper/30 flex items-center justify-center text-vault-maroon font-display font-bold text-sm shadow-vault-sm group-hover:scale-105 transition-transform">
              {account.serviceName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-vault-maroon group-hover:text-vault-maroonLight transition-colors">
                  {account.serviceName}
                </h4>
                {account.isFavorite && (
                  <Star className="w-3.5 h-3.5 text-vault-copper fill-vault-copper" />
                )}
              </div>
              <span className="text-[11px] text-vault-roseDust flex items-center gap-1">
                {account.category}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark">
            {account.category}
          </span>
        </div>

        {/* Identity Details */}
        <div className="space-y-1.5 my-3 text-xs">
          <div className="flex items-center justify-between text-vault-maroon/90">
            <span className="text-vault-roseDust text-[11px]">Email / User:</span>
            <span className="font-medium truncate max-w-[170px]" title={account.email || account.username}>
              {account.email || account.username}
            </span>
          </div>

          {/* Encrypted Password Line */}
          <div className="flex items-center justify-between bg-vault-ivory/60 p-2 rounded-xl border border-vault-ivoryDark">
            <span className="text-vault-roseDust text-[11px] font-mono">••••••••••••</span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-white text-vault-maroon transition-all flex items-center gap-1 text-[11px] font-semibold"
              title="Copy Decrypted Password"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-vault-maroon" />
                  <span className="text-[10px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-vault-copper" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Badges Row */}
        <div className="flex items-center gap-1.5 flex-wrap my-3">
          {getStrengthBadge()}

          {account.twoFactorStatus === 'Enabled' ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vault-blush text-vault-maroon border border-vault-copper/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>2FA</span>
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-vault-ivory text-vault-roseDust flex items-center gap-1">
              <span>No 2FA</span>
            </span>
          )}

          {account.passkeyStatus === 'Active' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-vault-blush text-vault-maroon border border-vault-copper/30 flex items-center gap-1">
              <Fingerprint className="w-3 h-3" />
              <span>Passkey</span>
            </span>
          )}

          {account.hasTotpConfigured && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-vault-copperLight/20 text-vault-maroon">
              TOTP
            </span>
          )}
        </div>

        {/* Tags */}
        {account.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-2">
            {account.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded bg-white text-vault-roseDust border border-vault-ivoryDark flex items-center gap-0.5"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-vault-ivoryDark/60 flex items-center justify-between text-[10px] text-vault-roseDust">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Rotated: {new Date(account.lastRotated || account.createdAt).toLocaleDateString()}
        </span>
        <span className="text-vault-maroon font-semibold group-hover:underline flex items-center gap-0.5">
          Details
        </span>
      </div>
    </div>
  );
}
