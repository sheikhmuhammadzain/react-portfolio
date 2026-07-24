import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";

// Minimal back-to-top button. Appears after the first viewport of scrolling;
// sits above the chat blob in the bottom-right corner.
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          title="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-300 shadow-lg backdrop-blur-sm ring-1 ring-white/10 transition-colors hover:bg-neutral-800 hover:text-white sm:bottom-6 sm:right-6"
        >
          <HugeiconsIcon icon={ArrowUp01Icon} size={20} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
