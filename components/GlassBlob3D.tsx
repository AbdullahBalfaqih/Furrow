'use client';

import React, { useEffect, useRef } from 'react';

export default function GlassBlob3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const width = 240;
    const height = 240;
    canvas.width = width * 2;
    canvas.height = height * 2;

    const pointsCount = 12;
    const baseRadius = 75;

    const render = () => {
      step += 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(2, 2);
      ctx.translate(width / 2, height / 2);

      // Generate organic fluid morphing points
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        const offset1 = Math.sin(step * 1.2 + i * 1.5) * 14;
        const offset2 = Math.cos(step * 0.9 - i * 0.8) * 10;
        const r = baseRadius + offset1 + offset2;

        points.push({
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
        });
      }

      // Draw Glass Body Path with smooth Bézier curves
      ctx.beginPath();
      ctx.moveTo((points[0].x + points[pointsCount - 1].x) / 2, (points[0].y + points[pointsCount - 1].y) / 2);

      for (let i = 0; i < pointsCount; i++) {
        const current = points[i];
        const next = points[(i + 1) % pointsCount];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      ctx.closePath();

      // Pure Signature Beige & Sage Glass Shading
      const gradX1 = Math.cos(step * 0.5) * 60;
      const gradY1 = Math.sin(step * 0.5) * 60;
      const gradX2 = Math.cos(step * 0.5 + Math.PI) * 70;
      const gradY2 = Math.sin(step * 0.5 + Math.PI) * 70;

      const glassGradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
      glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      glassGradient.addColorStop(0.35, 'rgba(230, 232, 221, 0.85)'); // Signature Beige #E6E8DD
      glassGradient.addColorStop(0.7, 'rgba(197, 200, 180, 0.5)'); // Sage Beige #C5C8B4
      glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

      ctx.fillStyle = glassGradient;
      ctx.fill();

      // Glass Edge Inner Refraction Stroke
      ctx.lineWidth = 2.5;
      const strokeGrad = ctx.createLinearGradient(-80, -80, 80, 80);
      strokeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      strokeGrad.addColorStop(0.5, 'rgba(197, 200, 180, 0.7)');
      strokeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      ctx.strokeStyle = strokeGrad;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '220px',
          height: '220px',
          filter: 'drop-shadow(0 15px 30px rgba(197, 200, 180, 0.3))',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}
