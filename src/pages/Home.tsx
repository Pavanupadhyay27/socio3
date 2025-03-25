import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Virtual list component for better performance
const VirtualizedParticles = ({ count }: { count: number }) => {
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: Math.min(50, count) });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleRange(prev => ({
              start: 0,
              end: Math.min(prev.end + 20, count)
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none mix-blend-screen">
      {Array.from({ length: visibleRange.end - visibleRange.start }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 will-change-transform"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 2,
            opacity: 0
          }}
          animate={{
            y: [null, Math.random() * 100 + "%"],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
          style={{
            filter: "blur(1px)",
            transform: "translate3d(0,0,0)", // Force GPU acceleration
            backfaceVisibility: "hidden"
          }}
        />
      ))}
    </div>
  );
};

// Optimized star background
const StarBackground = () => {
  const stars = React.useMemo(() => {
    return Array.from({ length: 100 }).map(() => ({
      size: Math.random() * 2 + 0.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full will-change-transform"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              background: `rgba(255, 255, 255, ${star.opacity})`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
              transform: "translate3d(0,0,0)",
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center">
      <StarBackground />
      
      {/* Main content - Now properly centered */}
      <div 
        ref={contentRef} 
        className="relative w-full flex items-center justify-center py-20"
        style={{ minHeight: 'calc(100vh - 4rem)' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          {/* Hero Content Container */}
          <div className="flex flex-col items-center justify-center relative z-10">
            {/* Title Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center w-full"
            >
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main Title Stack */}
              <div className="relative space-y-8">
                <motion.h1 
                  className="flex flex-col items-center gap-4 font-bold font-orbitron"
                  style={{ perspective: "1000px" }}
                >
                  {/* Web3 Text */}
                  <motion.span
                    className="text-8xl md:text-9xl lg:text-[10rem] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 
                      text-transparent bg-clip-text leading-none tracking-tight"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(168,85,247,0.5)",
                        "0 0 35px rgba(168,85,247,0.35)",
                        "0 0 20px rgba(168,85,247,0.5)"
                      ]
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Web3
                  </motion.span>

                  {/* Community Hub Text */}
                  <motion.div className="text-4xl md:text-5xl lg:text-6xl flex items-center gap-4">
                    <motion.span
                      animate={{
                        x: [-10, 0, -10]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500"
                    >
                      Community
                    </motion.span>
                    <motion.span
                      animate={{
                        x: [10, 0, 10]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-500"
                    >
                      Hub
                    </motion.span>
                  </motion.div>
                </motion.h1>

                {/* Description - Adjusted width and spacing */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-xl md:text-2xl text-purple-100/90 max-w-2xl mx-auto font-light 
                    leading-relaxed tracking-wide backdrop-blur-sm rounded-xl p-6
                    bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20"
                >
                  Connect, discuss, and shape the future of Web3. Your gateway to decentralized conversations 
                  and communities in the digital frontier.
                </motion.p>

                {/* CTA Buttons - Adjusted spacing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
                >
                  <motion.button
                    onClick={() => navigate('/create')}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 30px rgba(168,85,247,0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 
                      rounded-xl text-white text-lg font-orbitron tracking-wider transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Explore Now
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </span>
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity 
                        duration-300 bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-purple-600/50 blur-xl"
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 rounded-xl border-2 border-white/20 hover:border-white/40
                      text-white text-lg font-orbitron tracking-wider bg-white/5 backdrop-blur-sm
                      transition-all duration-300 hover:bg-white/10"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Optimized particles */}
      <VirtualizedParticles count={15} />
    </div>
  );
}
