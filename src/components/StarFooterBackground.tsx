import React, { useEffect, useRef } from 'react';

const StarFooterBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: { x: number; y: number; size: number; opacity: number }[] = [];
    const STAR_COUNT = 250; // Increased star count

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.8 + 0.1, // Smaller size range
          opacity: Math.random() * 0.8 + 0.2 // Higher base opacity
        });
      }
    };

    const drawStars = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Update star opacity for twinkling
        star.opacity = (Math.sin(Date.now() * 0.002 + star.x) * 0.3 + 0.7) * 0.8;

        // Move stars slowly upward
        star.y -= 0.05;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(drawStars);
    };

    // Initial setup
    resizeCanvas();
    createStars();
    drawStars();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 1, background: 'black' }}
    />
  );
};

export default StarFooterBackground;
