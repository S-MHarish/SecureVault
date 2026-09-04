import type { Metadata } from 'next';
import './globals.css';
import { VaultProvider } from '@/lib/store/vaultContext';
import DigitalVaultCanvas from '@/components/3d/DigitalVaultCanvas';
import LockScreenOverlay from '@/components/auth/LockScreenOverlay';
import CommandPalette from '@/components/navigation/CommandPalette';
import AddEditAccountModal from '@/components/accounts/AddEditAccountModal';
import RunAuditModal from '@/components/security/RunAuditModal';
import AISecurityAdvisorDrawer from '@/components/security/AISecurityAdvisorDrawer';
import ExtensionSimulatorModal from '@/components/extension/ExtensionSimulatorModal';

export const metadata: Metadata = {
  title: 'SecureVault AI — Intelligent Digital Identity & Credential Manager',
  description:
    'One secure place to remember, organize, monitor, and intelligently manage every digital account with zero-knowledge encryption and AI security intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative text-vault-maroon selection:bg-vault-blush selection:text-vault-maroonDark">
        <VaultProvider>
          {/* Signature 3D Digital Vault Background */}
          <DigitalVaultCanvas />

          {/* Master Content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>

          {/* Interactive Modals & Overlays */}
          <LockScreenOverlay />
          <CommandPalette />
          <AddEditAccountModal />
          <RunAuditModal />
          <AISecurityAdvisorDrawer />
          <ExtensionSimulatorModal />
        </VaultProvider>
      </body>
    </html>
  );
}
