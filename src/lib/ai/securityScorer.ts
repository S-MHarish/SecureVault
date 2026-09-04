import { CredentialItem, SecurityScoreBreakdown, BreachRecord } from '../types/vault';

export function calculateSecurityScore(
  accounts: CredentialItem[],
  breaches: BreachRecord[] = []
): SecurityScoreBreakdown {
  if (!accounts || accounts.length === 0) {
    return {
      overallScore: 100,
      totalAccounts: 0,
      weakPasswordsCount: 0,
      reusedPasswordsCount: 0,
      oldCredentialsCount: 0,
      twoFaEnabledCount: 0,
      passkeysCount: 0,
      unresolvedAlertsCount: 0,
      deductions: [],
    };
  }

  let totalScore = 100;
  const deductions: SecurityScoreBreakdown['deductions'] = [];

  let weakCount = 0;
  let oldCredentialsCount = 0;
  let twoFaEnabledCount = 0;
  let passkeysCount = 0;

  const now = new Date().getTime();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  // 1. Weak Passwords check
  accounts.forEach((acc) => {
    if (acc.passwordStrength === 'Weak' || acc.strengthScore < 40) {
      weakCount++;
      deductions.push({
        title: `Weak password on ${acc.serviceName}`,
        penalty: 6,
        description: `The password for ${acc.serviceName} has low entropy and is vulnerable to brute-force attacks.`,
        severity: 'high',
        actionText: 'Update to strong password',
        actionType: 'rotate',
        accountId: acc.id,
      });
    }

    // 2. Old Credentials check
    const lastRotatedTime = new Date(acc.lastRotated || acc.createdAt).getTime();
    if (now - lastRotatedTime > ninetyDaysMs) {
      oldCredentialsCount++;
    }

    // 3. 2FA check
    if (acc.twoFactorStatus === 'Enabled') {
      twoFaEnabledCount++;
    }

    // 4. Passkey check
    if (acc.passkeyStatus === 'Active') {
      passkeysCount++;
    }
  });

  // Reused passwords count
  // In a real zero-knowledge environment, the client hashes passwords locally with a vault-salt to detect duplicates
  // For simulated items, we check accounts that share same strengthScore/length/marker
  const reusedAccounts = accounts.filter(
    (acc, idx, self) =>
      self.some((other, oIdx) => oIdx !== idx && other.encryptedPassword === acc.encryptedPassword) ||
      (acc.notes?.includes('reused') ?? false)
  );
  const reusedPasswordsCount = reusedAccounts.length;

  if (reusedPasswordsCount > 0) {
    deductions.push({
      title: `${reusedPasswordsCount} Reused Passwords Detected`,
      penalty: Math.min(20, reusedPasswordsCount * 4),
      description: 'Using identical passwords across multiple services exposes all linked accounts if one is compromised.',
      severity: 'critical',
      actionText: 'Generate unique passwords',
      actionType: 'rotate',
    });
  }

  if (oldCredentialsCount > 0) {
    deductions.push({
      title: `${oldCredentialsCount} Credentials Not Rotated in 90+ Days`,
      penalty: Math.min(10, oldCredentialsCount * 2),
      description: 'Rotating important credentials periodically mitigates silent historical exposures.',
      severity: 'medium',
      actionText: 'Review and rotate',
      actionType: 'rotate',
    });
  }

  // 2FA Missing deduction
  const accountsWithout2FA = accounts.filter(a => a.twoFactorStatus !== 'Enabled');
  if (accountsWithout2FA.length > 0) {
    const penalty = Math.min(15, accountsWithout2FA.length * 2);
    deductions.push({
      title: `${accountsWithout2FA.length} Accounts Lack Two-Factor Authentication`,
      penalty,
      description: '2FA adds a critical second line of defense against credential stuffing.',
      severity: 'high',
      actionText: 'Enable 2FA / TOTP',
      actionType: 'enable_2fa',
    });
  }

  // Passkey upgrade opportunities
  const passkeyEligible = accounts.filter(a => a.passkeyStatus === 'Available');
  if (passkeyEligible.length > 0) {
    deductions.push({
      title: `${passkeyEligible.length} Accounts Support Phishing-Resistant Passkeys`,
      penalty: Math.min(8, passkeyEligible.length * 1),
      description: 'Passkeys replace passwords with cryptographic hardware keys that cannot be phished.',
      severity: 'low',
      actionText: 'Upgrade to Passkeys',
      actionType: 'setup_passkey',
    });
  }

  // Breach Alerts check
  const activeBreaches = breaches.filter(b => b.status === 'active_threat');
  if (activeBreaches.length > 0) {
    deductions.push({
      title: `${activeBreaches.length} Active Identity Breach Alert`,
      penalty: 12,
      description: `Data breach detected for domain(s): ${activeBreaches.map(b => b.serviceName).join(', ')}.`,
      severity: 'critical',
      actionText: 'Review Breach Details',
      actionType: 'resolve_breach',
    });
  }

  // Calculate penalties sum
  const totalPenalties = deductions.reduce((sum, d) => sum + d.penalty, 0);
  totalScore = Math.max(15, Math.min(100, 100 - totalPenalties));

  return {
    overallScore: totalScore,
    totalAccounts: accounts.length,
    weakPasswordsCount: weakCount,
    reusedPasswordsCount,
    oldCredentialsCount,
    twoFaEnabledCount,
    passkeysCount,
    unresolvedAlertsCount: activeBreaches.length,
    deductions,
  };
}
