export type AccountCategory =
  | 'Developer'
  | 'Work'
  | 'Social'
  | 'Finance'
  | 'AI Tools'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Personal';

export type TwoFactorStatus = 'Enabled' | 'Disabled' | 'Unknown';
export type PasskeyStatus = 'Active' | 'Available' | 'Not Supported';
export type RecoveryStatus = 'Complete' | 'Incomplete' | 'Missing';
export type PasswordStrengthLevel = 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';

export interface CredentialItem {
  id: string;
  serviceName: string;
  websiteUrl: string;
  username: string;
  email: string;
  encryptedPassword: string; // Base64 ciphertext
  iv: string; // Initialization vector for AES-GCM
  category: AccountCategory;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastRotated: string;
  passwordStrength: PasswordStrengthLevel;
  strengthScore: number; // 0 - 100
  twoFactorStatus: TwoFactorStatus;
  totpSecretEncrypted?: string;
  totpIv?: string;
  hasTotpConfigured: boolean;
  passkeyStatus: PasskeyStatus;
  recoveryStatus: RecoveryStatus;
  recoveryEmail?: string;
  recoveryPhone?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  isAbandoned?: boolean; // Last used > 6 months ago
  breachFlag?: {
    isBreached: boolean;
    breachDate?: string;
    details?: string;
    exposedFields?: string[];
  };
}

export interface SecurityScoreBreakdown {
  overallScore: number; // 0 - 100
  totalAccounts: number;
  weakPasswordsCount: number;
  reusedPasswordsCount: number;
  oldCredentialsCount: number; // > 90 days without rotation
  twoFaEnabledCount: number;
  passkeysCount: number;
  unresolvedAlertsCount: number;
  deductions: {
    title: string;
    penalty: number;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    actionText: string;
    actionType: 'rotate' | 'enable_2fa' | 'setup_passkey' | 'resolve_breach' | 'recovery';
    accountId?: string;
  }[];
}

export interface AIAdvisorRecommendation {
  id: string;
  accountId?: string;
  serviceName?: string;
  title: string;
  description: string;
  impactScore: number; // Score increase if applied (+5, +10)
  severity: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  remedyAction: string;
  category: 'password' | '2fa' | 'passkey' | 'breach' | 'recovery';
}

export interface BreachRecord {
  id: string;
  serviceName: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  pwnCount: number;
  description: string;
  exposedData: string[];
  isVerified: boolean;
  recommendedAction: string;
  status: 'active_threat' | 'remediated' | 'acknowledged';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actionType:
    | 'LOGIN'
    | 'LOGOUT'
    | 'ACCOUNT_CREATED'
    | 'ACCOUNT_UPDATED'
    | 'ACCOUNT_DELETED'
    | 'PASSWORD_VIEWED'
    | 'PASSWORD_COPIED'
    | 'SECURITY_AUDIT'
    | 'TOTP_GENERATED'
    | 'EXPORT_VAULT'
    | 'EMERGENCY_ACCESS_UPDATE'
    | 'SETTINGS_CHANGED';
  title: string;
  details?: string;
  ipAddress?: string;
  device?: string;
  status: 'success' | 'warning' | 'danger';
}

export interface EmergencyContact {
  id: string;
  fullName: string;
  email: string;
  relationship: string;
  status: 'Pending' | 'Active' | 'Revoked' | 'Access_Requested';
  waitingPeriodHours: number; // e.g. 48, 72, 168 (7 days)
  requestDate?: string;
  grantDate?: string;
}

export interface VaultState {
  isLocked: boolean;
  isInitialized: boolean;
  masterKeyDerived: boolean;
  autoLockMinutes: number;
  lastActiveTimestamp: number;
  accounts: CredentialItem[];
  activityLogs: ActivityLogItem[];
  emergencyContacts: EmergencyContact[];
  breachRecords: BreachRecord[];
  activeScanState: 'idle' | 'scanning' | 'complete';
  selectedCategoryForFocus: AccountCategory | null;
}
