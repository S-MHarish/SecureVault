import { PasswordStrengthLevel } from '../types/vault';

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghjkmnpqrstuvwxyz';
const NUMBERS = '23456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const WORDS = [
  'vault', 'shield', 'cipher', 'quantum', 'ember', 'glacier', 'falcon', 'nebula',
  'aurora', 'beacon', 'copper', 'granite', 'harbor', 'island', 'matrix', 'orbital',
  'phoenix', 'quartz', 'solace', 'titan', 'vector', 'zenith', 'canyon', 'forest',
  'monarch', 'plasma', 'radiant', 'shadow', 'summit', 'timber', 'valiant', 'whisper'
];

export interface GeneratorOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  mode: 'random' | 'passphrase' | 'pronounceable';
  wordCount?: number;
  separator?: string;
}

export function generatePassword(options: GeneratorOptions): string {
  if (options.mode === 'passphrase') {
    const count = options.wordCount || 4;
    const sep = options.separator || '-';
    const chosen: string[] = [];
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);
    for (let i = 0; i < count; i++) {
      const idx = array[i] % WORDS.length;
      chosen.push(WORDS[idx]);
    }
    return chosen.join(sep);
  }

  if (options.mode === 'pronounceable') {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnprstvwz';
    let result = '';
    const array = new Uint8Array(options.length);
    crypto.getRandomValues(array);
    for (let i = 0; i < options.length; i++) {
      if (i % 2 === 0) {
        result += consonants[array[i] % consonants.length];
      } else {
        result += vowels[array[i] % vowels.length];
      }
    }
    // Capitalize first letter and append a random number
    return result.charAt(0).toUpperCase() + result.slice(1, -1) + (array[0] % 10);
  }

  let charset = '';
  if (options.useUppercase) charset += UPPERCASE;
  if (options.useLowercase) charset += LOWERCASE;
  if (options.useNumbers) charset += NUMBERS;
  if (options.useSymbols) charset += SYMBOLS;

  if (!charset) charset = LOWERCASE + NUMBERS;

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}

export interface PasswordAnalysis {
  strength: PasswordStrengthLevel;
  score: number; // 0 to 100
  entropy: number;
  estimatedCrackTime: string;
  feedback: string[];
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      strength: 'Weak',
      score: 0,
      entropy: 0,
      estimatedCrackTime: 'Instant',
      feedback: ['Password cannot be empty'],
    };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const length = password.length;
  const entropy = Math.round(length * Math.log2(Math.max(poolSize, 2)));

  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (length >= 16) score += 40;
  else if (length >= 12) score += 30;
  else if (length >= 8) score += 15;
  else {
    score += 5;
    feedback.push('Password is shorter than 8 characters');
  }

  // Diversity scoring
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push('Add numerical digits');

  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  else feedback.push('Add special symbols');

  // Repetition penalty
  if (/(.)\1{2,}/.test(password)) {
    score -= 15;
    feedback.push('Avoid repeating identical characters');
  }

  score = Math.max(0, Math.min(100, score));

  let strength: PasswordStrengthLevel = 'Weak';
  if (score >= 90) strength = 'Very Strong';
  else if (score >= 75) strength = 'Strong';
  else if (score >= 55) strength = 'Good';
  else if (score >= 35) strength = 'Fair';

  let estimatedCrackTime = 'A few seconds';
  if (entropy > 85) estimatedCrackTime = '3,000+ centuries';
  else if (entropy > 70) estimatedCrackTime = '120 years';
  else if (entropy > 55) estimatedCrackTime = '4 months';
  else if (entropy > 40) estimatedCrackTime = '3 days';
  else if (entropy > 25) estimatedCrackTime = '3 minutes';

  return {
    strength,
    score,
    entropy,
    estimatedCrackTime,
    feedback,
  };
}
