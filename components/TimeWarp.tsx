import React, { useEffect, useRef, useState } from 'react';

interface TimeWarpProps {
  targetYear: string;
  onTravelComplete: () => void;
}

const TimeWarp: React.FC<TimeWarpProps> = ({ targetYear, onTravelComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [yearDisplay, setYearDisplay] = useState(new Date().getFullYear());
  // Fix: Initialize useRef with 0 to satisfy TypeScript requirement of 1 argument for non-optional types.
  const requestRef = useRef<number>(0);
  const speedRef = useRef(2); // Initial speed

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; z: number }[] = [];
    const numStars = 1000;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
      });
    }

    const animate = () => {
      // Clear with a trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Accelerate
      if (speedRef.current < 50) {
        speedRef.current += 0.5;
      }

      stars.forEach((star) => {
        star.z -= speedRef.current;

        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const x = (star.x / star.z) * 100 + centerX;
        const y = (star.y / star.z) * 100 + centerY;
        const size = (1 - star.z / width) * 4;

        // Draw star
        const opacity = (1 - star.z / width);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size > 0 ? size : 0, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Countdown Logic
  useEffect(() => {
    const target = parseInt(targetYear, 10);
    const start = new Date().getFullYear();
    const duration = 4000; // 4 seconds total travel time
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for the year counter
      const easeInOutCubic = (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      
      const current = Math.floor(start - (start - target) * easeInOutCubic(progress));
      setYearDisplay(current);

      if (progress >= 1) {
        clearInterval(timer);
        // Wait a beat after reaching the year before transitioning
        setTimeout(onTravelComplete, 1000); 
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetYear, onTravelComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 text-center animate-pulse">
        <h2 className="text-8xl md:text-9xl font-bold font-mono-display text-white tracking-tighter tabular-nums" style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}>
          {yearDisplay}
        </h2>
        <p className="text-neutral-400 mt-4 font-mono-display tracking-widest uppercase text-sm">Traversing timeline...</p>
      </div>
    </div>
  );
};

export default TimeWarp;