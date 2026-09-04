'use client';

import React, { useEffect, useRef } from 'react';
import { useVault } from '@/lib/store/vaultContext';

interface VaultFallbackCanvasProps {
  interactive?: boolean;
}

export default function VaultFallbackCanvas({ interactive = true }: VaultFallbackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { activeScanState, selectedCategoryForFocus } = useVault();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Encrypted particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: 120 + Math.random() * 240,
      speed: (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.6,
      char: ['0', '1', '§', '◊', '◈', '•'][Math.floor(Math.random() * 6)],
    }));

    // Orbiting Category Nodes
    const categories = [
      { name: 'Developer', angle: 0, radius: 260 },
      { name: 'Work', angle: (Math.PI * 2) / 7, radius: 290 },
      { name: 'Social', angle: ((Math.PI * 2) / 7) * 2, radius: 250 },
      { name: 'Finance', angle: ((Math.PI * 2) / 7) * 3, radius: 280 },
      { name: 'AI Tools', angle: ((Math.PI * 2) / 7) * 4, radius: 270 },
      { name: 'Education', angle: ((Math.PI * 2) / 7) * 5, radius: 240 },
      { name: 'Personal', angle: ((Math.PI * 2) / 7) * 6, radius: 300 },
    ];

    let time = 0;

    const render = () => {
      time += 0.012;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const offsetX = (mouseX - width / 2) * 0.03;
      const offsetY = (mouseY - height / 2) * 0.03;

      const centerX = width * 0.5 + offsetX;
      const centerY = height * 0.45 + offsetY;

      ctx.clearRect(0, 0, width, height);

      // Background ambient gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, width * 0.8);
      bgGrad.addColorStop(0, 'rgba(253, 242, 240, 0.95)');
      bgGrad.addColorStop(0.5, 'rgba(247, 233, 230, 0.65)');
      bgGrad.addColorStop(1, 'rgba(250, 247, 245, 0.4)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Concentric Mechanical Rings
      const rings = [
        { r: 90, speed: 0.006, segments: 12, dash: [8, 12], width: 1.5, color: 'rgba(183, 110, 96, 0.45)' },
        { r: 140, speed: -0.004, segments: 16, dash: [14, 20], width: 2, color: 'rgba(163, 93, 103, 0.5)' },
        { r: 190, speed: 0.003, segments: 24, dash: [4, 16], width: 1.2, color: 'rgba(200, 138, 125, 0.4)' },
        { r: 230, speed: -0.002, segments: 8, dash: [30, 40], width: 2.5, color: 'rgba(183, 110, 96, 0.35)' },
        { r: 310, speed: 0.001, segments: 32, dash: [2, 10], width: 1, color: 'rgba(212, 163, 115, 0.25)' },
      ];

      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * ring.speed * 40);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.setLineDash(ring.dash);
        ctx.lineWidth = ring.width;
        ctx.strokeStyle = ring.color;
        ctx.stroke();

        // Little mechanical tick notches
        for (let i = 0; i < ring.segments; i++) {
          const a = (i * Math.PI * 2) / ring.segments;
          const x1 = Math.cos(a) * (ring.r - 4);
          const y1 = Math.sin(a) * (ring.r - 4);
          const x2 = Math.cos(a) * (ring.r + 4);
          const y2 = Math.sin(a) * (ring.r + 4);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(183, 110, 96, 0.3)';
          ctx.stroke();
        }
        ctx.restore();
      });

      // 2. Central Core Glow (Breathing Pulse)
      const corePulse = 1 + Math.sin(time * 2.5) * 0.06;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 70 * corePulse);
      coreGrad.addColorStop(0, 'rgba(235, 175, 160, 0.9)');
      coreGrad.addColorStop(0.4, 'rgba(212, 140, 125, 0.6)');
      coreGrad.addColorStop(0.8, 'rgba(183, 110, 96, 0.2)');
      coreGrad.addColorStop(1, 'rgba(183, 110, 96, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Central Shield/Vault Symbol
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(253, 245, 243, 0.9)';
      ctx.strokeStyle = 'rgba(163, 93, 103, 0.6)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(183, 110, 96, 0.5)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.stroke();

      // Inner Core Hexagon / Vault Lock
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 + time * 0.4;
        const hx = centerX + Math.cos(a) * 16;
        const hy = centerY + Math.sin(a) * 16;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(74, 18, 26, 0.75)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 3. Flowing Data Particles & Streams
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = centerX + Math.cos(p.angle) * p.radius;
        const py = centerY + Math.sin(p.angle) * p.radius;

        // Flow line toward core
        if (Math.sin(time + p.radius) > 0.7) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          const midX = px + (centerX - px) * 0.4;
          const midY = py + (centerY - py) * 0.4;
          ctx.lineTo(midX, midY);
          ctx.strokeStyle = `rgba(200, 138, 125, ${p.alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        ctx.font = '10px monospace';
        ctx.fillStyle = `rgba(163, 93, 103, ${p.alpha})`;
        ctx.fillText(p.char, px, py);
      });

      // 4. Orbiting Category Nodes & Connections
      categories.forEach((cat, index) => {
        const currentAngle = cat.angle + time * 0.08;
        const nx = centerX + Math.cos(currentAngle) * cat.radius;
        const ny = centerY + Math.sin(currentAngle) * (cat.radius * 0.7);

        const isFocused = selectedCategoryForFocus === cat.name;

        // Data beam from node to core
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.quadraticCurveTo(
          centerX + Math.cos(currentAngle + 0.3) * (cat.radius * 0.5),
          centerY + Math.sin(currentAngle + 0.3) * (cat.radius * 0.35),
          centerX,
          centerY
        );
        ctx.strokeStyle = isFocused
          ? 'rgba(183, 110, 96, 0.85)'
          : 'rgba(183, 110, 96, 0.2)';
        ctx.lineWidth = isFocused ? 2 : 1;
        ctx.setLineDash(isFocused ? [] : [4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Node Card Capsule
        ctx.save();
        ctx.shadowColor = 'rgba(74, 18, 26, 0.12)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nx, ny, isFocused ? 14 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isFocused ? '#F7E9E8' : 'rgba(255, 250, 248, 0.9)';
        ctx.strokeStyle = isFocused ? '#6B1D27' : 'rgba(183, 110, 96, 0.6)';
        ctx.lineWidth = isFocused ? 2.5 : 1.5;
        ctx.fill();
        ctx.stroke();

        // Node text label
        ctx.font = isFocused ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isFocused ? '#360C13' : 'rgba(74, 18, 26, 0.7)';
        ctx.fillText(cat.name, nx + 14, ny + 4);
        ctx.restore();
      });

      // 5. Security Audit Scanner Wave (when activeScanState === 'scanning')
      if (activeScanState === 'scanning') {
        const scanRadius = ((time * 180) % 360) + 20;
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, scanRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(183, 110, 96, 0.8)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(183, 110, 96, 0.9)';
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Sweeping radar scan line
        const scanAngle = time * 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(scanAngle) * 360, centerY + Math.sin(scanAngle) * 360);
        ctx.strokeStyle = 'rgba(200, 138, 125, 0.75)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive, activeScanState, selectedCategoryForFocus]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.92 }}
    />
  );
}
