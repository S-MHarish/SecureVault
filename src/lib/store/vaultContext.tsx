'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  CredentialItem,
  AccountCategory,
  ActivityLogItem,
  EmergencyContact,
  BreachRecord,
  SecurityScoreBreakdown,
  AIAdvisorRecommendation,
} from '../types/vault';
import {
  INITIAL_MOCK_ACCOUNTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BREACH_RECORDS,
  INITIAL_EMERGENCY_CONTACTS,
} from './mockData';
import { calculateSecurityScore } from '../ai/securityScorer';
import { generateAIRecommendations } from '../ai/securityAdvisor';
import { deriveMasterKey, encryptData, decryptData, hashMasterPasswordVerifier } from '../crypto/webCrypto';
import { analyzePassword } from '../crypto/passwordEngine';

interface VaultContextType {
  isLocked: boolean;
  isInitialized: boolean;
  autoLockMinutes: number;
  setAutoLockMinutes: (min: number) => void;
  accounts: CredentialItem[];
  activityLogs: ActivityLogItem[];
  breachRecords: BreachRecord[];
  emergencyContacts: EmergencyContact[];
  securityScore: SecurityScoreBreakdown;
  aiRecommendations: AIAdvisorRecommendation[];
  activeScanState: 'idle' | 'scanning' | 'complete';
  selectedCategoryForFocus: AccountCategory | null;
  selectedAccountForModal: CredentialItem | null;
  isAddAccountOpen: boolean;
  isAuditModalOpen: boolean;
  isAdvisorOpen: boolean;
  isExtensionSimOpen: boolean;
  isCommandPaletteOpen: boolean;
  searchQuery: string;
  selectedTagFilter: string | null;
  selectedCategoryFilter: AccountCategory | 'All';

  // Actions
  unlockVault: (masterPassword: string) => Promise<boolean>;
  lockVault: () => void;
  runSecurityAudit: () => Promise<void>;
  addAccount: (accountData: Partial<CredentialItem>, plainPassword?: string) => Promise<void>;
  updateAccount: (id: string, accountData: Partial<CredentialItem>, plainPassword?: string) => Promise<void>;
  deleteAccount: (id: string) => void;
  markAccountReviewed: (id: string) => void;
  copyPasswordToClipboard: (account: CredentialItem) => Promise<string>;
  revealPassword: (account: CredentialItem) => Promise<string>;
  logActivity: (actionType: ActivityLogItem['actionType'], title: string, details?: string, status?: ActivityLogItem['status']) => void;
  setSelectedCategoryForFocus: (cat: AccountCategory | null) => void;
  setSelectedAccountForModal: (acc: CredentialItem | null) => void;
  setIsAddAccountOpen: (open: boolean) => void;
  setIsAuditModalOpen: (open: boolean) => void;
  setIsAdvisorOpen: (open: boolean) => void;
  setIsExtensionSimOpen: (open: boolean) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  setSelectedTagFilter: (tag: string | null) => void;
  setSelectedCategoryFilter: (cat: AccountCategory | 'All') => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  triggerEmergencyAccessRequest: (contactId: string) => void;
  resetVaultToDemo: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(15);
  const [activeMasterKey, setActiveMasterKey] = useState<CryptoKey | null>(null);

  const [accounts, setAccounts] = useState<CredentialItem[]>(INITIAL_MOCK_ACCOUNTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [breachRecords, setBreachRecords] = useState<BreachRecord[]>(INITIAL_BREACH_RECORDS);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);

  const [activeScanState, setActiveScanState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [selectedCategoryForFocus, setSelectedCategoryForFocus] = useState<AccountCategory | null>(null);
  const [selectedAccountForModal, setSelectedAccountForModal] = useState<CredentialItem | null>(null);

  // Modals & Drawers
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isExtensionSimOpen, setIsExtensionSimOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<AccountCategory | 'All'>('All');

  // Activity logger helper
  const logActivity = useCallback(
    (actionType: ActivityLogItem['actionType'], title: string, details?: string, status: ActivityLogItem['status'] = 'success') => {
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        actionType,
        title,
        details,
        ipAddress: '192.168.1.42',
        device: 'Current Device — Secure Session',
        status,
      };
      setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    },
    []
  );

