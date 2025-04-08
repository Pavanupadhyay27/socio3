import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <motion.div 
      className="min-h-screen bg-black relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 pointer-events-none" />
      <div className="relative z-10 pb-24">
        {children}
      </div>
    </motion.div>
  );
};
