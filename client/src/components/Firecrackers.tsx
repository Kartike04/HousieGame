import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface FirecrackersProps {
  active: boolean;
}

export const Firecrackers: React.FC<FirecrackersProps> = ({ active }) => {
  useEffect(() => {
    if (!active) return;

    soundManager.playFirecrackerSound();

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 45,
        spread: 360,
        ticks: 90,
        origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() * 0.5 + 0.2 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6', '#eab308'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });

      confetti({
        particleCount,
        startVelocity: 45,
        spread: 360,
        ticks: 90,
        origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() * 0.5 + 0.2 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6', '#eab308'],
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    }, 250);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-20 animate-pulse" />
    </div>
  );
};
