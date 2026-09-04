'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import VaultFallbackCanvas from './VaultFallbackCanvas';

// Dynamically import Canvas with SSR disabled
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const VaultCore3D = dynamic(
  () => import('./VaultCore3D'),
  { ssr: false }
);

export default function DigitalVaultCanvas() {
  const [use3D, setUse3D] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect WebGL capability and mobile devices
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (gl && !isMobile) {
        setUse3D(true);
      } else {
        setUse3D(false);
      }
    } catch {
      setUse3D(false);
    }
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 bg-[#FAF7F5] -z-10" />;
  }

  if (!use3D) {
    return <VaultFallbackCanvas interactive={true} />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden bg-gradient-to-b from-[#FAF7F5] via-[#FDF8F7] to-[#F5EFEB]">
      <Suspense fallback={<VaultFallbackCanvas interactive={true} />}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full pointer-events-none"
        >
          <VaultCore3D />
        </Canvas>
      </Suspense>
    </div>
  );
}
