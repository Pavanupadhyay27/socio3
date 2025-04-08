import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  filters: Array<{ icon: any; label: string }>;
  communities: Array<{ name: string; members: string; icon: string }>;
}

export const Sidebar = ({ 
  isSidebarCollapsed, 
  setSidebarCollapsed, 
  filters, 
  communities 
}: SidebarProps) => {
  return (
    <div className={`${
      isSidebarCollapsed ? 'w-16' : 'w-64'
    } fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 hidden lg:block`}>
      <div className="flex flex-col h-full bg-black">
        {/* Collapse button */}
        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-300 transition-colors w-full"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!isSidebarCollapsed && <span>Collapse Menu</span>}
          </motion.button>
        </div>

        {/* Rest of sidebar content */}
        {!isSidebarCollapsed && (
          // ... Your existing sidebar content code ...
        )}
      </div>
    </div>
  );
};