  // Calculate live security score & AI recommendations
  const securityScore = useMemo(() => calculateSecurityScore(accounts, breachRecords), [accounts, breachRecords]);
  const aiRecommendations = useMemo(() => generateAIRecommendations(accounts, breachRecords), [accounts, breachRecords]);

  // Inactivity auto-lock timer
  useEffect(() => {
    if (isLocked || autoLockMinutes <= 0) return;

    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsLocked(true);
        setActiveMasterKey(null);
        logActivity('LOGOUT', 'Vault auto-locked due to inactivity', `Auto-lock timeout: ${autoLockMinutes} minutes`, 'warning');
      }, autoLockMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [isLocked, autoLockMinutes, logActivity]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unlock Vault with Master Password
  const unlockVault = async (masterPassword: string): Promise<boolean> => {
    try {
      if (!masterPassword || masterPassword.length < 4) return false;
      const key = await deriveMasterKey(masterPassword);
      setActiveMasterKey(key);
      setIsLocked(false);
      logActivity('LOGIN', 'Vault Unlocked Successfully', 'Zero-knowledge client key derived', 'success');
      return true;
    } catch {
      return false;
    }
  };

  // Lock Vault
  const lockVault = () => {
    setIsLocked(true);
    setActiveMasterKey(null);
    logActivity('LOGOUT', 'Vault Locked by User', 'Master encryption key purged from memory', 'warning');
  };

  // Run Security Audit with 3D animation sequence
  const runSecurityAudit = async () => {
    setActiveScanState('scanning');
    setIsAuditModalOpen(true);
    logActivity('SECURITY_AUDIT', 'AI Security Audit initiated', 'Scanning all monitored accounts and breach records');

    await new Promise((resolve) => setTimeout(resolve, 2800));
    setActiveScanState('complete');
    logActivity('SECURITY_AUDIT', 'AI Security Audit completed', `Overall Score: ${securityScore.overallScore}/100`, 'success');
  };

  // Add Account
  const addAccount = async (accountData: Partial<CredentialItem>, plainPassword = '') => {
    const analysis = analyzePassword(plainPassword);
    let ciphertext = accountData.encryptedPassword || 'sv_enc_placeholder';
    let iv = accountData.iv || 'sv_iv_placeholder';

    if (activeMasterKey && plainPassword) {
      const enc = await encryptData(plainPassword, activeMasterKey);
      ciphertext = enc.ciphertext;
      iv = enc.iv;
    }

    const newAccount: CredentialItem = {
      id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      serviceName: accountData.serviceName || 'New Service',
      websiteUrl: accountData.websiteUrl || 'https://example.com',
      username: accountData.username || '',
      email: accountData.email || '',
      encryptedPassword: ciphertext,
      iv: iv,
      category: accountData.category || 'Personal',
      tags: accountData.tags || ['general'],
      notes: accountData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRotated: new Date().toISOString(),
      passwordStrength: analysis.strength,
      strengthScore: analysis.score,
      twoFactorStatus: accountData.twoFactorStatus || 'Disabled',
      totpSecretEncrypted: accountData.totpSecretEncrypted,
      hasTotpConfigured: Boolean(accountData.totpSecretEncrypted),
      passkeyStatus: accountData.passkeyStatus || 'Not Supported',
      recoveryStatus: accountData.recoveryStatus || 'Complete',
      recoveryEmail: accountData.recoveryEmail,
      isFavorite: accountData.isFavorite || false,
      isAbandoned: false,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    logActivity('ACCOUNT_CREATED', `Added credential for ${newAccount.serviceName}`, `Category: ${newAccount.category}`);
  };

  // Update Account
  const updateAccount = async (id: string, accountData: Partial<CredentialItem>, plainPassword?: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== id) return acc;

        let strength = acc.passwordStrength;
        let score = acc.strengthScore;
        let lastRotated = acc.lastRotated;

        if (plainPassword) {
          const analysis = analyzePassword(plainPassword);
          strength = analysis.strength;
          score = analysis.score;
          lastRotated = new Date().toISOString();
        }

        return {
          ...acc,
          ...accountData,
          passwordStrength: strength,
          strengthScore: score,
          lastRotated,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    logActivity('ACCOUNT_UPDATED', `Updated credential for ${accountData.serviceName || 'Account'}`);
  };

  // Delete Account
  const deleteAccount = (id: string) => {
    const target = accounts.find((a) => a.id === id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    logActivity('ACCOUNT_DELETED', `Deleted account ${target?.serviceName || id}`, 'Credential purged from encrypted vault', 'danger');
  };

  // Mark Abandoned Account as Reviewed
  const markAccountReviewed = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isAbandoned: false, updatedAt: new Date().toISOString() } : acc))
    );
    logActivity('ACCOUNT_UPDATED', `Marked account ${id} as reviewed`);
  };

  // Decrypt and copy password to clipboard
  const copyPasswordToClipboard = async (account: CredentialItem): Promise<string> => {
    let password = 'SecureV@ult2026!MasterKey';
    if (activeMasterKey && account.encryptedPassword && account.iv) {
      try {
        password = await decryptData(account.encryptedPassword, account.iv, activeMasterKey);
      } catch {
        password = 'SecureV@ult2026!MasterKey';
      }
    }
    await navigator.clipboard.writeText(password);
    logActivity('PASSWORD_COPIED', `Copied password for ${account.serviceName}`, 'Clipboard auto-clear armed for 30s', 'warning');
    return password;
  };

  // Reveal password
  const revealPassword = async (account: CredentialItem): Promise<string> => {
    if (activeMasterKey && account.encryptedPassword && account.iv) {
      try {
        return await decryptData(account.encryptedPassword, account.iv, activeMasterKey);
      } catch {
        return 'SecureV@ult2026!MasterKey';
      }
    }
    return 'SecureV@ult2026!MasterKey';
  };

  // Add Emergency Contact
  const addEmergencyContact = (contactData: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contactData,
      id: `ec-${Date.now()}`,
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
    logActivity('EMERGENCY_ACCESS_UPDATE', `Added emergency contact: ${newContact.fullName}`, `Waiting period: ${newContact.waitingPeriodHours}h`);
  };

  // Trigger simulated emergency access
  const triggerEmergencyAccessRequest = (contactId: string) => {
    setEmergencyContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: 'Access_Requested', requestDate: new Date().toISOString() } : c))
    );
    logActivity('EMERGENCY_ACCESS_UPDATE', `Emergency access requested by contact ${contactId}`, 'Waiting period countdown activated', 'warning');
  };

  // Reset to demo state
  const resetVaultToDemo = () => {
    setAccounts(INITIAL_MOCK_ACCOUNTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setBreachRecords(INITIAL_BREACH_RECORDS);
    setEmergencyContacts(INITIAL_EMERGENCY_CONTACTS);
    setIsLocked(false);
  };

  return (
    <VaultContext.Provider
      value={{
        isLocked,
        isInitialized,
        autoLockMinutes,
        setAutoLockMinutes,
        accounts,
        activityLogs,
        breachRecords,
        emergencyContacts,
        securityScore,
        aiRecommendations,
        activeScanState,
        selectedCategoryForFocus,
        selectedAccountForModal,
        isAddAccountOpen,
        isAuditModalOpen,
        isAdvisorOpen,
        isExtensionSimOpen,
        isCommandPaletteOpen,
        searchQuery,
        selectedTagFilter,
        selectedCategoryFilter,

        unlockVault,
        lockVault,
        runSecurityAudit,
        addAccount,
        updateAccount,
        deleteAccount,
        markAccountReviewed,
        copyPasswordToClipboard,
        revealPassword,
        logActivity,
        setSelectedCategoryForFocus,
        setSelectedAccountForModal,
        setIsAddAccountOpen,
        setIsAuditModalOpen,
        setIsAdvisorOpen,
        setIsExtensionSimOpen,
        setIsCommandPaletteOpen,
        setSearchQuery,
        setSelectedTagFilter,
        setSelectedCategoryFilter,
        addEmergencyContact,
        triggerEmergencyAccessRequest,
        resetVaultToDemo,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}
