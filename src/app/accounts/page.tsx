'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import AccountCard from '@/components/accounts/AccountCard';
import AccountDetailModal from '@/components/accounts/AccountDetailModal';
import { useVault } from '@/lib/store/vaultContext';
import { AccountCategory } from '@/lib/types/vault';
import {
  KeyRound,
  Plus,
  Search,
  Tag,
  Grid,
  List,
  ArrowUpDown,
  Filter,
  ShieldCheck,
  Star,
  Clock,
  Radio,
} from 'lucide-react';

const CATEGORIES: (AccountCategory | 'All')[] = [
  'All',
  'Developer',
  'AI Tools',
  'Work',
  'Finance',
  'Social',
  'Education',
  'Personal',
];

const TAGS = [
  'developer',
  'work',
  'finance',
  'ai',
  'important',
  'college',
  'temporary',
  'critical',
];

export default function AccountsPage() {
  const {
    accounts,
    setIsAddAccountOpen,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedTagFilter,
    setSelectedTagFilter,
    setSelectedAccountForModal,
    copyPasswordToClipboard,
  } = useVault();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'strength' | 'rotated' | 'date'>('name');

  // Filtered and Sorted accounts
  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((acc) => {
        // Category Filter
        if (selectedCategoryFilter !== 'All' && acc.category !== selectedCategoryFilter) {
          return false;
        }
        // Tag Filter
        if (selectedTagFilter && !acc.tags.includes(selectedTagFilter)) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = acc.serviceName.toLowerCase().includes(q);
          const matchEmail = acc.email.toLowerCase().includes(q);
          const matchUser = acc.username.toLowerCase().includes(q);
          const matchTags = acc.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchEmail && !matchUser && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.serviceName.localeCompare(b.serviceName);
        if (sortBy === 'strength') return b.strengthScore - a.strengthScore;
        if (sortBy === 'rotated')
          return new Date(b.lastRotated || b.createdAt).getTime() - new Date(a.lastRotated || a.createdAt).getTime();
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [accounts, selectedCategoryFilter, selectedTagFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display text-vault-maroon flex items-center gap-2.5">
                <KeyRound className="w-6 h-6 text-vault-maroon" />
                <span>Encrypted Accounts & Credentials</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-vault-blush text-vault-maroon font-bold font-mono">
                  {filteredAccounts.length} / {accounts.length}
                </span>
              </h1>
              <p className="text-xs text-vault-roseDust mt-1">
                Zero-Knowledge AES-256-GCM authenticated credential repository.
              </p>
            </div>

            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-vault-maroon hover:bg-vault-maroonLight text-vault-cream text-xs font-semibold transition-all shadow-vault-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Credential</span>
            </button>
          </div>

          {/* Filter Bar & Controls */}
          <div className="glass-panel p-4 rounded-2xl border border-vault-ivoryDark bg-white/75 space-y-3">
            {/* Row 1: Search & Toggles */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-vault-copper absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by service name, email, username, or tag..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 bg-vault-ivory px-2.5 py-1.5 rounded-xl border border-vault-ivoryDark text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-vault-copper" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-vault-maroon text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="strength">Sort by Strength</option>
                    <option value="rotated">Sort by Last Rotated</option>
                    <option value="date">Sort by Date Added</option>
                  </select>
                </div>

                {/* Grid / List view toggle */}
                <div className="flex items-center bg-vault-ivory p-1 rounded-xl border border-vault-ivoryDark">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-vault-maroon text-vault-cream shadow-vault-sm'
                        : 'text-vault-roseDust hover:text-vault-maroon'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-vault-maroon text-vault-cream shadow-vault-sm'
                        : 'text-vault-roseDust hover:text-vault-maroon'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider mr-1">
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-vault-maroon text-vault-cream shadow-vault-sm'
                      : 'bg-vault-ivory hover:bg-vault-blush text-vault-maroon border border-vault-ivoryDark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Row 3: Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-vault-ivoryDark/60">
              <span className="text-[11px] font-bold text-vault-roseDust uppercase tracking-wider mr-1">
                Tags:
              </span>
              {selectedTagFilter && (
                <button
                  onClick={() => setSelectedTagFilter(null)}
                  className="px-2 py-0.5 rounded-lg bg-vault-blush text-vault-maroon font-bold text-[10px] border border-vault-copper/30"
                >
                  Clear Tag Filter ✕
                </button>
              )}
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTagFilter(selectedTagFilter === tag ? null : tag)
                  }
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    selectedTagFilter === tag
                      ? 'bg-vault-copper text-vault-cream'
                      : 'bg-white hover:bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark'
                  }`}
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>#{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accounts Rendering: Grid or List */}
          {filteredAccounts.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-vault-ivoryDark bg-white/60 text-center space-y-3">
              <KeyRound className="w-10 h-10 text-vault-copper mx-auto opacity-50" />
              <h3 className="text-base font-bold text-vault-maroon">No credentials match your filters</h3>
              <p className="text-xs text-vault-roseDust max-w-sm mx-auto">
                Try resetting your search query or selecting "All" categories to view all vault accounts.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('All');
                  setSelectedTagFilter(null);
                }}
                className="px-4 py-2 rounded-xl bg-vault-blush text-vault-maroon text-xs font-semibold border border-vault-copper/30"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAccounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="glass-panel rounded-2xl border border-vault-ivoryDark bg-white/80 overflow-hidden shadow-vault-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-vault-ivory/80 text-vault-roseDust uppercase text-[10px] font-bold border-b border-vault-ivoryDark">
                    <tr>
                      <th className="p-3.5">Service</th>
                      <th className="p-3.5">Identity / Email</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Strength</th>
                      <th className="p-3.5">2FA</th>
                      <th className="p-3.5">Passkey</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-vault-ivoryDark/60 text-vault-maroon">
                    {filteredAccounts.map((acc) => (
                      <tr
                        key={acc.id}
                        onClick={() => setSelectedAccountForModal(acc)}
                        className="hover:bg-vault-blush/60 transition-colors cursor-pointer"
                      >
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-vault-blush flex items-center justify-center text-vault-maroon font-bold text-xs">
                            {acc.serviceName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{acc.serviceName}</span>
                        </td>
                        <td className="p-3.5 text-vault-roseDust font-medium truncate max-w-[200px]">
                          {acc.email || acc.username}
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-vault-ivory text-vault-roseDust border border-vault-ivoryDark">
                            {acc.category}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-vault-copper font-mono">
                            {acc.passwordStrength} ({acc.strengthScore})
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[11px] font-semibold">
                            {acc.twoFactorStatus === 'Enabled' ? '✓ Enabled' : '— Missing'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[11px] font-semibold text-vault-roseDust">
                            {acc.passkeyStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPasswordToClipboard(acc);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-vault-blush hover:bg-vault-blushHover text-vault-maroon text-[11px] font-semibold transition-colors border border-vault-copper/25"
                          >
                            Copy Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <AccountDetailModal />
    </div>
  );
}
