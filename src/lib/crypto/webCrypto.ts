/**
 * Web Crypto API wrapper for Zero-Knowledge Client-Side Encryption
 * Uses PBKDF2 (SHA-256) for Master Key derivation and AES-256-GCM for credential encryption.
 */

// Convert ArrayBuffer to Base64 string
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to Uint8Array
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive a 256-bit AES-GCM Key from Master Password + Salt
export async function deriveMasterKey(masterPassword: string, saltStr = 'SecureVault-Global-Salt-2026'): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = enc.encode(saltStr);

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Hash password for authentication verifier (SHA-256 with salt)
export async function hashMasterPasswordVerifier(masterPassword: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`sv_auth_verifier_${masterPassword}_salt_secure`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToBase64(hashBuffer);
}

// Encrypt plaintext with derived CryptoKey using AES-256-GCM
export async function encryptData(plaintext: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV recommended for AES-GCM
  const enc = new TextEncoder();
  const encodedData = enc.encode(plaintext);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv),
  };
}

// Decrypt ciphertext with derived CryptoKey using AES-256-GCM
export async function decryptData(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
  const cipherBuffer = base64ToBuffer(ciphertext);
  const ivBuffer = base64ToBuffer(iv);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBuffer.buffer as ArrayBuffer,
    },
    key,
    cipherBuffer.buffer as ArrayBuffer
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

// Generate a random recovery key (24-word or hex-formatted safe recovery code)
export function generateRecoveryKey(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  // Format as 4 groups of 8 characters: XXXX-XXXX-XXXX-XXXX
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 24)}`;
}
