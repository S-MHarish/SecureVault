'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useVault } from '@/lib/store/vaultContext';

export default function VaultCore3D() {
  const { activeScanState, selectedCategoryForFocus } = useVault();

  const outerGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);

  // Orbiting Category Nodes Data
  const categories = useMemo(() => [
    { name: 'Developer', radius: 3.8, speed: 0.15, offset: 0, yOffset: 0.2 },
    { name: 'Work', radius: 4.2, speed: 0.12, offset: 1.0, yOffset: -0.3 },
    { name: 'Social', radius: 3.6, speed: 0.18, offset: 2.1, yOffset: 0.4 },
    { name: 'Finance', radius: 4.5, speed: 0.10, offset: 3.2, yOffset: -0.1 },
    { name: 'AI Tools', radius: 3.9, speed: 0.14, offset: 4.3, yOffset: 0.3 },
    { name: 'Education', radius: 3.4, speed: 0.16, offset: 5.4, yOffset: -0.4 },
  ], []);

  // Encrypted Particles
  const [particlePositions, particleColors] = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new THREE.Color('#B76E60');
    const lightColor = new THREE.Color('#F7E9E8');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.8 + Math.random() * 3.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4; // Flattened disc
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixed = baseColor.clone().lerp(lightColor, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle mouse parallax
    if (outerGroupRef.current) {
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.25;
      outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(outerGroupRef.current.rotation.y, targetX, 0.04);
      outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(outerGroupRef.current.rotation.x, -targetY, 0.04);
    }

    // Vault Rings Counter-Rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.25;
      ring1Ref.current.rotation.x = Math.sin(time * 0.4) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.18;
      ring2Ref.current.rotation.y = Math.cos(time * 0.3) * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.1;
    }

    // Pulsing central core
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 2.2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x += delta * 0.2;
    }

    // Encrypted particles rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.08;
    }

    // Scan wave animation
    if (scanRingRef.current) {
      if (activeScanState === 'scanning') {
        const scanScale = (time * 2) % 4 + 0.5;
        scanRingRef.current.scale.set(scanScale, scanScale, scanScale);
        (scanRingRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scanScale / 4.5);
      } else {
        scanRingRef.current.scale.set(0.01, 0.01, 0.01);
      }
    }
  });

  return (
    <group ref={outerGroupRef} position={[0, 0, 0]}>
      {/* Ambient & Directional Lights */}
      <ambientLight intensity={0.8} color="#FAF7F5" />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#F7E9E8" />
      <pointLight position={[0, 0, 0]} intensity={1.8} distance={8} color="#C88A7D" />

      {/* Central Security Core: Dual Translucent Octahedron / Sphere */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#C88A7D"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
          emissive="#6B1D27"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner Glowing Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FDF8F7" transparent opacity={0.9} />
      </mesh>

      {/* Mechanical Ring 1: Inner Rose Metal Ring */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.5, 0.04, 16, 64]} />
          <meshStandardMaterial color="#B76E60" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Ring teeth / notches */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 12;
          return (
            <mesh key={`notch-1-${i}`} position={[Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0]}>
              <boxGeometry args={[0.06, 0.12, 0.04]} />
              <meshStandardMaterial color="#6B1D27" metalness={0.7} roughness={0.3} />
            </mesh>
          );
        })}
      </group>

      {/* Mechanical Ring 2: Middle Translucent Glass Ring */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[2.3, 0.05, 16, 80]} />
          <meshStandardMaterial
            color="#A35D67"
            metalness={0.7}
            roughness={0.1}
            transparent
            opacity={0.75}
          />
        </mesh>
      </group>

      {/* Mechanical Ring 3: Outer Slotted Copper Ring */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[3.0, 0.03, 16, 100]} />
          <meshStandardMaterial color="#C88A7D" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Encrypted Data Particle Swarm */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Orbiting Category Nodes */}
      {categories.map((cat, idx) => (
        <group key={`cat-${cat.name}-${idx}`} position={[
          Math.cos(cat.offset) * cat.radius,
          cat.yOffset,
          Math.sin(cat.offset) * cat.radius * 0.4
        ]}>
          <mesh>
            <sphereGeometry args={[selectedCategoryForFocus === cat.name ? 0.22 : 0.14, 16, 16]} />
            <meshStandardMaterial
              color={selectedCategoryForFocus === cat.name ? '#6B1D27' : '#B76E60'}
              metalness={0.8}
              roughness={0.2}
              emissive={selectedCategoryForFocus === cat.name ? '#C88A7D' : '#360C13'}
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Subtle connection line to core */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0, 0, -Math.cos(cat.offset) * cat.radius * 0.5, -cat.yOffset * 0.5, -Math.sin(cat.offset) * cat.radius * 0.2]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#B76E60" transparent opacity={0.25} />
          </line>
        </group>
      ))}

      {/* Security Audit Pulse Wave */}
      <mesh ref={scanRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 64]} />
        <meshBasicMaterial color="#C88A7D" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
