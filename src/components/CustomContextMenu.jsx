import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, File01Icon, Message01Icon, Mail01Icon, Download04Icon, GithubIcon, MatrixIcon } from "@hugeicons/core-free-icons";
import { downloadResume } from "../utils/downloadResume";
import { scrollToHomeSection } from "../utils/scrollToHomeSection";

const CustomContextMenu = ({ openChat }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      
      const { clientX: mouseX, clientY: mouseY } = e;
      
      const menuWidth = 220;
      const menuHeight = 320;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let x = mouseX;
      let y = mouseY;

      if (x + menuWidth > screenWidth) {
        x = screenWidth - menuWidth - 10;
      }
      if (y + menuHeight > screenHeight) {
        y = screenHeight - menuHeight - 10;
      }

      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    
    const handleScroll = () => {
        if(visible) setVisible(false);
    }

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  const handleAction = (action) => {
    setVisible(false);
    action();
  };

  const handleMatrixTheme = () => {
    if (document.documentElement.classList.contains('matrix-theme')) {
        document.documentElement.classList.remove('matrix-theme');
    } else {
        document.documentElement.classList.add('matrix-theme');
        setTimeout(() => {
          alert("Wake up, Neo... (Matrix Theme Activated)");
        }, 500);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[9999] w-56 rounded-xl border border-neutral-800 bg-[#1a1a1a]/95 backdrop-blur-md shadow-2xl py-2"
            style={{ top: position.y, left: position.x }}
        >
          <div className="px-2 pb-2 mb-2 border-b border-neutral-800">
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider pl-2 mt-1">Devfolio Actions</p>
          </div>

          <div className="flex flex-col px-1 gap-0.5">
            <ContextMenuItem 
                icon={<HugeiconsIcon icon={Home01Icon} size={16} strokeWidth={1.8} className="text-neutral-400" />}
                label="Go to Home" 
                onClick={() => handleAction(() => navigate("/"))} 
            />
            <ContextMenuItem 
                icon={<HugeiconsIcon icon={File01Icon} size={16} strokeWidth={1.8} className="text-neutral-400" />}
                label="Read Blogs" 
                onClick={() => handleAction(() => navigate("/blogs"))} 
            />
            <ContextMenuItem 
                icon={<HugeiconsIcon icon={Message01Icon} size={16} strokeWidth={1.8} className="text-cyan-400" />}
                label="Chat with Zain" 
                onClick={() => handleAction(openChat)} 
                highlight
            />
            
            <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                className="h-[1px] bg-neutral-800 my-1 mx-2" 
            />

            <ContextMenuItem 
                icon={<HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.8} className="text-neutral-400" />}
                label="Contact Me" 
                onClick={() => handleAction(() => scrollToHomeSection(navigate, "contact"))}
            />
            <ContextMenuItem 
                icon={<HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} className="text-neutral-400" />}
                label="Download Resume" 
                onClick={() => handleAction(downloadResume)} 
            />
            <ContextMenuItem 
                icon={<HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.8} className="text-neutral-400" />}
                label="View Source" 
                onClick={() => handleAction(() => window.open('https://github.com/sheikhmuhammadzain', '_blank'))} 
            />
            
            <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: "100%" }} 
                className="h-[1px] bg-neutral-800 my-1 mx-2" 
            />
            
            <ContextMenuItem 
                icon={<HugeiconsIcon icon={MatrixIcon} size={16} strokeWidth={1.8} className="text-green-500" />} 
                label="Matrix Mode" 
                onClick={() => handleAction(handleMatrixTheme)} 
            />
          </div>
          
          <div className="px-3 pt-2 mt-2 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-600">
            <span>Devfolio v2.0</span>
            <button 
                onClick={() => setVisible(false)}
                className="hover:text-neutral-400 transition-colors"
            >
                ESC
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ContextMenuItem = ({ icon, label, onClick, highlight }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 group text-left ${
        highlight 
        ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' 
        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white hover:translate-x-1'
    }`}
  >
    <span className="text-base">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

export default CustomContextMenu;
