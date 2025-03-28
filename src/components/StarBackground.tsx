import { useEffect, useRef } from 'react';

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const STAR_COUNT = 500; // Increased count for better distribution
    let animationFrameId: number;

    const resizeCanvas = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      ctx.scale(scale, scale);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    const createStars = () => {
      stars.length = 0; // Clear existing stars
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 1.2, // Reduced max size from 2 to 1.2
          speed: Math.random() * 0.3 + 0.1 // Reduced speed range
        });
      }
    };

    const drawStars = () => {
      ctx.fillStyle = 'rgb(9, 10, 15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - scrollRef.current;
      scrollRef.current = currentScroll;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Update star position with scroll offset
        star.y += star.speed + scrollDelta * 0.1;

        // Reset star position when it goes off screen
        if (star.y > window.innerHeight) {
          star.y = 0;
          star.x = Math.random() * window.innerWidth;
        } else if (star.y < 0) {
          star.y = window.innerHeight;
          star.x = Math.random() * window.innerWidth;
        }
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    // Handle resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createStars();
      }, 100);
    };

    resizeCanvas();
    createStars();
    drawStars();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-40"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
      }}
    />
  );
};

export default StarBackground;
