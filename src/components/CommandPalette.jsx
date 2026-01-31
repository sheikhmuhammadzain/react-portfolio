import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { FiCommand, FiHome, FiFileText, FiGithub, FiMail, FiDownload, FiTerminal, FiSun, FiMoon } from "react-icons/fi";
import { SiMatrix } from "react-icons/si";

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  const handleMatrixTheme = () => {
    document.documentElement.classList.add('matrix-theme');
    setTimeout(() => {
      alert("Wake up, Neo... (Matrix Theme Activated)");
    }, 500);
  };

  return (
    <>
        <div className="fixed bottom-6 left-6 z-50 md:block hidden">
            <button 
                onClick={() => setOpen(true)}
                className="group flex items-center gap-3 pl-5 pr-5 py-3 bg-[#111] border border-[#222] rounded-2xl shadow-2xl hover:bg-[#151515] transition-all duration-200 cursor-pointer"
            >
                <span className="text-neutral-500 text-sm font-medium pr-2 group-hover:text-neutral-300 transition-colors">Start</span>
                <div className="flex items-center gap-2">
                    <kbd className="mac-key h-12 w-14 flex-col gap-0.5 pb-1">
                        <FiCommand className="text-lg" />
                        <span className="text-[9px] leading-none font-sans opacity-80 font-normal">command</span>
                    </kbd>
                    <span className="text-neutral-600 font-medium">+</span>
                    <kbd className="mac-key h-12 w-12 text-lg">K</kbd>
                </div>
            </button>
        </div>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-[#222] border border-[#333] rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="flex items-center justify-between border-b border-[#333] px-4 py-3">
            <Command.Input 
                placeholder="Type an action or navigate"
                className="flex h-6 w-full bg-transparent text-[15px] font-medium text-neutral-200 placeholder:text-neutral-500 outline-none"
            />
            <span className="text-neutral-600 text-xs">?</span>
        </div>
        
        <Command.List className="max-h-[320px] overflow-y-auto overflow-x-hidden py-2 px-2">
          <Command.Empty className="py-8 text-center text-sm text-neutral-500">No results found.</Command.Empty>

          <Command.Group heading="Navigation" className="text-[11px] font-medium text-neutral-500 px-2 py-1.5 mb-2 uppercase tracking-wider">
            <Command.Item
              value="home"
              onSelect={() => runCommand(() => navigate("/"))}
              className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-[14px] text-neutral-300 outline-none data-[selected=true]:bg-[#333] data-[selected=true]:text-white transition-colors cursor-pointer mb-1"
            >
              <FiHome className="mr-3 h-4 w-4 text-neutral-500" />
              <span>Go to Home</span>
            </Command.Item>
            <Command.Item
              value="blogs"
              onSelect={() => runCommand(() => navigate("/blogs"))}
              className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-[14px] text-neutral-300 outline-none data-[selected=true]:bg-[#333] data-[selected=true]:text-white transition-colors cursor-pointer mb-1"
            >
              <FiFileText className="mr-3 h-4 w-4 text-neutral-500" />
              <span>Go to Blogs</span>
            </Command.Item>
            <Command.Item
               value="contact"
              onSelect={() => runCommand(() => document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' }))}
              className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-[14px] text-neutral-300 outline-none data-[selected=true]:bg-[#333] data-[selected=true]:text-white transition-colors cursor-pointer mb-1"
            >
              <FiMail className="mr-3 h-4 w-4 text-neutral-500" />
              <span>Contact Zain</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="my-2 h-[1px] bg-[#333]" />

          <Command.Group heading="Utility" className="text-[11px] font-medium text-neutral-500 px-2 py-1.5 mb-2 mt-2 uppercase tracking-wider">
             <Command.Item
                value="github"
                onSelect={() => runCommand(() => window.open('https://github.com/sheikhmuhammadzain', '_blank'))}
                className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-[14px] text-neutral-300 outline-none data-[selected=true]:bg-[#333] data-[selected=true]:text-white transition-colors cursor-pointer mb-1"
            >
                <FiGithub className="mr-3 h-4 w-4 text-neutral-500" />
                <span>Open Github</span>
            </Command.Item>
             <Command.Item
              value="admin"
              onSelect={() => runCommand(() => navigate("/login"))}
              className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-[14px] text-neutral-300 outline-none data-[selected=true]:bg-[#333] data-[selected=true]:text-white transition-colors cursor-pointer mb-1"
            >
              <FiTerminal className="mr-3 h-4 w-4 text-neutral-500" />
              <span>Admin Login</span>
            </Command.Item>
             <Command.Item
              value="matrix"
              onSelect={() => runCommand(handleMatrixTheme)}
              className="relative flex cursor-default select-none items-center rounded-lg px-3 py-3 text-[14px] text-neutral-300 outline-none data-[selected=true]:bg-[#333] data-[selected=true]:text-white transition-colors cursor-pointer mb-1"
            >
              <SiMatrix className="mr-3 h-4 w-4 text-neutral-500" />
              <span>Toggle Matrix Theme</span>
            </Command.Item>
          </Command.Group>

        </Command.List>

        <div className="flex items-center gap-4 px-4 py-3 border-t border-[#333] bg-[#252525] text-[11px] text-neutral-500">
            <div className="flex items-center gap-1">
                <kbd className="mac-key h-4 px-1 text-[9px] bg-[#333] border-[#444]">↑</kbd>
                <kbd className="mac-key h-4 px-1 text-[9px] bg-[#333] border-[#444]">↓</kbd>
                <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1">
                <kbd className="mac-key h-4 px-1 text-[9px] bg-[#333] border-[#444]">↵</kbd>
                <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
                <kbd className="mac-key h-4 px-1 text-[9px] bg-[#333] border-[#444]">esc</kbd>
                <span>to close</span>
            </div>
        </div>

      </Command.Dialog>
      
      {/* Overlay Backdrop - Custom logic because cmdk dialog overlay sometimes conflicts */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setOpen(false)} />
      )}
    </>
  );
};

export default CommandPalette;
