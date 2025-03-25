import React from 'react';
import { motion } from 'framer-motion';

const FireIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FF4D4D" />
        <stop offset="50%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
      <filter id="fireGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <motion.path
      d="M12 2C9.5 7 4 8.5 4 14.5C4 18.64 7.36 22 11.5 22C15.64 22 19 18.64 19 14.5C19 8.5 13.5 7 11 2"
      fill="url(#fireGradient)"
      filter="url(#fireGlow)"
      animate={{
        d: [
          "M12 2C9.5 7 4 8.5 4 14.5C4 18.64 7.36 22 11.5 22C15.64 22 19 18.64 19 14.5C19 8.5 13.5 7 11 2",
          "M12 2C10 7.5 4.5 9 4.5 14.5C4.5 18.64 7.86 22 12 22C16.14 22 19.5 18.64 19.5 14.5C19.5 9 14 7.5 12 2"
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </motion.path>
    
    <motion.circle
      cx="12"
      cy="14"
      r="4"
      fill="#FFFF00"
      animate={{
        r: [4, 4.5, 4],
        opacity: [0.5, 0.7, 0.5],
        filter: ["blur(2px)", "blur(3px)", "blur(2px)"]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </svg>
);

export default FireIcon;
